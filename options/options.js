/* ============================================
   TabFlow - Options Page Logic
   ============================================ */

'use strict';

const STORAGE_KEY_SESSIONS = 'tabflow_sessions';
const STORAGE_KEY_PRO = 'tabflow_pro';
// Valid licenses start with "TFP-" for demo; in production these would be
// verified server-side. Never store real secrets in extension code.
const LICENSE_PREFIX = 'TFP-';

let allSessions = [];
let isPro = false;

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupNav();
  setupWelcome();
  setupGeneral();
  setupSessionsTab();
  setupUpgrade();
});

// ── Data ────────────────────────────────────────────────────────────────────
async function loadData() {
  const data = await chrome.storage.local.get([STORAGE_KEY_SESSIONS, STORAGE_KEY_PRO, 'tabflow_nudge_dismissed']);
  allSessions = data[STORAGE_KEY_SESSIONS] || [];
  isPro = data[STORAGE_KEY_PRO] === true;

  const nudge = document.getElementById('toggle-nudge');
  if (nudge) nudge.checked = !data.tabflow_nudge_dismissed;
}

async function saveSessions() {
  await chrome.storage.local.set({ [STORAGE_KEY_SESSIONS]: allSessions });
}

// ── Navigation ──────────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.dataset.section;
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      link.classList.add('active');
      document.getElementById('section-' + sec).classList.add('active');
    });
  });

  // Handle hash
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const link = document.querySelector('[data-section="' + hash + '"]');
    if (link) link.click();
  }
}

// ── Welcome ─────────────────────────────────────────────────────────────────
function setupWelcome() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('welcome') === '1') {
    document.getElementById('welcome-banner').classList.remove('hidden');
  }
}

// ── General Settings ─────────────────────────────────────────────────────────
function setupGeneral() {
  const nudge = document.getElementById('toggle-nudge');
  nudge.addEventListener('change', async () => {
    await chrome.storage.local.set({ tabflow_nudge_dismissed: !nudge.checked });
    showToast(nudge.checked ? 'Shopping reminder enabled' : 'Shopping reminder disabled');
  });

  document.getElementById('btn-export').addEventListener('click', exportSessions);
  document.getElementById('file-import').addEventListener('change', importSessions);
  document.getElementById('btn-delete-all').addEventListener('click', async () => {
    if (confirm('Delete ALL saved sessions? This cannot be undone.')) {
      allSessions = [];
      await saveSessions();
      renderSessionsTab();
      showToast('All sessions deleted');
    }
  });
}

function exportSessions() {
  const json = JSON.stringify({ version: 1, sessions: allSessions }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tabflow-sessions-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Sessions exported');
}

async function importSessions(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const imported = parsed.sessions || parsed;
    if (!Array.isArray(imported)) throw new Error('Invalid format');
    allSessions = [...imported, ...allSessions];
    await saveSessions();
    renderSessionsTab();
    showToast('Imported ' + imported.length + ' sessions');
  } catch (err) {
    showToast('Import failed: invalid file');
  }
  e.target.value = '';
}

// ── Sessions Tab ─────────────────────────────────────────────────────────────
function setupSessionsTab() {
  renderSessionsTab();
}

function renderSessionsTab() {
  const el = document.getElementById('sessions-overview');
  if (!allSessions.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8"><p style="font-size:16px">No sessions saved yet</p><p style="font-size:13px;margin-top:8px">Use the TabFlow popup to save your first session</p></div>';
    return;
  }
  el.innerHTML = allSessions.map(sess => {
    const date = new Date(sess.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return [
      '<div class="session-overview-card">',
      '  <div>',
      '    <div class="session-ov-name">' + escHtml(sess.name) + '</div>',
      '    <div class="session-ov-meta">' + sess.tabs.length + ' tabs &bull; ' + date + '</div>',
      '  </div>',
      '  <button class="btn btn-danger" data-delete="' + escHtml(sess.id) + '" style="padding:5px 12px">Delete</button>',
      '</div>'
    ].join('');
  }).join('');

  el.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      allSessions = allSessions.filter(s => s.id !== btn.dataset.delete);
      await saveSessions();
      renderSessionsTab();
      showToast('Session deleted');
    });
  });
}

// ── Upgrade / License ─────────────────────────────────────────────────────────
function setupUpgrade() {
  document.getElementById('btn-activate').addEventListener('click', activateLicense);
  document.getElementById('license-key').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') activateLicense();
  });

  if (isPro) {
    document.getElementById('license-status').textContent = 'Pro is active on this device';
    document.getElementById('license-status').className = 'license-status success';
  }
}

async function activateLicense() {
  const key = document.getElementById('license-key').value.trim();
  const statusEl = document.getElementById('license-status');

  if (!key) {
    statusEl.textContent = 'Please enter a license key';
    statusEl.className = 'license-status error';
    return;
  }

  // Simple local validation (in production this would be a server check)
  if (key.startsWith(LICENSE_PREFIX) && key.length >= 12) {
    await chrome.storage.local.set({ [STORAGE_KEY_PRO]: true });
    isPro = true;
    statusEl.textContent = 'Pro activated! Enjoy unlimited sessions.';
    statusEl.className = 'license-status success';
    showToast('TabFlow Pro activated!');
  } else {
    statusEl.textContent = 'Invalid license key. Please check and try again.';
    statusEl.className = 'license-status error';
  }
}

// ── Utilities ────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

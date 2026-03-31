/* ============================================
   TabFlow - Options Page Logic
   ============================================ */

'use strict';

const STORAGE_KEY_SESSIONS = 'tabflow_sessions';
const STORAGE_KEY_PRO = 'tabflow_pro';
const STORAGE_KEY_THEME = 'tabflow_theme';
// Valid licenses start with "TFP-" for demo; in production these would be
// verified server-side. Never store real secrets in extension code.
const LICENSE_PREFIX = 'TFP-';

let allSessions = [];
let isPro = false;
let currentTheme = 'light';

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  applyTheme(currentTheme);
  setupNav();
  setupWelcome();
  setupGeneral();
  setupSessionsTab();
  setupUpgrade();
});

// ── Data ────────────────────────────────────────────────────────────────────
async function loadData() {
  const localData = await chrome.storage.local.get([
    STORAGE_KEY_SESSIONS, STORAGE_KEY_PRO, 'tabflow_nudge_dismissed', STORAGE_KEY_THEME
  ]);
  isPro = localData[STORAGE_KEY_PRO] === true;
  currentTheme = localData[STORAGE_KEY_THEME] || 'light';

  if (isPro) {
    // Pro users: prefer sync storage for cross-device sessions
    try {
      const syncData = await chrome.storage.sync.get(STORAGE_KEY_SESSIONS);
      allSessions = syncData[STORAGE_KEY_SESSIONS] || localData[STORAGE_KEY_SESSIONS] || [];
    } catch (_) {
      allSessions = localData[STORAGE_KEY_SESSIONS] || [];
    }
  } else {
    allSessions = localData[STORAGE_KEY_SESSIONS] || [];
  }

  const nudge = document.getElementById('toggle-nudge');
  if (nudge) nudge.checked = !localData.tabflow_nudge_dismissed;
}

async function saveSessions() {
  if (isPro) {
    try {
      await chrome.storage.sync.set({ [STORAGE_KEY_SESSIONS]: allSessions });
    } catch (_) {
      // Quota exceeded – fall back to local silently
    }
  }
  // Always write to local as a backup / for free users
  await chrome.storage.local.set({ [STORAGE_KEY_SESSIONS]: allSessions });
}

// ── Theme ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
  document.body.classList.add('theme-' + theme);
  // Sync active state on buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

// ── Navigation ──────────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.dataset.section || link.dataset.nav;
      navigateTo(sec);
    });
  });

  // Inline upgrade links (data-nav="upgrade")
  document.querySelectorAll('[data-nav="upgrade"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('upgrade');
    });
  });

  // Handle hash
  const hash = window.location.hash.replace('#', '');
  if (hash) navigateTo(hash);
}

function navigateTo(sec) {
  const sectionEl = document.getElementById('section-' + sec);
  if (!sectionEl) return;
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const link = document.querySelector('[data-section="' + sec + '"]');
  if (link) link.classList.add('active');
  sectionEl.classList.add('active');
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

  // Theme selector
  const themeSelector = document.getElementById('theme-selector');
  const themeLock = document.getElementById('theme-lock');
  if (isPro) {
    themeLock.classList.add('hidden');
    themeSelector.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        currentTheme = btn.dataset.theme;
        await chrome.storage.local.set({ [STORAGE_KEY_THEME]: currentTheme });
        applyTheme(currentTheme);
        showToast('Theme changed to ' + currentTheme);
      });
    });
  } else {
    // Disable theme buttons for free users, show lock
    themeSelector.querySelectorAll('.theme-btn').forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
    });
    themeLock.classList.remove('hidden');
  }
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

function exportSessionsSubset(sessions) {
  const json = JSON.stringify({ version: 1, sessions }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tabflow-sessions-selected-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported ' + sessions.length + ' session' + (sessions.length !== 1 ? 's' : ''));
}

async function importSessions(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const raw = parsed.sessions || parsed;
    if (!Array.isArray(raw)) throw new Error('Invalid format');

    const imported = raw.filter(sess => {
      return sess &&
        typeof sess === 'object' &&
        typeof sess.name === 'string' &&
        Array.isArray(sess.tabs);
    }).map(sess => ({
      id: (typeof sess.id === 'string' && sess.id) ? sess.id : crypto.randomUUID(),
      name: sess.name,
      tabs: sess.tabs.filter(t => t && typeof t.url === 'string' && t.url).map(t => ({
        title: typeof t.title === 'string' ? t.title : 'Untitled',
        url: t.url,
        favicon: typeof t.favicon === 'string' ? t.favicon : ''
      })),
      createdAt: typeof sess.createdAt === 'string' ? sess.createdAt : new Date().toISOString()
    }));

    if (imported.length === 0) throw new Error('No valid sessions found');

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
  if (isPro) {
    document.getElementById('bulk-toolbar').classList.remove('hidden');
    setupBulkOperations();
  }
  renderSessionsTab();
}

function getSelectedIds() {
  return Array.from(document.querySelectorAll('.session-cb:checked')).map(cb => cb.dataset.id);
}

function updateBulkCount() {
  const count = getSelectedIds().length;
  document.getElementById('bulk-selected-count').textContent = count + ' selected';
  const cbSelectAll = document.getElementById('cb-select-all');
  if (cbSelectAll) {
    cbSelectAll.checked = count > 0 && count === allSessions.length;
    cbSelectAll.indeterminate = count > 0 && count < allSessions.length;
  }
}

function setupBulkOperations() {
  const cbSelectAll = document.getElementById('cb-select-all');
  const btnDeleteSelected = document.getElementById('btn-delete-selected');
  const btnExportSelected = document.getElementById('btn-export-selected');

  cbSelectAll.addEventListener('change', () => {
    document.querySelectorAll('.session-cb').forEach(cb => {
      cb.checked = cbSelectAll.checked;
    });
    updateBulkCount();
  });

  btnDeleteSelected.addEventListener('click', async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) { showToast('No sessions selected'); return; }
    if (!confirm('Delete ' + ids.length + ' selected session' + (ids.length !== 1 ? 's' : '') + '?')) return;
    allSessions = allSessions.filter(s => !ids.includes(s.id));
    await saveSessions();
    renderSessionsTab();
    showToast('Deleted ' + ids.length + ' session' + (ids.length !== 1 ? 's' : ''));
  });

  btnExportSelected.addEventListener('click', () => {
    const ids = getSelectedIds();
    if (ids.length === 0) { showToast('No sessions selected'); return; }
    const subset = allSessions.filter(s => ids.includes(s.id));
    exportSessionsSubset(subset);
  });
}

function renderSessionsTab() {
  const el = document.getElementById('sessions-overview');
  if (!allSessions.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8"><p style="font-size:16px">No sessions saved yet</p><p style="font-size:13px;margin-top:8px">Use the TabFlow popup to save your first session</p></div>';
    if (isPro) updateBulkCount();
    return;
  }
  el.innerHTML = allSessions.map(sess => {
    const date = new Date(sess.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const cbHtml = isPro
      ? '<input type="checkbox" class="session-cb" data-id="' + escHtml(sess.id) + '" style="width:16px;height:16px;accent-color:var(--primary);cursor:pointer;flex-shrink:0">'
      : '';
    return [
      '<div class="session-overview-card">',
      cbHtml,
      '  <div style="flex:1;min-width:0">',
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

  if (isPro) {
    el.querySelectorAll('.session-cb').forEach(cb => {
      cb.addEventListener('change', updateBulkCount);
    });
    updateBulkCount();
  }
}

// ── Upgrade / License ─────────────────────────────────────────────────────────
function setupUpgrade() {
  document.getElementById('btn-activate').addEventListener('click', activateLicense);
  document.getElementById('license-key').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') activateLicense();
  });

  if (isPro) {
    // Show Pro active banner, hide upgrade cards
    document.getElementById('pro-active-banner').classList.remove('hidden');
    document.getElementById('upgrade-hero-section').classList.add('hidden');
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

    // Migrate sessions to sync storage for cross-device access
    try {
      await chrome.storage.sync.set({ [STORAGE_KEY_SESSIONS]: allSessions });
    } catch (_) {
      // Sync quota exceeded or unavailable — sessions remain local
    }

    statusEl.textContent = 'Pro activated! Sessions are now syncing across your devices.';
    statusEl.className = 'license-status success';
    showToast('TabFlow Pro activated! ✨');

    // Update UI to reflect Pro status
    document.getElementById('pro-active-banner').classList.remove('hidden');
    document.getElementById('upgrade-hero-section').classList.add('hidden');
    document.getElementById('bulk-toolbar').classList.remove('hidden');
    setupBulkOperations();
    renderSessionsTab();

    // Enable theme buttons
    const themeSelector = document.getElementById('theme-selector');
    const themeLock = document.getElementById('theme-lock');
    themeLock.classList.add('hidden');
    themeSelector.querySelectorAll('.theme-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.addEventListener('click', async () => {
        currentTheme = btn.dataset.theme;
        await chrome.storage.local.set({ [STORAGE_KEY_THEME]: currentTheme });
        applyTheme(currentTheme);
        showToast('Theme changed to ' + currentTheme);
      });
    });
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

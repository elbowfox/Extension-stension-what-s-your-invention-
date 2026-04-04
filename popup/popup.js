/* ============================================
   TabFlow - Popup Logic
   ============================================ */

'use strict';

// Constants
const FREE_SESSION_LIMIT = 3;
const UPGRADE_URL = 'https://tabflow.pro/upgrade?ref=popup';
const STORAGE_KEY_SESSIONS = 'tabflow_sessions';
const STORAGE_KEY_PRO = 'tabflow_pro';
const STORAGE_KEY_THEME = 'tabflow_theme';

// State
let allSessions = [];
let isPro = false;
let openTabs = [];
let sortAsc = true;

// DOM refs
const elOpenCount       = document.getElementById('open-tabs-count');
const elSessionsCount   = document.getElementById('sessions-count');
const elTabsSavedCount  = document.getElementById('tabs-saved-count');
const elSessionsList    = document.getElementById('sessions-list');
const elOpenTabsList    = document.getElementById('open-tabs-list');
const elOpenTabsSection = document.getElementById('open-tabs-section');
const elSearchResultsCount = document.getElementById('search-results-count');
const elSearchBar       = document.getElementById('search-bar');
const elSearchInput     = document.getElementById('search-input');
const elUpgradeBanner   = document.getElementById('upgrade-banner');
const elProBadge        = document.getElementById('pro-badge');
const elBtnSave         = document.getElementById('btn-save-session');
const elBtnCloseAll     = document.getElementById('btn-close-all');
const elBtnSearchToggle = document.getElementById('btn-search-toggle');
const elBtnSearchClose  = document.getElementById('btn-search-close');
const elBtnOptions      = document.getElementById('btn-options');
const elBtnSort         = document.getElementById('btn-sort');
const elBtnUpgrade      = document.getElementById('btn-upgrade');
const elFooterUpgrade   = document.getElementById('footer-upgrade');

// Initialise
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  await loadOpenTabs();
  renderSessions();
  updateStats();
  bindEvents();
});

// Data helpers
async function loadData() {
  const localData = await chrome.storage.local.get([STORAGE_KEY_SESSIONS, STORAGE_KEY_PRO, STORAGE_KEY_THEME]);
  isPro = localData[STORAGE_KEY_PRO] === true;

  if (isPro) {
    // Pro users: load sessions from sync storage (cross-device)
    try {
      const syncData = await chrome.storage.sync.get(STORAGE_KEY_SESSIONS);
      allSessions = syncData[STORAGE_KEY_SESSIONS] || localData[STORAGE_KEY_SESSIONS] || [];
    } catch (_) {
      allSessions = localData[STORAGE_KEY_SESSIONS] || [];
    }
    elProBadge.classList.remove('hidden');
    elFooterUpgrade.textContent = '✨ Pro Active';
    elFooterUpgrade.style.color = '#f59e0b';
  } else {
    allSessions = localData[STORAGE_KEY_SESSIONS] || [];
  }

  // Apply saved theme
  const theme = localData[STORAGE_KEY_THEME] || 'light';
  document.body.classList.add('theme-' + theme);
}

async function loadOpenTabs() {
  openTabs = await chrome.tabs.query({ currentWindow: true });
  elOpenCount.textContent = openTabs.length;
}

async function saveSessions() {
  if (isPro) {
    try {
      await chrome.storage.sync.set({ [STORAGE_KEY_SESSIONS]: allSessions });
    } catch (_) {
      // Sync quota exceeded — fall back to local silently
    }
  }
  // Always write to local as backup / for free users
  await chrome.storage.local.set({ [STORAGE_KEY_SESSIONS]: allSessions });
}

// Stats
function updateStats() {
  elSessionsCount.textContent = allSessions.length;
  const total = allSessions.reduce((s, sess) => s + sess.tabs.length, 0);
  elTabsSavedCount.textContent = total;

  if (!isPro && allSessions.length >= FREE_SESSION_LIMIT) {
    elUpgradeBanner.classList.remove('hidden');
  } else {
    elUpgradeBanner.classList.add('hidden');
  }
}

// Session Operations
async function saveSession() {
  if (!isPro && allSessions.length >= FREE_SESSION_LIMIT) {
    showToast('Upgrade to Pro for unlimited sessions');
    openUpgrade();
    return;
  }

  const tabs = openTabs.map(t => ({
    title: t.title || 'Untitled',
    url: t.url || '',
    favicon: t.favIconUrl || ''
  })).filter(t => isSaveableUrl(t.url));

  if (tabs.length === 0) {
    showToast('No saveable tabs found');
    return;
  }

  const name = await promptSessionName();
  if (!name) return;

  const session = {
    id: Date.now().toString(),
    name,
    tabs,
    createdAt: new Date().toISOString()
  };

  allSessions.unshift(session);
  await saveSessions();
  renderSessions();
  updateStats();
  showToast('Session saved: ' + name);
}

async function restoreSession(sessionId) {
  const session = allSessions.find(s => s.id === sessionId);
  if (!session) return;

  for (const tab of session.tabs) {
    await chrome.tabs.create({ url: tab.url, active: false });
  }
  showToast('Restored: ' + session.name + ' (' + session.tabs.length + ' tabs)');
}

async function deleteSession(sessionId) {
  allSessions = allSessions.filter(s => s.id !== sessionId);
  await saveSessions();
  renderSessions();
  updateStats();
  showToast('Session deleted');
}

async function renameSession(sessionId) {
  const session = allSessions.find(s => s.id === sessionId);
  if (!session) return;
  const newName = prompt('Rename session:', session.name);
  if (!newName || newName.trim() === '') return;
  session.name = newName.trim();
  await saveSessions();
  renderSessions();
}

async function closeAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const ids = tabs.map(t => t.id).filter(Boolean);
  if (ids.length === 0) return;
  // Keep at least one tab open
  await chrome.tabs.create({ active: true });
  await chrome.tabs.remove(ids);
  await loadOpenTabs();
  updateStats();
  showToast('All tabs closed');
}

// Prompt helpers
function promptSessionName() {
  return new Promise(resolve => {
    const name = prompt('Session name:', 'Session ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    resolve(name ? name.trim() : null);
  });
}

// Render Sessions
function renderSessions() {
  const sorted = [...allSessions];
  if (!sortAsc) sorted.sort((a, b) => a.name.localeCompare(b.name));

  if (sorted.length === 0) {
    elSessionsList.innerHTML = [
      '<div class="empty-state">',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>',
      '<p>No sessions saved yet</p>',
      '<small>Click "Save Session" to store your tabs</small>',
      '</div>'
    ].join('');
    return;
  }

  elSessionsList.innerHTML = sorted.map(session => {
    const favs = session.tabs.slice(0, 6).map(t => {
      const src = t.favicon || getFaviconUrl(t.url);
      return '<img class="tab-favicon" src="' + escHtml(src) + '" alt="">';
    }).join('');
    const more = session.tabs.length > 6 ? '<span class="tab-count-more">+' + (session.tabs.length - 6) + '</span>' : '';
    const dateStr = formatDate(session.createdAt);

    return [
      '<div class="session-card" data-id="' + escHtml(session.id) + '">',
      '  <div class="session-header">',
      '    <span class="session-name">' + escHtml(session.name) + '</span>',
      '    <span class="session-meta">' + session.tabs.length + ' tabs &bull; ' + dateStr + '</span>',
      '    <div class="session-actions">',
      '      <button class="btn-restore" data-action="restore" data-id="' + escHtml(session.id) + '" title="Restore session">Open</button>',
      '      <button data-action="rename" data-id="' + escHtml(session.id) + '" title="Rename">&#9998;</button>',
      '      <button class="btn-delete" data-action="delete" data-id="' + escHtml(session.id) + '" title="Delete">&#x2715;</button>',
      '    </div>',
      '  </div>',
      '  <div class="session-tabs-preview">' + favs + more + '</div>',
      '</div>'
    ].join('');
  }).join('');

  elSessionsList.querySelectorAll('.tab-favicon').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.src = '../icons/icon16.png';
    });
  });
}

// Open Tabs Search
function renderOpenTabs(filter) {
  const q = (filter || '').toLowerCase().trim();
  const filtered = q
    ? openTabs.filter(t => (t.title || '').toLowerCase().includes(q) || (t.url || '').toLowerCase().includes(q))
    : openTabs;

  elSearchResultsCount.textContent = filtered.length;

  if (filtered.length === 0) {
    elOpenTabsList.innerHTML = '<li style="padding:8px 6px;color:#94a3b8;font-size:12px">No matching tabs</li>';
    return;
  }

  elOpenTabsList.innerHTML = filtered.map(t => {
    const src = t.favIconUrl || getFaviconUrl(t.url || '');
    const host = safeHostname(t.url || '');
    return [
      '<li class="tab-item" data-tabid="' + t.id + '">',
      '  <img src="' + escHtml(src) + '" alt="">',
      '  <span class="tab-item-title">' + escHtml(t.title || 'Untitled') + '</span>',
      '  <span class="tab-item-url">' + escHtml(host) + '</span>',
      '</li>'
    ].join('');
  }).join('');

  const tabImages = elOpenTabsList.querySelectorAll('img');
  tabImages.forEach((img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') {
        return;
      }
      img.dataset.fallbackApplied = '1';
      img.src = '../icons/icon16.png';
    });
  });
}

// Events
function bindEvents() {
  elBtnSave.addEventListener('click', saveSession);

  elBtnCloseAll.addEventListener('click', async () => {
    if (confirm('Close all ' + openTabs.length + ' tabs? (They will not be saved)')) {
      await closeAllTabs();
    }
  });

  elBtnSearchToggle.addEventListener('click', () => {
    elSearchBar.classList.toggle('hidden');
    elOpenTabsSection.classList.toggle('hidden');
    if (!elSearchBar.classList.contains('hidden')) {
      renderOpenTabs('');
      elSearchInput.focus();
    }
  });

  elBtnSearchClose.addEventListener('click', () => {
    elSearchBar.classList.add('hidden');
    elOpenTabsSection.classList.add('hidden');
    elSearchInput.value = '';
  });

  elSearchInput.addEventListener('input', () => {
    renderOpenTabs(elSearchInput.value);
  });

  elOpenTabsList.addEventListener('click', async (e) => {
    const li = e.target.closest('.tab-item');
    if (!li) return;
    const tabId = parseInt(li.dataset.tabid, 10);
    if (tabId) await chrome.tabs.update(tabId, { active: true });
    window.close();
  });

  elSessionsList.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'restore') await restoreSession(id);
    else if (action === 'delete') await deleteSession(id);
    else if (action === 'rename') await renameSession(id);
  });

  elBtnOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  elBtnSort.addEventListener('click', () => {
    sortAsc = !sortAsc;
    renderSessions();
  });

  [elBtnUpgrade, elFooterUpgrade].forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openUpgrade();
    });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      elBtnSearchToggle.click();
    }
  });
}

// Upgrade
function openUpgrade() {
  chrome.tabs.create({ url: UPGRADE_URL });
}

// Utilities
const SAVEABLE_PROTOCOLS = new Set(['http:', 'https:', 'file:', 'ftp:', 'chrome-extension:']);

function isSaveableUrl(url) {
  if (!url) return false;
  try {
    return SAVEABLE_PROTOCOLS.has(new URL(url).protocol);
  } catch (_) {
    return false;
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getFaviconUrl(favIconUrl) {
  try {
    // Prefer the favicon URL provided by the tab (if any).
    if (typeof favIconUrl === 'string' && favIconUrl.trim() !== '') {
      return favIconUrl;
    }
  } catch (_) {
    // Fall through to local fallback below.
  }
  // Local bundled fallback icon; avoids third-party requests.
  return '../icons/icon16.png';
}

function safeHostname(url) {
  try { return new URL(url).hostname; } catch (_) { return ''; }
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (_) {
    return '';
  }
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

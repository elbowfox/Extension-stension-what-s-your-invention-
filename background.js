/* ============================================
   TabFlow - Background Service Worker
   ============================================ */

'use strict';

const STORAGE_KEY_SESSIONS = 'tabflow_sessions';
const STORAGE_KEY_PRO = 'tabflow_pro';

// Handle keyboard shortcut: save session
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'save-session') {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const saveable = tabs
      .map(t => ({ title: t.title || 'Untitled', url: t.url || '', favicon: t.favIconUrl || '' }))
      .filter(t => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('about:'));

    if (saveable.length === 0) return;

    const data = await chrome.storage.local.get([STORAGE_KEY_SESSIONS, STORAGE_KEY_PRO]);
    const sessions = data[STORAGE_KEY_SESSIONS] || [];
    const isPro = data[STORAGE_KEY_PRO] === true;

    if (!isPro && sessions.length >= 3) return; // free limit

    const name = 'Session ' + new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    sessions.unshift({ id: Date.now().toString(), name, tabs: saveable, createdAt: new Date().toISOString() });
    await chrome.storage.local.set({ [STORAGE_KEY_SESSIONS]: sessions });
  }
});

// On install: set up defaults and show welcome page
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.local.set({ tabflow_installed: true });
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') + '?welcome=1' });
  }
});

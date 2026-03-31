/* ============================================
   TabFlow - Content Script
   Detects shopping sites and shows a subtle
   "Save this session" reminder nudge.
   ============================================ */

'use strict';

(function () {
  // Only inject once
  if (window.__tabflowInjected) return;
  window.__tabflowInjected = true;

  // Show a tiny save-session nudge on checkout/cart pages
  const isCheckout = /\/(cart|checkout|order|basket|bag)/i.test(window.location.pathname);
  if (!isCheckout) return;

  chrome.storage.local.get(['tabflow_nudge_dismissed'], (data) => {
    if (data.tabflow_nudge_dismissed) return;

    const bar = document.createElement('div');
    bar.id = 'tabflow-nudge';
    bar.style.cssText = [
      'position:fixed',
      'bottom:16px',
      'right:16px',
      'z-index:2147483647',
      'background:#1e293b',
      'color:#fff',
      'padding:10px 14px',
      'border-radius:10px',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-size:13px',
      'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
      'display:flex',
      'align-items:center',
      'gap:10px',
      'max-width:280px',
      'cursor:default'
    ].join(';');

    bar.innerHTML = [
      '<img src="' + chrome.runtime.getURL('icons/icon32.png') + '" width="20" height="20" style="border-radius:4px;flex-shrink:0">',
      '<span>Shopping? <strong>Save your tabs</strong> before you buy!</span>',
      '<button id="tf-save-btn" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:4px 9px;font-size:12px;cursor:pointer;font-weight:600;white-space:nowrap">Save</button>',
      '<button id="tf-close-btn" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;padding:0 2px;line-height:1">&times;</button>'
    ].join('');

    document.body.appendChild(bar);

    document.getElementById('tf-save-btn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'save-session-quick' });
      bar.remove();
      chrome.storage.local.set({ tabflow_nudge_dismissed: true });
    });

    document.getElementById('tf-close-btn').addEventListener('click', () => {
      bar.remove();
      chrome.storage.local.set({ tabflow_nudge_dismissed: true });
    });

    // Auto-hide after 8 seconds
    setTimeout(() => { if (bar.parentNode) bar.remove(); }, 8000);
  });
})();

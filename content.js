// content.js - injects "Generate" button on trends.google.com
const observer = new MutationObserver(() => {
  const cards = document.querySelectorAll('div[jsname]'); // adjust selector if Google changes
  cards.forEach(card => {
    if (!card.querySelector('.tt-button')) {
      const btn = document.createElement('button');
      btn.textContent = '📹 Generate Faceless Video';
      btn.className = 'tt-button';
      btn.style = 'position: absolute; top: 10px; right: 10px; padding: 8px 12px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; z-index: 999; font-weight: bold;';
      btn.onclick = () => {
        const title = card.querySelector('h3')?.textContent || 'Unknown Trend';
        const articles = Array.from(card.querySelectorAll('a')).map(a => ({
          title: a.textContent,
          url: a.href
        })).slice(0, 3);

        chrome.runtime.sendMessage({ action: 'openPopup', data: { title, articles } });
      };
      card.style.position = 'relative';
      card.appendChild(btn);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

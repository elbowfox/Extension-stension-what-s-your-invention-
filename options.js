// options.js
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['openaiKey', 'pexelsKey'], data => {
    document.getElementById('openai-key').value = data.openaiKey || '';
    document.getElementById('pexels-key').value = data.pexelsKey || '';
  });

  document.getElementById('save').onclick = () => {
    chrome.storage.local.set({
      openaiKey: document.getElementById('openai-key').value,
      pexelsKey: document.getElementById('pexels-key').value
    }, () => {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved!';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  };
});

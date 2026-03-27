// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const trendInfo = document.getElementById('trend-info');
  const generateBtn = document.getElementById('generate');
  const output = document.getElementById('output');
  const ttsBtn = document.getElementById('tts');
  const visualsBtn = document.getElementById('visuals');
  const packageBtn = document.getElementById('package');

  chrome.storage.local.get(['openaiKey', 'pexelsKey'], data => {
    document.getElementById('api-key').value = data.openaiKey || '';
    document.getElementById('pexels-key').value = data.pexelsKey || '';
  });

  document.getElementById('save-keys').onclick = () => {
    chrome.storage.local.set({
      openaiKey: document.getElementById('api-key').value,
      pexelsKey: document.getElementById('pexels-key').value
    });
    alert('Keys saved!');
  };

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'openPopup') {
      trendInfo.innerHTML = `<strong>${msg.data.title}</strong><br/>Articles: ${msg.data.articles.map(a => `<a href="${a.url}" target="_blank">${a.title}</a>`).join('<br/>')}`;
    }
  });

  generateBtn.onclick = async () => {
    const articleText = prompt('Paste article text here:');
    if (!articleText) return;
    output.textContent = 'Generating...';
    chrome.runtime.sendMessage({ action: 'generateScript', title: 'Trend', articleText }, res => {
      output.textContent = res.script || res.error;
    });
  };

  ttsBtn.onclick = () => {
    const text = output.textContent;
    if (text) chrome.runtime.sendMessage({ action: 'speak', text });
  };

  visualsBtn.onclick = () => {
    const query = prompt('Visual search query:') || 'news background';
    chrome.runtime.sendMessage({ action: 'getPexels', query }, res => {
      if (res.photos) {
        output.innerHTML += '<br/>Visuals:<br/>' + res.photos.map(src => `<img src="${src}" style="width:80px;margin:2px;" />`).join(' ');
      } else {
        alert(res.error || 'No visuals');
      }
    });
  };

  packageBtn.onclick = () => {
    // Simple ZIP simulation — real impl needs zip.js or backend
    alert('In MVP: Copy script + visuals manually into CapCut. Pro version: full ZIP + instructions.');
    // Future: use JSZip to create downloadable archive
  };
});

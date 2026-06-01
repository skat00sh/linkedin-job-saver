const WEBHOOK_URL = 'YOUR_PRODUCTION_WEBHOOK_URL';

document.getElementById('save').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Scraping job...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrape' });

    if (!response.title && !response.content) {
      status.textContent = '❌ No job data found. Are you on a LinkedIn job page?';
      return;
    }

    status.textContent = 'Sending to Notion...';

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    });

    status.textContent = '✅ Job saved to Notion!';
  } catch (err) {
    status.textContent = '❌ Error: ' + err.message;
  }
});
const WEBHOOK_URL = 'YOUR_PRODUCTION_WEBHOOK_URL';

document.getElementById('save').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Scraping job...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrape' });

    if (!response.title && !response.content) {
      status.textContent = '❌ No job data found. Are you on a LinkedIn job page?';
      return;
    }

    status.textContent = 'Sending to Notion...';

    const result = await chrome.runtime.sendMessage({
      action: 'sendToWebhook',
      webhookUrl: WEBHOOK_URL,
      data: response
    });

    if (result.success) {
      status.textContent = '✅ Job saved to Notion!';
    } else {
      status.textContent = '❌ Error: ' + result.error;
    }
  } catch (err) {
    status.textContent = '❌ Error: ' + err.message;
  }
});
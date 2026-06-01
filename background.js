chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendToWebhook') {
    fetch(request.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.data)
    })
    .then(() => sendResponse({ success: true }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendToWebhook') {
    console.log('Sending to:', request.webhookUrl);
    console.log('Data:', JSON.stringify(request.data));
    fetch(request.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.data)
    })
    .then(res => {
      console.log('Response status:', res.status);
      sendResponse({ success: true });
    })
    .catch(err => {
      console.log('Fetch error:', err.message);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  }
});
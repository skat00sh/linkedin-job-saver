function scrapeLinkedInJob() {
  const title = document.querySelector('h1')?.innerText?.trim() || '';

  const company = document.querySelector('.topcard__org-name-link')?.innerText?.trim() || '';

  const posted_date = document.querySelector('.posted-time-ago__text')?.innerText?.trim() || '';

  const content = document.querySelector('.description__text--rich')?.innerText?.trim()
    || document.querySelector('.core-section-container.description')?.innerText?.trim()
    || '';

  const url = window.location.href;

  return { title, company, posted_date, content, url };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    sendResponse(scrapeLinkedInJob());
  }
});
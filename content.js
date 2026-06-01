function scrapeLinkedInJob() {
  const title = document.querySelector('.job-details-jobs-unified-top-card__job-title h1')?.innerText?.trim()
    || document.querySelector('h1')?.innerText?.trim()
    || '';

  const company = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.innerText?.trim()
    || document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText?.trim()
    || '';

  const posted_date = document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline span[aria-hidden="false"]')?.innerText?.trim()
    || document.querySelector('.tvm__text--neutral')?.innerText?.trim()
    || '';

  const content = document.querySelector('.jobs-description__content')?.innerText?.trim()
    || document.querySelector('.jobs-description')?.innerText?.trim()
    || '';

  const url = window.location.href;

  return { title, company, posted_date, content, url };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    sendResponse(scrapeLinkedInJob());
  }
});
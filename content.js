async function scrapeLinkedInJob() {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const text = document.body.innerText;

  const headerMatch = text.match(/Learning\n\n([^\n]+)\n\n([^\n]+)\n\n([^\n]+)/);
  const company = headerMatch?.[1]?.trim() || '';
  const title = headerMatch?.[2]?.trim() || '';

  const dateMatch = text.match(/((?:Reposted )?[\d]+ (?:hour|day|week|month|year)s? ago|Just now)/i);
  const posted_date = dateMatch?.[1]?.trim() || '';

  const contentMatch = text.match(/About the job\n([\s\S]+?)(?:\nShow less|$)/);
  const content = contentMatch?.[1]?.trim() || '';

  const url = window.location.href;

  console.log('Scraped:', { title, company, posted_date, contentLength: content.length, url });
  return { title, company, posted_date, content, url };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    scrapeLinkedInJob().then(sendResponse);
    return true;
  }
});

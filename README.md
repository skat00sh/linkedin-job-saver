# LinkedIn Job Saver → Notion

A one-click Chrome extension that scrapes a LinkedIn job post and automatically evaluates it against your CV using Claude AI, then saves a structured, prioritised entry to your Notion job tracker database.

**What happens when you click the extension:**

1. Scrapes the job title, company, description, post date, and URL from the LinkedIn page
2. Sends it to an n8n workflow via webhook
3. Claude evaluates the job against your CV and returns a match score, missing skills, and a rationale
4. Assigns a priority (High / Mid / Low) based on match score and how recently the job was posted
5. Creates a new row in your Notion database with all parsed fields

---

## Prerequisites

- [n8n cloud account](https://n8n.io) (free tier works)
- [Anthropic API key](https://console.anthropic.com) (Claude — ~$5 minimum top-up)
- [Notion account](https://notion.so) with a job tracker database
- Google Chrome browser

---

## Project Structure

```
linkedin-job-saver/       # Chrome extension
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── config.js             # ← you create this (gitignored)
├── config.sample.js      # ← template, safe to commit
└── .gitignore

workflow/
└── Job_Search_Automation_2026.json   # n8n workflow (scrubbed)
```

---

## Step 1 — Set up your Notion database

Your Notion database should have the following columns:

| Column name | Type |
|---|---|
| Company | Title |
| Position | Text |
| Job URL | URL |
| Posted Date | Date |
| CV Match Score | Number |
| Skills Required | Text |
| Missing Skill | Text |
| Priority | Select (options: High, Mid, Low) |
| Rationale | Text |
| Status | Select (e.g. To Apply, Applied, Interview…) |

Then connect an integration to your database:

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration**
2. Name it (e.g. `Job Pipeline`), save, and copy the **Internal Integration Secret**
3. Open your Notion database → `...` menu → **Connections** → connect your integration
4. Copy your **Database ID** from the URL: `notion.so/yourworkspace/THIS-32-CHAR-ID?v=...`

---

## Step 2 — Import the n8n workflow

1. Log into [n8n.io](https://app.n8n.io)
2. Click **+ New workflow** → three-dot menu → **Import from file**
3. Upload `Job_Search_Automation_2026.json`
4. Set up credentials:
   - **Anthropic node** → add your Anthropic API key
   - **Notion node** → add your Notion integration secret
5. In the **Notion node**, update the **Database ID** to your own
6. In the **Claude node**, replace `[PASTE YOUR CV HERE]` with your CV as plain text
7. Copy the **Production webhook URL** from the Webhook node
8. **Activate** the workflow (toggle top right → green)

---

## Step 3 — Install the Chrome extension

1. Clone or download this repo
2. In the `linkedin-job-saver` folder, create a `config.js` file based on `config.sample.js`:

```javascript
const CONFIG = {
  WEBHOOK_URL: 'https://yourname.app.n8n.cloud/webhook/your-path-here'
};
```

3. Open Chrome → go to `chrome://extensions`
4. Toggle on **Developer mode** (top right)
5. Click **Load unpacked** → select the `linkedin-job-saver` folder
6. Pin the extension to your toolbar

---

## Step 4 — Test it

1. Go to any LinkedIn job post (make sure you're logged into LinkedIn)
2. Click the **📋 Save Job to Notion** extension button
3. Wait for the `✅ Job saved to Notion!` confirmation
4. Check your Notion database — a new row should appear with all fields populated

---

## How priority is assigned

| Condition | Priority |
|---|---|
| CV match score ≥ 7 AND posted ≤ 7 days ago | **High** |
| CV match score 4–6 OR posted 8–21 days ago | **Mid** |
| CV match score < 4 OR posted > 21 days ago | **Low** |

---

## Troubleshooting

**"No job data found"** — Make sure you're on a `linkedin.com/jobs/view/` page and fully logged into LinkedIn. The extension doesn't work on job search result pages.

**"Failed to fetch"** — Check that your `config.js` has the correct production webhook URL (not the test URL) and that your n8n workflow is **active**.

**Empty fields in Notion** — Check the n8n execution log (Executions tab in sidebar) for the exact error. Usually a field type mismatch in the Notion node.

**Posted date missing** — LinkedIn sometimes shows relative dates ("2 weeks ago") which Claude converts using today's date. If the job post has no date visible, the field will be left empty.

**Notion credential error** — Make sure your Notion integration is connected to the specific database you're using (open the database → `...` → Connections).

---

## Cost

At typical job-hunting volume (10–20 jobs/week), the Anthropic API cost is under $0.05/month. The $5 minimum top-up will last years at this usage.

---

## Potential improvements

- Add a cover letter generator node in n8n that drafts a tailored cover letter and saves it to the Notion page
- Add a Slack/email notification node that pings you for High priority jobs only
- Add an "Update" workflow to change application status from Notion
- Build a dashboard view in Notion with filters by priority and status

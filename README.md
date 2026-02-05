# TestProjectCodex

## Lead Intel & Outreach Builder

This lightweight front-end app turns a LinkedIn profile into a tailored pitch, email, and LinkedIn message.

You can either paste profile text manually or use a LinkedIn profile URL pull via a supported enrichment API key.

### Quick start (local)

```bash
cd public
python -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

### Quick start (hosted via GitHub Pages)

1. Push this repo to GitHub.
2. Make sure the repo is **public** (Pages requires public repos unless you have GitHub Enterprise).
3. In GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
4. If prompted, approve the workflow run in the **Actions** tab.
5. After the workflow completes, open the URL shown in the Pages settings (it will look like
   `https://<org>.github.io/<repo>/`).

### Data sources

- `public/data/mathco_offerings.json`: MathCo offerings and trigger keywords used for pitch recommendations.
- `@work/notes.md`: Store internal discussion notes to paste into the UI for personalization.

### LinkedIn URL pull

- The app supports direct URL pull through the Proxycurl LinkedIn profile API (bring your own API key).
- Enter the LinkedIn URL + enrichment API key, then click **Pull profile from LinkedIn URL**.
- If your account does not have API access or the profile is restricted, fallback to manual paste still works.

# TestProjectCodex

## Lead Intel & Outreach Builder

This lightweight front-end app turns a LinkedIn profile into a tailored pitch, email, and LinkedIn message.

### Quick start (local)

```bash
cd public
python -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

### Quick start (hosted via GitHub Pages)

1. Push this repo to GitHub.
2. In GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Commit the workflow in `.github/workflows/pages.yml` (included in this repo).
4. After the workflow completes, open the URL shown in the Pages settings (it will look like
   `https://<org>.github.io/<repo>/`).

### Data sources

- `public/data/mathco_offerings.json`: MathCo offerings and trigger keywords used for pitch recommendations.
- `@work/notes.md`: Store internal discussion notes to paste into the UI for personalization.

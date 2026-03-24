# TV Mount 360

Landing page and quote-wizard site for **TV Mount 360**.

- Live domain: [https://www.tvmount360.com](https://www.tvmount360.com)
- Apex domain: [https://tvmount360.com](https://tvmount360.com)

## Project Overview

This is a static website built with plain HTML, CSS, and JavaScript.  
It includes:

- responsive landing page design (desktop + mobile)
- quote wizard modal with pricing logic
- services, pricing, FAQ, and contact sections
- SEO-ready metadata for Google and social sharing

## Project Structure

- `index.html`: page markup, SEO tags, and structured data (`JSON-LD`)
- `styles.css`: visual design, responsive layout, animations, and UI styling
- `script.js`: quote wizard behavior and estimate generation
- `assets/`: logos, service images, and background artwork
- `.github/workflows/deploy-pages.yml`: GitHub Actions deploy workflow
- `CNAME`: custom domain config for GitHub Pages
- `sitemap.xml`: Google sitemap
- `robots.txt`: crawler rules and sitemap reference
- `.nojekyll`: disables Jekyll processing on GitHub Pages

## Deployment (GitHub Pages via Actions)

Deploy runs automatically on push to `main` using:

- `.github/workflows/deploy-pages.yml`

### One-time GitHub setup

1. Push repository to GitHub.
2. Open `Settings` > `Pages`.
3. Set source to **GitHub Actions**.
4. Confirm `CNAME` contains `tvmount360.com`.

### DNS setup (your registrar)

Configure:

- apex/root `tvmount360.com` to GitHub Pages records
- `www` as a CNAME to your GitHub Pages host (or apex, based on provider support)

## SEO / Google Indexing

Already configured in this repo:

- canonical URL in `index.html`
- Open Graph + Twitter metadata
- keywords and description metadata
- structured data (`HomeAndConstructionBusiness`)
- `robots.txt`
- `sitemap.xml`

After launch:

1. Open Google Search Console.
2. Add property for `https://tvmount360.com/` (and optionally `https://www.tvmount360.com/`).
3. Submit sitemap: `https://tvmount360.com/sitemap.xml`.

## Local Preview

Run a local static server from the project root:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080`

## Notes

- Keep branding consistent as **TV Mount 360** in copy and metadata.
- If contact email/phone changes, update both `index.html` and `script.js`.

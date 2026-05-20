# STUDIO — Website Template

A production-ready, dark-themed website starter with bold aesthetics and all the essentials built in.

## Folder Structure

```
my-website/
├── index.html          ← Main page (hero, work, services, about, contact)
├── privacy.html        ← Privacy policy placeholder
├── terms.html          ← Terms placeholder
├── css/
│   ├── reset.css       ← Modern CSS reset
│   ├── variables.css   ← All design tokens (colors, fonts, spacing…)
│   ├── style.css       ← Core layout & sections
│   ├── components.css  ← Buttons, form, cursor
│   └── animations.css  ← Scroll-reveal & keyframes
├── js/
│   ├── utils.js        ← Helpers ($, $$, debounce, lerp…)
│   ├── animations.js   ← IntersectionObserver scroll reveal
│   ├── nav.js          ← Sticky header + mobile menu
│   ├── form.js         ← Contact form validation
│   ├── cursor.js       ← Custom cursor with lerp
│   └── main.js         ← Bootstrap: loader, smooth scroll, year
└── assets/
    └── favicon.svg     ← SVG favicon
```

## Customising

### Brand Colors
Edit `css/variables.css`. The key variables:
- `--clr-bg` — page background
- `--clr-accent` — the electric lime highlight color
- `--clr-text` — body text

### Fonts
Swap the Google Fonts `<link>` in `index.html` and update `--font-display` / `--font-body` in `variables.css`.

### Content
All content is in `index.html`. Search for placeholder text like "STUDIO", "Apex Commerce", etc. and replace it with your own.

### Contact Form
The form in `js/form.js` currently simulates a send. To make it real, replace the `await new Promise(...)` line with a `fetch()` call to your backend or a service like Formspree, EmailJS, or Netlify Forms.

### Adding Pages
Copy the structure from `privacy.html` as a starting point for new pages. All CSS and JS files are already linked.

## Deployment

This is a plain HTML/CSS/JS site with no build step required. Just drop the folder onto any static host:
- **Netlify** — drag and drop the folder at netlify.com/drop
- **Vercel** — `vercel` CLI in this directory
- **GitHub Pages** — push to a repo and enable Pages
- **Cloudflare Pages** — connect your repo

## Performance Tips
- Add `loading="lazy"` to all `<img>` tags
- Compress images with squoosh.app
- Consider adding a `sitemap.xml` and `robots.txt` for SEO

# Northgate Barbers

A static, mobile-first website for a fictional barber shop in Lancaster, UK. Portfolio project. Plain HTML, CSS and a little vanilla JavaScript, with no build step.

## Structure

```
index.html        Single page: header, services, gallery, about, location, footer
css/styles.css    All styling (design tokens at the top, mobile-first)
js/main.js        Footer year and "today" highlight in opening hours
images/           Placeholder gallery images, favicon, social share image
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Things to replace

- **Fresha link:** search `fresha.com` in `index.html` and use your real booking URL.
- **Instagram / Google review links** in the footer.
- **Gallery images:** swap `images/gallery-*.svg` for real photos (JPG or WebP) and update the `alt` text.
- **Open Graph image:** `images/og-image.svg` should be a 1200×630 PNG or JPG, because Facebook and most other platforms ignore SVG. Once deployed, use the full URL (e.g. `https://your-site.netlify.app/images/og-image.png`) in the `og:image` tag.

## Deploy to Netlify

**Drag and drop:** go to <https://app.netlify.com/drop> and drop this folder.

**From Git:**
1. Push the repo to GitHub.
2. In Netlify choose *Add new site → Import an existing project* and pick the repo.
3. Leave the build command empty and set the publish directory to `.`
4. Deploy. Every push to the main branch redeploys.

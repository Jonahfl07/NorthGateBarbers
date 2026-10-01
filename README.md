# Northgate Barbers

A static, mobile-first demo website for a fictional barber shop in Lancaster, UK. It is a sample site built by [Lewis Web Studio](https://lewiswebstudio.co.uk) as a portfolio piece. Plain HTML, CSS and a little vanilla JavaScript, with no build step and no external scripts, fonts or images.

Live at: <https://storied-dusk-b88534.netlify.app>

## Structure

```
index.html          Single page: banner, header, hero, services, gallery, about, location, footer, demo dialog
css/styles.css      All styling (colour, spacing and width tokens at the top, mobile-first)
js/main.js          Settings (CONFIG) plus: mobile menu, demo dialog, header hide/show, fade-ins, typewriter
images/             Hero pole drawing, gallery placeholders, favicons, share image
netlify.toml        Security and noindex headers for Netlify
```

## Run locally

```bash
python3 -m http.server 8000
```

`netlify.toml` headers do not apply on a local server.

## Things to change

- **Colours, spacing, widths:** the `:root` block at the top of `css/styles.css` (`--accent`, `--bg`, `--max`, `--gutter`, `--section-pad`, `--measure`).
- **Animation speeds and thresholds:** `CONFIG` at the top of `js/main.js`.
- **Site URL:** `https://storied-dusk-b88534.netlify.app` appears in the `og:url`, `og:image` and `twitter:image` tags in `index.html`. If you rename the site, find-and-replace it there.
- **Booking, Instagram and Google review buttons:** these open a demo dialog. Each has a `data-demo-message` attribute holding its message. To make one a real link, replace the whole `<button>` with `<a href="https://real-url" target="_blank" rel="noopener noreferrer">Label</a>`.

## Gallery

Each tile is one `<li>` with an `<img>` and a caption. To swap a placeholder for a real photo, change that tile's `<img>` line: set `src` to your file, write a real `alt`, and keep `width`/`height` matching the tile shape:

| Tile class | Shape | Suggested size |
|---|---|---|
| `tile-feature` | big square (2×2) | 1200×1200 |
| none | small square | 600×600 |
| `tile-tall` | tall (1×2) | 600×1200 |
| `tile-wide` | wide (2×1) | 1200×600 |

Use JPG or WebP, around 80% quality, ideally under 250 KB each. Photos fill their tile with `object-fit: cover`, so they are cropped to fit rather than stretched. The width and height attributes stop the page jumping while images load.

## Keeping it out of search engines

This demo is set to `noindex, nofollow` in two places: a `<meta name="robots">` tag in `index.html` and an `X-Robots-Tag` header in `netlify.toml`. There is deliberately no `robots.txt` Disallow rule, because crawlers must be able to read the noindex. Remove both when a real client site goes live.

## Verify the headers after deploying

```bash
curl -sI https://storied-dusk-b88534.netlify.app/ | grep -i -E "content-security|x-content-type|referrer|permissions|x-frame|x-robots"
```

You should see all six headers. Also check the browser console for "Content Security Policy" errors.

## Share image and icons

`images/og-image.png` (1200×630), `images/favicon-32.png` and `images/apple-touch-icon.png` (180×180) were generated once; replace them with any images at the same sizes.

## Deploy to Netlify

**Drag and drop:** go to <https://app.netlify.com/drop> and drop this folder.

**From Git:**
1. Push the repo to GitHub.
2. In Netlify choose *Add new site → Import an existing project* and pick the repo.
3. Leave the build command empty and set the publish directory to `.` (already set in `netlify.toml`).
4. Deploy. Every push to the main branch redeploys.

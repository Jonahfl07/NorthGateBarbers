/* ==========================================================================
   Configuration: tweak these values to adjust the effects
   ========================================================================== */
const CONFIG = {
  // Typewriter (hero headline only)
  typewriterSelector: '.hero h1',
  typeSpeedMs: 60,            // delay per character (50-70 feels natural)
  typeStartDelayMs: 400,      // pause after load before typing starts

  // Header hide/show
  headerHideAfterPx: 120,     // only hide once scrolled further than this
  headerMinDeltaPx: 5,        // ignore scroll movements smaller than this

  // Fade in/out of section content
  revealSelector: '#services .container > *, #gallery .container > *, #about .container > *, #location .container > *',
  revealEnterRatio: 0.15,     // fraction of the block that must be visible to fade in
  revealEnterBottomMargin: '-8%', // shrinks the viewport's bottom edge so blocks fade in a little later
  revealExitDistancePx: 200,  // block fades out once it is this far outside the viewport
  revealFadeOut: true         // false = blocks fade in once and stay visible
};
// The distance (20px) and duration (600ms) of the fade are in css/styles.css.

/* ==========================================================================
   Setup: runs immediately (script is in <head>, before first paint)
   ========================================================================== */
const root = document.documentElement;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduceMotion = () => motionQuery.matches;

// Everything hidden-for-animation is keyed off this class, so with JS off
// (or broken) all content stays visible.
root.classList.add('js');
// Hide the headline until the typewriter has wrapped it, to avoid a flash of full text.
if (!reduceMotion()) root.classList.add('js-typewriter');

/* ---------- Sticky header: hide on scroll down, show on scroll up ---------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const show = () => header.classList.remove('is-hidden');
  const hide = () => {
    if (header.querySelector('.site-nav.is-open')) return; // keep the header while the menu is open
    header.classList.add('is-hidden');
  };

  function update() {
    ticking = false;
    const y = Math.max(0, window.scrollY); // iOS rubber-banding can report negatives

    if (reduceMotion() || y <= 0) {        // always visible at very top
      show();
      lastY = y;
      return;
    }

    const delta = y - lastY;
    if (Math.abs(delta) < CONFIG.headerMinDeltaPx) return; // ignore jitter; lastY is kept so slow scrolls still accumulate

    if (delta < 0) show();                                  // any upward scroll
    else if (y > CONFIG.headerHideAfterPx) hide();          // downward, past threshold
    lastY = y;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  // Keyboard users: never leave focus inside a hidden header.
  header.addEventListener('focusin', show);

  // After a resize or a bfcache restore, re-sync so the next delta is measured from here.
  const resync = () => { lastY = Math.max(0, window.scrollY); };
  window.addEventListener('resize', resync, { passive: true });
  window.addEventListener('pageshow', resync);
}

/* ---------- Section content fade in / out ---------- */
function initReveal() {
  if (reduceMotion() || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(CONFIG.revealSelector);
  if (!targets.length) return;

  // Fade in when enough of the block is on screen.
  const enterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, {
    threshold: CONFIG.revealEnterRatio,
    rootMargin: `0px 0px ${CONFIG.revealEnterBottomMargin} 0px`
  });

  // Fade out only when the block is well outside the viewport (extended by the exit distance).
  const exitObserver = CONFIG.revealFadeOut ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) entry.target.classList.remove('is-visible');
    });
  }, {
    rootMargin: `${CONFIG.revealExitDistancePx}px 0px`
  }) : null;

  try {
    targets.forEach((el) => {
      el.classList.add('reveal');
      enterObserver.observe(el);
      if (exitObserver) exitObserver.observe(el);
    });
  } catch (err) {
    // If anything goes wrong, make sure nothing stays hidden.
    targets.forEach((el) => el.classList.remove('reveal'));
  }
}

/* ---------- Typewriter (hero headline, once per page load) ---------- */
function initTypewriter() {
  const el = document.querySelector(CONFIG.typewriterSelector);
  if (!el || reduceMotion()) return;

  // Rebuild the headline as one span per character. Every character is present
  // (invisible) from the start, so the final height is reserved: no layout shift.
  const wrapper = document.createElement('span');
  wrapper.className = 'tw';
  wrapper.setAttribute('aria-hidden', 'true');
  const chars = [];
  let plainText = '';

  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      plainText += node.textContent;
      [...node.textContent].forEach((ch) => {
        if (ch === ' ') { wrapper.append(' '); return; } // spaces stay plain text so lines wrap normally
        const span = document.createElement('span');
        span.className = 'tw-char';
        span.textContent = ch;
        wrapper.append(span);
        chars.push(span);
      });
    } else if (node.nodeName === 'BR') {
      plainText += ' ';
      wrapper.append(document.createElement('br'));
    }
  });

  // Screen readers get the whole headline at once; the animated copy is aria-hidden.
  const sr = document.createElement('span');
  sr.className = 'visually-hidden';
  sr.textContent = plainText.trim();

  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  el.replaceChildren(sr, wrapper);
  chars[0].before(cursor);
  root.classList.remove('js-typewriter'); // headline is now safe to show (all chars hidden individually)

  let i = 0;
  function typeNext() {
    if (i >= chars.length) { cursor.classList.add('is-done'); return; }
    chars[i].classList.add('is-typed');
    i += 1;
    if (i < chars.length) chars[i].before(cursor); else wrapper.append(cursor);
    setTimeout(typeNext, CONFIG.typeSpeedMs);
  }
  setTimeout(typeNext, CONFIG.typeStartDelayMs);
}

/* ---------- Mobile navigation (menu button) ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close after choosing a link.
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Escape closes the menu and returns focus to the button.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // If the window grows to the desktop layout, reset the state.
  window.matchMedia('(min-width: 48rem)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------- Demo dialog ----------
   Any element with data-demo-message opens the dialog and shows that message.
   To turn a trigger into a real link later, replace the <button> with an <a href="..."> in index.html. */
function initDialog() {
  const dialog = document.getElementById('demo-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const text = dialog.querySelector('[data-dialog-text]');
  let opener = null;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-demo-message]');
    if (trigger) {
      opener = trigger;
      text.textContent = trigger.dataset.demoMessage;
      dialog.showModal();   // moves focus inside, makes the page behind inert, Escape closes it
    } else if (e.target === dialog) {
      dialog.close();       // click on the dark backdrop
    }
  });

  dialog.addEventListener('close', () => {
    if (opener) opener.focus();
    opener = null;
  });
}

/* ==========================================================================
   Start-up
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDialog();
  initHeader();
  try {
    initTypewriter();
    initReveal();
  } finally {
    root.classList.remove('js-typewriter'); // never leave the headline hidden
  }

  // Keep the footer year current.
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Highlight today's row in the opening hours table.
  // data-day matches JavaScript's getDay(): 0 = Sunday ... 6 = Saturday.
  const today = document.querySelector(`.hours tr[data-day="${new Date().getDay()}"]`);
  if (today) today.classList.add('today');
});

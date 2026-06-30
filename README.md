# Shivam Goyal — Portfolio Website

A fully responsive, animation-rich personal portfolio built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Live at **[shivamgoyal.netlify.app](https://shivamgoyal.netlify.app)**.

---

## ✨ Highlights

- **Zero dependencies** — pure HTML/CSS/JS, deployed as a static site on Netlify
- **Fully interactive sections** — achievements, projects, and certificates can be added/removed live in the browser (session-only, Firebase-ready for persistence)
- **Custom animations throughout** — cursor-reactive spotlight, scroll-reveal transitions, auto-scrolling carousels, and a from-scratch Canvas2D galaxy background
- **Three dedicated hobby pages**, each with its own self-contained animation engine:
  - 🎵 A custom audio player with real-time waveform/spectrum visualizers
  - 🌸 A CSS-animated growing flower garden
  - 📸 A "Glimpse of Memories" photo gallery where pictures float as glowing nebula-like orbs across a procedurally generated spiral galaxy

---

## 🧱 Project Structure

```
.
├── index.html              # Main single-page portfolio (Home · About · Projects · Achievements · Contact)
├── style.css                # Global stylesheet for the main page
├── thank-you.html           # Post-submission landing page for the contact form
├── netlify.toml              # SPA redirect rules for Netlify
│
├── JavaScript/
│   ├── ui.js                 # Typed hero text, modals, toasts, cursor spotlight, scroll-reveal
│   ├── nav.js                 # Hamburger menu + sticky nav + active-link highlighting
│   ├── logo.js                 # Logo spin/pop interaction
│   ├── scroll-top.js            # Back-to-top button + scroll progress bar
│   ├── about.js                  # Profile photo upload + collapsible info panels
│   ├── projects.js                # Add-project modal + infinite auto-scroll carousel
│   ├── achievements.js             # Tab switching, certificate lightbox, award carousel
│   └── resume.js                    # Resume download + custom resume upload
│
└── MainPage/About/Hobbies/
    ├── Music/
    │   ├── index.html, style.css      # Custom audio player UI
    │   ├── script.js                   # Playback engine + 12 Canvas2D visualizer styles
    │   └── music-list.js                # Track metadata
    ├── Flower/
    │   ├── flower.html, flower.css     # CSS keyframe flower-growth animation
    │   └── flower.js                    # Load-state trigger
    └── Pictures_Videos/
        ├── memories.html, memories.css  # Photo gallery — floating glow-dot UI
        └── (inline script)               # Spiral galaxy renderer + dot physics
```

---

## 🛠️ Tech Stack

| Layer | Details |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Hand-written CSS3 — custom properties, `backdrop-filter`, CSS Grid/Flexbox, keyframe animations |
| Scripting | Vanilla ES5/ES6 JavaScript — no frameworks, no bundler |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Google Fonts — Poppins (main site), Inter (hobby pages) |
| Hosting | [Netlify](https://netlify.com), with form handling via Netlify Forms |
| Animation engines | Hand-rolled Canvas2D (galaxy background, audio visualizers), CSS keyframes (flower growth, glow pulses) |

---

## 🚀 Key Features

### Main Portfolio (`index.html`)
- **Hero section** with a typed-text role rotator and a cursor-reactive spotlight that follows the mouse within each section
- **About** — collapsible skill/experience/education/hobby panels with hover-peek and click-to-pin behavior, plus an in-browser profile photo swap
- **Projects** — infinite auto-scrolling carousel with pause-on-hover, manual arrow navigation, and a modal to add new project cards on the fly
- **Achievements** — tab-switchable Professional/Certifications views, a lightbox for certificate images, and a snake-scroll auto-carousel that activates automatically once enough cards are added
- **Contact** — Netlify-powered contact form with live character count and inline success feedback, alongside a resume download/upload widget

### Hobby Pages
- **Music player** — custom-built playback controls, volume slider, and a switchable bank of 12 distinct Canvas2D audio-reactive visualizations (bars, spirals, particle bubbles, and more)
- **Flower garden** — a multi-stage CSS animation sequence simulating organic growth (stems → leaves → petals → grass), fully keyframe-driven
- **Photo memories** — the most elaborate piece: photos render as small glowing, color-tinted orbs that drift upward like shooting stars across a hand-built spiral galaxy backdrop (procedurally placed stars along logarithmic spiral arms, layered nebula clouds, dust lanes, and diffraction-spike star flares). Hover or click a dot to expand it into a full photo card; pin it to keep it open. Includes a hover-reveal speed-control dock to adjust the float speed in real time.

---

## 📦 Running Locally

This is a static site with no build step — just serve the folder and open it in a browser.

```bash
# Using Python
python3 -m http.server 5500

# Or using the VS Code "Live Server" extension
# Right-click index.html → "Open with Live Server"
```

Then visit `http://127.0.0.1:5500/index.html`.

> **Note:** Some features (profile photo upload, resume upload, add project/award/certificate) are session-only — changes reset on page reload. These are designed as the front-end layer for a future Firebase integration to persist data permanently.

---

## 🌐 Deployment

The site auto-deploys to Netlify. The `netlify.toml` redirect rule routes all paths to `index.html`, and the contact form is wired to **Netlify Forms** (`thank-you.html` serves as the post-submit redirect).

---

## 📬 Contact

**Shivam Goyal** — Software Engineer in Test @ Finastra
📧 shivamgoyal452@gmail.com · [LinkedIn](https://linkedin.com/in/shivamgoyal452/) · [GitHub](https://github.com/shiv452)

---

<p align="center">
  <sub>Built with HTML, CSS &amp; JavaScript — no frameworks, just craft.</sub>
</p>

# Shivam Goyal — Portfolio & Lightweight CMS

A personal portfolio site that doubles as its own admin-editable CMS — built as static HTML/CSS/JS first, then backed by Firebase and Cloudinary so the owner can add and remove content live, without touching code or redeploying. Live at **[shivamgoyal.netlify.app](https://shivamgoyal.netlify.app)**.

---

## Overview

The site is server-rendered by nothing — it's still a static HTML/CSS/JS bundle with no build step, deployed as-is to Netlify. What makes it a "full-stack" app is the data layer sitting underneath it:

- **Firestore** stores the editable content (projects, certificates, awards, uploaded resumes, gallery photos, profile picture).
- **Cloudinary** hosts every image/PDF a visitor or the owner uploads.
- **Firebase Authentication** gates a single owner account — signing in reveals the add/upload/delete controls that are otherwise hidden.

Every editable section follows the same pattern: on page load, the site tries to read from Firestore; if that collection is empty or unreachable (offline, first deploy, etc.), the original hard-coded HTML already in the page is shown instead. The static content is never a placeholder to delete — it's the permanent fallback, so the site can never end up blank.

---

## Tech Stack

| Layer | Details |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Hand-written CSS3 — custom properties, `backdrop-filter`, CSS Grid/Flexbox, keyframe animations |
| Scripting | Vanilla ES5/ES6 JavaScript — no frameworks, no bundler. Firebase's SDK is loaded as native ES modules straight from Google's CDN, so no `npm install` is needed anywhere in this project |
| **Backend / Database** | **Firebase Firestore** — one collection per content type (`projects`, `certificates`, `awards`, `resumeFiles`, `memories`) plus a single `profile/main` document for the profile photo |
| **Authentication** | **Firebase Authentication** (email/password) — a single owner/admin account, no public sign-up anywhere |
| **File storage** | **Cloudinary** (unsigned upload preset) — images and PDFs uploaded through the site land here, not in Firestore itself |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Google Fonts — Poppins (main site), Inter (hobby pages) |
| Hosting | [Netlify](https://netlify.com) — git-push-to-deploy, no CI pipeline needed |
| Forms | Netlify Forms handles the contact form submission directly (unrelated to the Firebase layer) |

Everything runs on the free tier of every service used (Firebase Spark plan, Cloudinary free tier, Netlify free tier) — there is no billing account attached to any of them.

---

## How the admin/CMS layer works

There is no separate `/admin` page. The site itself **is** the dashboard:

1. A small lock icon in the footer opens a sign-in modal (Firebase Auth, email/password).
2. Signing in adds a `body.is-admin` class, which reveals the "Add Project" / "Add Certificate" / "Add Award" / upload-resume / delete buttons and the About-page profile photo camera icon — all hidden from regular visitors.
3. Adding something: any image/PDF is uploaded to Cloudinary first, then a small document (title, description, the Cloudinary URL, etc.) is written to the matching Firestore collection.
4. Deleting something: removes the Firestore document. The Firestore Security Rules (see `firestore.rules`) are the actual authorization layer — `read` is public, `write` requires a signed-in account — so the hidden buttons are a UX nicety, not the security boundary.
5. Firebase Auth persists across every page on the site (including the standalone hobby sub-pages), so signing in once from the footer covers the whole site.

---

## 🧱 Project Structure

```
.
├── index.html                # Main single-page portfolio (Home · About · Projects · Achievements · Contact)
├── style.css                  # Global stylesheet for the main page
├── thank-you.html             # Post-submission landing page for the contact form
├── netlify.toml                 # SPA redirect rules for Netlify
├── firebase-config.js            # Firebase web app config (public, not a secret) + SDK init
├── firestore.rules                # Security rules (read: public, write: signed-in only) - paste into the Firebase console, no CLI deploy used
│
├── JavaScript/
│   ├── ui.js                  # Typed hero text, modals, toasts, cursor spotlight, HTML-escaping helper
│   ├── auth.js                  # Firebase Auth sign-in/out, toggles body.is-admin
│   ├── nav.js                     # Hamburger menu + sticky nav + active-link highlighting
│   ├── logo.js                      # Logo spin/pop interaction
│   ├── scroll-top.js                  # Back-to-top button + scroll progress bar
│   ├── about.js                         # Profile photo upload (Firestore + Cloudinary) + collapsible info panels
│   ├── projects.js                        # Add-project modal, infinite auto-scroll carousel, Firestore-backed CRUD
│   ├── data-projects.js                     # Firestore + Cloudinary calls for Projects
│   ├── achievements.js                        # Tabs, lightbox, Certificate + Award CRUD (Firestore-backed)
│   ├── data-certificates.js                     # Firestore + Cloudinary calls for Certificates
│   ├── data-awards.js                             # Firestore + Cloudinary calls for Awards
│   ├── data-profile.js                              # Firestore + Cloudinary calls for the profile photo
│   ├── resume.js                                      # Resume download + upload (Firestore + Cloudinary)
│   └── data-resume.js                                   # Firestore + Cloudinary calls for uploaded resumes
│
└── MainPage/About/Hobbies/
    ├── Music/                    # Custom audio player + 12 Canvas2D visualizer styles (static, no CMS layer)
    ├── Flower/                     # CSS keyframe flower-growth animation (static, no CMS layer)
    └── Pictures_Videos/               # "Glimpse of Memories" photo gallery
        ├── memories.html, memories.css  # Spiral-galaxy photo gallery UI, admin-gated add/remove
        └── (inline script + data-memories.js)  # Galaxy renderer, dot physics, Firestore + Cloudinary CRUD
```

---

## 🚀 Key Features

### Main Portfolio (`index.html`)
- **Hero section** with a typed-text role rotator and a cursor-reactive spotlight
- **About** — collapsible skill/experience/education/hobby panels, plus an admin-editable profile photo (persists via Firestore + Cloudinary)
- **Projects** — infinite auto-scrolling carousel, admin can add/delete project cards with a Cloudinary-hosted image, changes persist for every visitor
- **Achievements** — tab-switchable Professional/Certifications views; both support admin add/delete with image **or PDF** uploads, backed by Firestore
- **Contact** — Netlify-powered contact form with live character count and inline success feedback
- **Resume** — visitors download any of 4 built-in resumes; admin can additionally upload new ones, which persist via Firestore + Cloudinary

### Hobby Pages
- **Music player** — custom playback controls + 12 Canvas2D audio-reactive visualizations (static content, no CMS layer)
- **Flower garden** — CSS keyframe organic-growth animation (static content, no CMS layer)
- **Photo memories** — hand-built spiral-galaxy Canvas2D background with photos as floating glowing orbs; admin can add/remove photos, which persist via Firestore + Cloudinary alongside the permanent built-in photo set

---

## 📦 Running Locally

Still a static site with no build step — just serve the folder and open it in a browser.

```bash
python3 -m http.server 5500
```

Then visit `http://127.0.0.1:5500/index.html`. The Firestore-backed sections will read from the live Firebase project (there's no local/emulator mode configured) — anonymous visitors get read-only access, and admin actions require the real owner credentials.

---

## 🔧 Setting Up Your Own Instance

If you fork this and want your own editable content rather than reading from the original owner's Firebase project:

1. **Firebase**: create a project at [console.firebase.google.com](https://console.firebase.google.com), enable **Firestore Database** (production mode) and **Authentication → Email/Password**, then add yourself as a user under Authentication → Users. Paste your project's web config into `firebase-config.js`.
2. **Firestore rules**: paste the contents of `firestore.rules` into Firebase Console → Firestore Database → Rules → Publish.
3. **Cloudinary**: create a free account at [cloudinary.com](https://cloudinary.com), then create an **unsigned** upload preset (Settings → Upload → Upload presets). Update the `CLOUD_NAME` and `UPLOAD_PRESET` constants in each `JavaScript/data-*.js` file.
4. Sign in via the footer lock icon with the account you created in step 1, and you're the admin.

---

## 🔒 Security Notes

- Firebase's web config in `firebase-config.js` is public by design (it's a client identifier, not a secret) — real authorization happens in `firestore.rules`, not by hiding that file.
- Cloudinary's unsigned upload preset doesn't check Firebase Auth — it's a separate service. Anyone could technically trigger a Cloudinary upload via devtools, but they still can't get it onto the live site without a real Firestore write, which requires signing in. Worth hardening with a signed-upload server function if this ever becomes a real concern; not necessary for the traffic a personal portfolio sees.

---

## 🌐 Deployment

The site auto-deploys to Netlify on every push. `netlify.toml` handles the SPA redirect, and the contact form is wired to **Netlify Forms** (`thank-you.html` is the post-submit redirect). Firebase/Cloudinary require no deployment step of their own — they're called directly from the client at runtime.

---

## 📬 Contact

**Shivam Goyal** — Software Engineer in Test @ Finastra
📧 shivamgoyal452@gmail.com · [LinkedIn](https://linkedin.com/in/shivamgoyal452/) · [GitHub](https://github.com/shiv452)

---

<p align="center">
  <sub>Built with HTML, CSS, JavaScript, Firebase &amp; Cloudinary.</sub>
</p>

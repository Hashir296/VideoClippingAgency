# Creator Growth System — Video Clipping & Attention Architecture Agency

A luxury, high-ticket video clipping and algorithmic distribution agency web application built for creators, venture founders, and high-output educators.

---

## 🌟 Key Features

* **High-Ticket Dark Luxury Aesthetic**: Curated gold-and-obsidian palette (`#070709`, `#121217`, `#D4AF37`), fluid kinetic typography, and grain film texture.
* **Proprietary Research & Field Notes (Blog System)**:
  * Magazine-grade editorial masthead with live impressions and retention benchmarks.
  * Billboard Cover Story with responsive layout.
  * Reading Progress Bar tracking user scroll.
  * Interactive Table of Contents auto-parsing headings with smooth scrolling.
  * Category filtering, sort by views/latest, and instant live search.
  * Responsive Markdown table rendering, executive callouts, and one-click code copy.
* **Owner-Only Secret Admin Suite**:
  * Hidden from public visitors (accessible via `#admin` URL hash).
  * 1-Click Instant Demo Unlock.
  * Keyword Research Engine with SEO volume, competition scores, and auto-tagging.
  * AI Article Generator powered by Google Gemini API with intelligent local fallback.
  * Lead pipeline management and live subscriber tables.
* **Full-Funnel Client Conversion**:
  * Interactive 4-step Audit Invitation Modal with tier recommendations.
  * Interactive 3D Depth Console & interactive retainers.
* **Database & Cloud Architecture**:
  * Connected live to **MongoDB Atlas Cloud Database**.
  * Serverless-ready Express API with connection pooling and DNS fallback.

---

## 🚀 Vercel Deployment Instructions

Deploying to Vercel is turnkey:

### 1. Import Git Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select the GitHub repository: `Hashir296/VideoClippingAgency`.

### 2. Configure Environment Variables
In the Vercel project settings, add the following Environment Variables:

| Key | Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://hashirch296_db_user:5POOBbLLHCbRiT6h@cluster0.wzfhfny.mongodb.net/creator_growth_db?retryWrites=true&w=majority` |
| `CLIENT_ORIGIN` | `https://your-project.vercel.app` (or leave default `*` for universal CORS) |
| `GEMINI_API_KEY` | *(Optional)* Your Google Gemini API Key |

### 3. Deploy
Click **Deploy**. Vercel will:
- Build the Vite client bundle to `client/dist`.
- Deploy `/api/*` routes via the Express serverless function `api/index.js`.
- Connect securely to MongoDB Atlas.

---

## 💻 Local Development

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Run backend API (Port 5000)
cd server
npm run dev

# Run Vite frontend (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173/` in your browser.
Owner secret admin: `http://localhost:5173/#admin` (Passcode: `admin123`).

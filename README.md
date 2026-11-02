# Scoped: AI Project Proposal Generator

Paste a vague client idea, get a structured proposal: input quality rating, overview, scope (in / out),
deliverables, milestones with timeline, risks with mitigation, and assumptions. If the idea is too vague,
the AI asks clarifying questions; you answer in a text box and it rebuilds an improved proposal.

**Stack:** React 18 + Vite, Framer Motion, Groq API (`openai/gpt-oss-120b`), Netlify Functions.

---

## 1. Run it on any machine (Windows / Mac / Linux)

You need **Node.js 18 or newer** (https://nodejs.org, the LTS version is fine). Check with `node -v`.

```bash
npm install
cp .env.example .env        # Windows (cmd): copy .env.example .env
```

Open the new `.env` file and paste your Groq key:

```
GROQ_API_KEY=gsk_your_key_here
```

Then start it:

```bash
npm run dev
```

Open the link it prints (usually http://localhost:5173). If you change `.env`, stop and restart `npm run dev`.

## 2. Deploy on Netlify

The key never goes into the browser: the app calls `/api/generate`, a Netlify Function that holds the key
(locally, Vite plays the same role). So **do not** name it `VITE_...`.

**Option A: from GitHub (recommended)**
1. Push this folder to a GitHub repo (`.env` is already git-ignored, so your key stays private).
2. On Netlify: Add new site, Import an existing project, pick the repo. Build settings are read from `netlify.toml`.
3. Site configuration, Environment variables, add `GROQ_API_KEY` = your key.
4. Deploys, Trigger deploy, Deploy site.

**Option B: Netlify CLI**
```bash
npm install
npx netlify login
npx netlify init        # or: npx netlify link
npx netlify env:set GROQ_API_KEY your_key_here
npx netlify deploy --build --prod
```

Note: dragging only the `dist` folder into Netlify will NOT work, because the serverless function is not included.

## 3. Test without internet or a key

```bash
npm test
```
Runs offline checks on the server logic (mocked Groq).

## 4. Project map

| Path | What it does |
| --- | --- |
| `server/groq.js` | System prompt, Groq call, validation of the AI's JSON output |
| `netlify/functions/generate.mjs` | Production API route (`/api/generate`) |
| `vite.config.js` | Same API route for local dev, reads `.env` |
| `src/App.jsx` | App state and the generate / update flow |
| `src/components/` | Hero, Composer, Loading, Results, Clarify, animated Background |

## 5. Troubleshooting

- **"GROQ_API_KEY is missing"**: `.env` is not created, misnamed, or you did not restart after editing it.
- **"Groq rejected the API key"**: extra spaces or quotes in `.env`, or the key was revoked.
- **Rate limit message**: wait a few seconds; free Groq keys have per-minute limits.
- **Works locally but not on Netlify**: add `GROQ_API_KEY` in Netlify's environment variables and redeploy.

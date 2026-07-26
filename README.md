# Nurzaman Ahmed — Research & Development

A personal research and engineering portfolio focused on interoperable AI,
agent systems, edge computing, IoT, and digital agriculture.

The site is intentionally static-first and can be hosted on GitHub Pages
without a server.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to GitHub Pages

The included workflow at `.github/workflows/deploy-pages.yml` deploys every
push to `master`.

1. Push this project to the desired GitHub repository.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `master`, or run the workflow manually.

The workflow automatically supports both:

- a root user site such as `nurzaman7.github.io`
- a project site such as `nurzaman7.github.io/repository-name`

## Portfolio agent

The portfolio navigator is currently hidden with
`AGENT_CHAT_ENABLED = false` in `app/page.tsx`. Set it to `true` when the agent
is ready for public use.

### Optional agent API

Without any configuration, the portfolio navigator uses a privacy-friendly
local guide. To connect a hosted agent, set:

```bash
NEXT_PUBLIC_AGENT_API_URL=https://your-agent.example.com/chat
```

For GitHub Pages, create a repository variable named
`NEXT_PUBLIC_AGENT_API_URL` under **Settings → Secrets and variables →
Actions → Variables**.

The site sends:

```json
{
  "message": "visitor question",
  "context": "nurzaman-ahmed-portfolio"
}
```

The endpoint should return:

```json
{
  "reply": "agent response"
}
```

The endpoint must allow requests from the portfolio domain. Never put a private
API key in a `NEXT_PUBLIC_*` value; authentication and rate limiting should
remain on the agent service.

## Production builds

```bash
npm run build
npm run build:pages
```

`npm run build` creates the deployable Sites/Cloudflare build.
`npm run build:pages` also pre-renders the portfolio into static files under
`dist/client`.

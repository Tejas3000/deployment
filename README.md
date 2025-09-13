# Kannada News Classifier

A minimal web UI that calls the Hugging Face Space `Santhosh737/Indic-Classify` with the `@gradio/client` API. Enter a Kannada headline, choose a model (DistilBERT, mBERT, XLM-R), and view the top predictions with confidence bars.

## Quick start

Requirements:
- Node.js 18+ (npm or pnpm). On macOS with zsh, install via Homebrew if needed: `brew install node`.

Run locally:
1. Install deps
	- npm: `npm install`
2. Start dev server
	- npm: `npm run dev`
3. Open the localhost URL that Vite prints.

## API

This app uses `@gradio/client`:

```js
import { Client } from "@gradio/client";

const client = await Client.connect("Santhosh737/Indic-Classify");
const result = await client.predict("/predict", {
  text: "Hello!!",
  model_choice: "DistilBERT",
});
console.log(result.data);
```

We wrap this in `src/api/indicClient.js` and normalize results to `{ label, score }`.

## Troubleshooting

- npm: not found — install Node.js (e.g., `brew install node`) or use `corepack enable` then `pnpm install` if you prefer pnpm.
- CORS / network errors — the public Space must be reachable. If it’s sleeping, the first call may take longer to warm up.
- Build errors — delete `node_modules` and lockfile, then reinstall.

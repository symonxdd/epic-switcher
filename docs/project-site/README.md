<div align="center">
  <a href='' target="_blank">
    <img src="../../build/appicon.png" alt="Project Icon" width="100" style="pointer-events: none;">
  </a>
  <h1>Epic Switcher - Project Site</h1>
</div>

The official project site for Epic Switcher.

<br/>

## Tech Stack

- **React**: The core UI library.
- **Vite**: The build tool and development server.
- **Tailwind CSS**: A utility-first styling framework used to compose designs directly in the markup.
- **Framer Motion**: The library responsible for the site's animations and micro-interactions.

### Serverless & Storage
The site is primarily static, though cloud-based components are used for dynamic features.

- **Serverless Function**: A Node.js script (`api/reactions.js`) used for tasks like recording emoji reactions.
- **Upstash Redis**: A fast, in-memory database used for low-latency persistence of emoji reaction counts.

<details>
<summary>Serverless Function explanation</summary>

A Vercel Function is a serverless function, as in 'a single callable unit of code', that runs only when called (like an API endpoint)/
Serverless means we don't manage or run servers — Vercel automatically handles scaling, uptime, and infrastructure.

Vercel follows a convention where any file placed in the `/api` directory **at the root of the project** is automatically treated as a serverless function endpoint.

- **Execution**: A function is executed only when requested (e.g., when the frontend calls `fetch('/api/reactions')`). It "wakes up" to process the request and then shuts down until the next call.
- **Signature**: Functions use the `(req, res)` pattern. `req` (Request) contains incoming data, while `res` (Response) provides the tools to send data back to the client.
- **The reactions.js Function**: This specific function handles reaction counts by making secure HTTP requests to the Upstash Redis database.

</details>

<br/>

## Hosting
Hosted on **Vercel** through the generous free tier. Vercel has been an exquisite platform for publishing this project site, with exceptionally thorough and intuitive documentation and an absolutely beautiful dashboard experience.

<br/>

## Key Components
- **Emoji reactions**: A custom-built engagement feature for user feedback.
- **EmailJS integration**: Powering the contact form directly from the browser.
- **Automated release fetching**: A custom React hook that retrieves Epic Switcher's latest version using the GitHub API. 
  *(A "hook" is a modular piece of logic that allows React components to handle external data or side effects independently from the UI layout).*

<br/>

## Dev Prerequisites
- Node.js

<br/>

## Local Development
```bash
npm install && npm run dev
```

<br/>

## Local API testing
Testing the serverless function in `api/reactions.js` and its Redis integration requires the Vercel CLI to be installed and access to the corresponding Vercel account.

Following commands should be run from the `docs/project-site` directory:

1. **[Link the project](https://vercel.com/docs/cli/project-linking) (once)**: 
   ```bash
   vercel link
   ```
   *This links the local directory to the project on the Vercel account. During this step, the CLI will prompt to pull the Vercel Project's environment variables, press "Y" to confirm.*

2. **Run [Vercel dev server](https://vercel.com/docs/cli/dev)**: 
   ```bash
   vercel dev
   ```

`vercel dev` replicates the Vercel deployment environment locally. It runs a Vite server alongside a local API handler that ensures HTTP requests to the `/api` directory function as they would when published.

<br/>

<div align="center">
  <sub>Made with 💛 by Symon</sub>
</div>
<div align="center">
  <sub>Powered by <a href="https://vercel.com/">Vercel</a></sub>
</div>

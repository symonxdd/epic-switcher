const PILL_STYLE = "background: #6366f1; color: white; border-radius: 5px; padding: 2px 4px; font-weight: bold; font-size: 0.85em; margin-right: 4px;";
const STATUS_STYLE = "color: inherit; font-weight: bold;";

const README_URL = "https://github.com/symonxdd/epic-switcher/blob/main/docs/project-site/README.md#local-api-testing";
const RESET_TIP = "Tip: Reset reactions in Application tab -> Storage -> Local Storage or run this in the console: localStorage.removeItem('epic-switcher-reactions')";

export const logServerlessDisabled = () => {
  if (window.location.hostname !== 'localhost') return;

  console.groupCollapsed(
    "%c SERVERLESS %c Status: disabled",
    PILL_STYLE,
    STATUS_STYLE
  );
  console.info("Local instance is running without Serverless Function support.");
  console.info("API features (emoji counts) are unavailable.");
  console.info("Run `vercel dev` to enable serverless functionality.");
  console.info(RESET_TIP);
  console.info(`For more info, see 'Local API testing' section in ${README_URL}`);
  console.groupEnd();
};

export const logServerlessConnectionFailed = () => {
  if (window.location.hostname !== 'localhost') return;

  console.groupCollapsed(
    "%c SERVERLESS %c Status: connection failed",
    PILL_STYLE,
    STATUS_STYLE
  );
  console.info("Connection to /api/reactions failed.");
  console.info("Local development with serverless functions requires running `vercel dev`.");
  console.info(RESET_TIP);
  console.info(`For more info, see 'Local API testing' section in ${README_URL}`);
  console.groupEnd();
};

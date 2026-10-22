import { createServer } from "node:http";
import next from "next";

// Real gateway access requires the explicit flag; storage remains isolated in both modes.
const fixtureDirectory = process.argv.includes("--motion") ? ".data/motion-browser" : process.argv.includes("--visuals") ? process.argv.includes("--live-gateway") ? ".data/visual-live" : ".data/visual-browser" : ".data/review-browser";
Object.assign(process.env, {
  V3_DATA_DIR: `${fixtureDirectory}/database`,
  V3_VIDEOS_DIR: `${fixtureDirectory}/videos`,
  ...(process.argv.includes("--live-gateway") ? {} : {
  CLIPROXYAPI_BASE_URL: "http://127.0.0.1:3105/v1",
  CLIPROXYAPI_API_KEY: "fixture-only",
  CLIPROXYAPI_MODEL: "fixture-model",
  }),
});
const app = next({ dev: false, hostname: "127.0.0.1", port: 3003 });
await app.prepare();
createServer(app.getRequestHandler()).listen(3003, "127.0.0.1", () => console.log(`Isolated review studio (${process.argv.includes("--live-gateway") ? "LIVE gateway" : "fixture gateway"}): http://127.0.0.1:3003`));

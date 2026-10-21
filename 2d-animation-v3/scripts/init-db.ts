import { readConfig } from "../server/config.ts";
import { DATABASE_VERSION, openDatabase } from "../server/database.ts";

const database = openDatabase(readConfig().dataDirectory);
try {
  const result = database.prepare("PRAGMA quick_check").get();
  if (result?.quick_check !== "ok") throw new Error("SQLite integrity check failed");
  console.log(`SQLite ready; schema version ${DATABASE_VERSION}.`);
} finally {
  database.close();
}

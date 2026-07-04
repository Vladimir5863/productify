import { drizzle } from "drizzle-orm/singlestore/driver";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in inviroment variables");
}

const pool = new Pool({ connectionString: ENV.DATABASE_URL });

pool.on("connect", () => {
  console.log("Database connected succesfully ✅");
});

pool.on("error", (e) => {
  console.error("Database connected unsuccesfully ❎:", e);
});

export const db = drizzle({ client: pool, schema: schema });

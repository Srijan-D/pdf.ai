import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" })
// as .env variables are only available in the srv directory we need to install and import dotenv and
//  specify the path to the .env file


export default {
    driver: "pg",
    schema: "./src/lib/db/schema.ts",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
} satisfies Config
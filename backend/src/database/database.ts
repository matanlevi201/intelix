import { drizzle } from "drizzle-orm/node-postgres";
import { IDatabaseService } from "../types/index";
import * as schema from "./schema";
import { logger } from "../utils";
import { Pool } from "pg";

export class Database implements IDatabaseService {
  private db: ReturnType<typeof drizzle<typeof schema>> | null = null;
  private pool: Pool;

  constructor() {}

  public async connect(pool: Pool) {
    try {
      this.pool = pool;
      this.db = drizzle(this.pool, { schema });
      await this.db.execute("select 1");
      logger.info("[Database] connection established successfully");
    } catch (error) {
      throw new Error("Database connection failed");
    }
  }

  public getClient() {
    return this.db;
  }

  public async disconnect() {
    try {
      await this.pool.end();
      this.pool = null;
      this.db = null;
      logger.info("[Database] connection closed successfully");
    } catch (error) {
      throw new Error("Failed to close database connection");
    }
  }
}

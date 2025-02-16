import "dotenv/config";
import { Pool } from "pg";
import { seedUsers } from "./users.seed";
import { IDatabaseService, IUserRepository, TYPES } from "../types";
import { container } from "../../inversify.config";
import { UserRepository } from "../repositories";
import { Database } from "../database/database";

const bootstrap = async () => {
  container.bind<IDatabaseService>(TYPES.IDatabaseService).to(Database).inSingletonScope();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 5000,
    max: 5,
  });
  await container.get<IDatabaseService>(TYPES.IDatabaseService).connect(pool);
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
};

const seedTables = async function () {
  try {
    await bootstrap();
    const database = container.get<IDatabaseService>(TYPES.IDatabaseService).getClient();
    await database.transaction(async (tx) => {
      await seedUsers(tx);
    });
  } catch (error) {
    console.log(error);
  }
};

seedTables();

import "dotenv/config";
import { IBlacklistRepository, IDatabaseService, IEmailRepository, IEmailService, IUserRepository, TYPES } from "./types/index";
import { bootstrap, container } from "../inversify.config";
import { logger } from "./utils";
import { app } from "./app";
import { Pool } from "pg";
import { env } from "./config";

const low = async () => {
  try {
    await container.get<IEmailService>(TYPES.IEmailService).init();
  } catch (error) {
    logger.error(error.message);
  }
};

const mid = async () => {
  try {
    container.get<IUserRepository>(TYPES.IUserRepository);
    container.get<IEmailRepository>(TYPES.IEmailRepository);
    container.get<IBlacklistRepository>(TYPES.IBlacklistRepository);
  } catch (error) {
    logger.error(error.message);
  }
};

const high = async () => {
  try {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      idleTimeoutMillis: 5000,
      max: 5,
    });
    await container.get<IDatabaseService>(TYPES.IDatabaseService).connect(pool);
  } catch (error) {
    logger.error(error.message);
  }
};

const initDependencies = async () => {
  await high();
  await mid();
  await low();
};

const start = async () => {
  bootstrap();
  await initDependencies();
  app.listen(env.PORT, () => {
    logger.info(`[Docs]: http://localhost:${env.PORT}/api-docs`);
    logger.info(`[Server]: listening on port: ${env.PORT}`);
  });
};

start();

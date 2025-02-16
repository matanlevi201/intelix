import "dotenv/config";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { bootstrap, container } from "../../inversify.config";
import { TYPES, IDatabaseService } from "../../src/types";
import { getCurrentSchema } from "./export-schema";
import { CurrentUser } from "@intelix/common";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

declare global {
  var signin: (payload?: CurrentUser) => string;
  var getDbService: () => IDatabaseService;
}

let Container: StartedPostgreSqlContainer;
let pool: Pool;

beforeAll(async () => {
  Container = await new PostgreSqlContainer().withDatabase("test_db").withUsername("test_user").withPassword("test_password").start();
  pool = new Pool({ connectionString: Container.getConnectionUri() });
  await pool.query(await getCurrentSchema());
  bootstrap();
  const databaseService = container.get<IDatabaseService>(TYPES.IDatabaseService);
  await databaseService.connect(pool);
  global.getDbService = () => databaseService;
});

beforeEach(async () => {
  const tablesToTruncate = await pool.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public';
  `);

  for (const row of tablesToTruncate.rows) {
    await pool.query(`TRUNCATE TABLE ${row.tablename} RESTART IDENTITY CASCADE`);
  }
});

afterAll(async () => {
  await global.getDbService().disconnect();
  await Container?.stop();
  container.unbindAll();
  delete (global as any).signin;
  delete (global as any).getDbService;
});

global.signin = (signinPayload) => {
  const payload = signinPayload ?? { id: 1, email: "test@test.com", is2FAEnabled: false, is2FAVerified: false };
  const token = jwt.sign(payload, process.env.ACCESS_JWT_KEY as string, { expiresIn: "15m" });
  return `Bearer ${token}`;
};

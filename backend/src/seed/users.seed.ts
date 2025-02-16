import { UserRole } from "../database/schema";
import { container } from "../../inversify.config";
import { DbTransaction, IUserRepository, TYPES } from "../types";
import { logger, Password } from "../utils";

const users = [
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: UserRole.ADMIN,
  },
];

export const seedUsers = async function (tx: DbTransaction) {
  const usersRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const promises = users.map(async (user) => usersRepository.create({ ...user, password: await Password.toHash(user.password) }, tx));
  await Promise.all(promises);
  logger.info("[Seed]: users");
};

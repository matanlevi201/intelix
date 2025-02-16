import { inject, injectable } from "inversify";
import { User, InsertUser, userTable } from "../database/schema";
import { BaseRepository } from "./base.repository";
import { IUserRepository, TYPES, IDatabaseService } from "../types/index";
import { logger } from "../utils";

@injectable()
export class UserRepository extends BaseRepository<typeof userTable, InsertUser, User> implements IUserRepository {
  protected tableName = "userTable";
  protected table = userTable;
  protected columns = {
    id: true,
    email: true,
    password: true,
    googleId: true,
    facebookId: true,
    is2FAEnabled: true,
    twoFactorSecret: true,
    role: true,
    createdAt: true,
  };
  constructor(@inject(TYPES.IDatabaseService) database: IDatabaseService) {
    super(database);
    logger.info(`[Container] ${UserRepository.name} added successfully`);
  }
}

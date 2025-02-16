import { inject } from "inversify";
import { Email, emailTable, InsertEmail } from "../database/schema";
import { IDatabaseService, TYPES } from "../types/index";
import { logger } from "../utils";
import { BaseRepository } from "./base.repository";

export class EmailRepository extends BaseRepository<typeof emailTable, InsertEmail, Email> {
  protected table = emailTable;
  protected tableName = "emailTable";
  protected columns = {
    id: true,
    userId: true,
    mailId: true,
    createdAt: true,
  };
  constructor(@inject(TYPES.IDatabaseService) database: IDatabaseService) {
    super(database);
    logger.info(`[Container] ${EmailRepository.name} added successfully`);
  }
}

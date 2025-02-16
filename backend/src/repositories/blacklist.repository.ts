import { inject } from "inversify";
import { Blacklist, blacklistTable, InsertBlacklist } from "../database/schema";
import { IDatabaseService, TYPES } from "../types/index";
import { logger } from "../utils";
import { BaseRepository } from "./base.repository";

export class BlacklistRepository extends BaseRepository<typeof blacklistTable, InsertBlacklist, Blacklist> {
  protected table = blacklistTable;
  protected tableName = "blacklistTable";
  protected columns = {
    id: true,
    token: true,
  };
  constructor(@inject(TYPES.IDatabaseService) database: IDatabaseService) {
    super(database);
    logger.info(`[Container] ${BlacklistRepository.name} added successfully`);
  }
}

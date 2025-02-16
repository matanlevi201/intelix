import { MessageData, MessageDetails } from "@trycourier/courier/api";
import { User, Email, Blacklist, InsertEmail, InsertUser, InsertBlacklist } from "../database/schema";
import { Request, Response, NextFunction, Router } from "express";
import { drizzle, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import * as schema from "../database/schema";
import { CurrentUser } from "@intelix/common";
import { Pool } from "pg";

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
    }
  }
}

export type Database = ReturnType<typeof drizzle<typeof schema>>;
export type DbTransaction = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;
export interface IDatabaseService {
  connect(pool: Pool): Promise<void>;
  getClient(): Database;
  disconnect(): Promise<void>;
}

export interface IBaseRepository<T, K> {
  create(item: K, tx?: DbTransaction): Promise<T>;
  update(id: string | number, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  find(item: Partial<T>): Promise<T[]>;
  findOne(item: Partial<T>): Promise<Partial<T>>;
}
export interface IUserRepository extends IBaseRepository<User, InsertUser> {}
export interface IEmailRepository extends IBaseRepository<Email, InsertEmail> {}
export interface IBlacklistRepository extends IBaseRepository<Blacklist, InsertBlacklist> {}

export interface IEmailService {
  init: () => Promise<void>;
  resolve: () => void;
  sendEmail: (to: string, templateId: string, data: MessageData) => Promise<string>;
  getEmailById: (id: string) => Promise<MessageDetails>;
}

export interface ITwoFactorController {
  generate2faQr: (req: Request, res: Response<{ secret: string; qr: string }>, next?: NextFunction) => Promise<void>;
  enable2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  verify2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  disable2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IRouter {
  getRouter: () => Router;
}
export interface ITwoFactorRouter extends IRouter {}

export const TYPES = {
  IDatabaseService: Symbol("IDatabaseService"),
  ITwoFactorRouter: Symbol("ITwoFactorRouter"),
  ITwoFactorController: Symbol("ITwoFactorController"),
  IUserRepository: Symbol("IUserRepository"),
  IEmailRepository: Symbol("IEmailRepository"),
  IBlacklistRepository: Symbol("IBlacklistRepository"),
  IEmailService: Symbol("IEmailService"),
};

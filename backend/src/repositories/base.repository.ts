import { eq, InferInsertModel } from "drizzle-orm";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { DbTransaction, IBaseRepository, IDatabaseService } from "../types/index";

type Tbl = PgTable<TableConfig>;
type Insert<T extends Tbl> = InferInsertModel<T>;

export abstract class BaseRepository<Table extends Tbl, K extends Insert<Table>, T> implements IBaseRepository<T, K> {
  protected abstract table: Table;
  protected abstract tableName: string;
  protected abstract columns: Record<keyof T, boolean>;
  protected database: ReturnType<IDatabaseService["getClient"]>;

  constructor(databaseService: IDatabaseService) {
    this.database = databaseService.getClient();
  }

  async create(item: K, tx: DbTransaction): Promise<T> {
    const entity = tx ? await tx.insert(this.table).values(item).returning() : await this.database.insert(this.table).values(item).returning();
    return entity[0] as T;
  }

  async update(id: string | number, item: Partial<T>): Promise<T> {
    const entity = await this.database.update(this.table).set(item).where(eq(this.table["id"], id)).returning();
    return entity[0] as T;
  }

  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async find(item: Partial<T>): Promise<T[]> {
    return await this.database.query[this.tableName].findMany({
      columns: this.columns,
      where: (table: Table, { eq, and }) => {
        const conditions = Object.entries(item).map(([key, value]) => eq(table[key], value));
        return and(...conditions);
      },
    });
  }

  async findOne(item: Partial<T>): Promise<T> {
    return await this.database.query[this.tableName].findFirst({
      columns: this.columns,
      where: (table: Table, { eq, and, isNull }) => {
        const conditions = Object.entries(item).map(([key, value]) => (value === null ? isNull(table[key]) : eq(table[key], value)));
        return and(...conditions);
      },
    });
  }
}

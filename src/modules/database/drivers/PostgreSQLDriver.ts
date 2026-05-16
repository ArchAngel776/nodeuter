import type DBDriver from "@/api/database/DBDriver"
import type { PostgreSQLConfig } from "@/api/database/drivers/PostgreSQLConfig"
import type Transaction from "@/api/database/Transaction"

export default class PostgreSQLDriver<
  Row extends Record<string, unknown>
> implements DBDriver<Row>
{
  protected readonly config: PostgreSQLConfig

  public constructor(config: PostgreSQLConfig)
  {
    this.config = config
  }

  public async connect(): Promise<void>
  {
    throw new Error("Not implemented")
  }

  public async disconnect(): Promise<void>
  {
    throw new Error("Not implemented")
  }

  public async beginTransaction(): Promise<Transaction>
  {
    throw new Error("Not implemented")
  }

  public async create(row: Row): Promise<void>
  {
    void row
    throw new Error("Not implemented")
  }

  public async createBatch(rows: readonly Row[]): Promise<void>
  {
    void rows
    throw new Error("Not implemented")
  }

  public async read(): Promise<Row>
  {
    throw new Error("Not implemented")
  }

  public async readAll(): Promise<Row[]>
  {
    throw new Error("Not implemented")
  }

  public async update(row: Row): Promise<void>
  {
    void row
    throw new Error("Not implemented")
  }

  public async delete(row: Row): Promise<void>
  {
    void row
    throw new Error("Not implemented")
  }
}

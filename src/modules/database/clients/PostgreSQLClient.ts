import type DBClient from "@/api/database/DBClient"
import type Transaction from "@/api/database/Transaction"
import DBConnectionException from "@/exceptions/database/DBConnectionException"
import type Entity from "@/Entity"
import type { PoolClient } from "pg"

export default class PostgreSQLClient implements DBClient
{
  protected readonly client: PoolClient

  public constructor(client: PoolClient)
  {
    this.client = client
  }

  public async release(): Promise<void>
  {
    this.client.release()
  }

  public async beginTransaction(): Promise<Transaction>
  {
    try
    {
      await this.client.query("BEGIN")
    }
    catch (error)
    {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new DBConnectionException(`Failed to begin PostgreSQL transaction: ${reason}`)
    }

    return new PostgreSQLTransaction(this.client)
  }

  public async create<Row extends Entity>(...rows: readonly Row[]): Promise<void>
  {
    void rows
    throw new Error("Not implemented")
  }

  public async read<Row extends Entity>(): Promise<Row>
  {
    throw new Error("Not implemented")
  }

  public async update<Row extends Entity>(row: Row): Promise<void>
  {
    void row
    throw new Error("Not implemented")
  }

  public async delete<Row extends Entity>(row: Row): Promise<void>
  {
    void row
    throw new Error("Not implemented")
  }
}

export class PostgreSQLTransaction implements Transaction
{
  protected readonly client: PoolClient

  public constructor(client: PoolClient)
  {
    this.client = client
  }

  public async commit(): Promise<void>
  {
    await this.client.query("COMMIT")
  }

  public async rollback(): Promise<void>
  {
    await this.client.query("ROLLBACK")
  }
}

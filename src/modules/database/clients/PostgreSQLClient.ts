import type DBClient from "@/api/database/DBClient"
import type QueryBuilder from "@/api/database/QueryBuilder"
import type Transaction from "@/api/database/Transaction"
import DBConnectionException from "@/exceptions/database/DBConnectionException"
import DBReadException from "@/exceptions/database/DBReadException"
import DBWriteException from "@/exceptions/database/DBWriteException"
import type Entity from "@/Entity"
import type { PoolClient } from "pg"

export default class PostgreSQLClient implements DBClient<string>
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

  public async create(query: QueryBuilder<string>): Promise<void>
  {
    await this.executeWriteQuery(query, "create")
  }

  public read<Row extends Entity>(query: QueryBuilder<string>): AsyncIterable<Row>
  {
    return this.readRows<Row>(query)
  }

  public async update(query: QueryBuilder<string>): Promise<void>
  {
    await this.executeWriteQuery(query, "update")
  }

  public async delete(query: QueryBuilder<string>): Promise<void>
  {
    await this.executeWriteQuery(query, "delete")
  }

  protected async executeWriteQuery(query: QueryBuilder<string>, operation: "create" | "update" | "delete"): Promise<void>
  {
    try
    {
      await this.client.query(query.build())
    }
    catch (error)
    {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new DBWriteException(`Failed to execute PostgreSQL ${operation} query: ${reason}`)
    }
  }

  protected async *readRows<Row extends Entity>(query: QueryBuilder<string>): AsyncIterable<Row>
  {
    try
    {
      const result = await this.client.query<Row>(query.build())

      for (const row of result.rows)
      {
        yield row
      }
    }
    catch (error)
    {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new DBReadException(`Failed to execute PostgreSQL read query: ${reason}`)
    }
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

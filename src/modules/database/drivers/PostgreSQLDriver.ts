import type DBDriver from "@/api/database/DBDriver"
import type { PostgreSQLConfig } from "@/api/database/drivers/PostgreSQLConfig"
import type Transaction from "@/api/database/Transaction"
import DBConnectionException from "@/exceptions/database/DBConnectionException"
import resolveSecret from "@/security/resolveSecret"
import { Pool } from "pg"

export default class PostgreSQLDriver<
  Row extends Record<string, unknown>
> implements DBDriver<Row>
{
  protected readonly pool: Pool

  public constructor(config: PostgreSQLConfig)
  {
    this.pool = new Pool(
      {
        host: config.host,
        port: config.port,
        database: config.database,
        user: this.resolveUsername(config),
        password: this.resolvePassword(config),
        application_name: config.application_name,
        connectionTimeoutMillis: config.connect_timeout,
        statement_timeout: config.statement_timeout,
        options: config.options,
        ssl: this.buildSSLConfig(config)
      }
    )
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

  protected buildSSLConfig(config: PostgreSQLConfig): boolean | { cert?: string, key?: string, ca?: string }
  {
    if (!config.ssl || (!config.sslmode && !config.sslcert && !config.sslkey && !config.sslrootcert))
    {
      return false
    }

    const sslConfig: { cert?: string, key?: string, ca?: string } = {}

    if (config.sslcert)
    {
      sslConfig.cert = config.sslcert
    }

    if (config.sslkey)
    {
      sslConfig.key = config.sslkey
    }

    if (config.sslrootcert)
    {
      sslConfig.ca = config.sslrootcert
    }

    if (!sslConfig.cert && !sslConfig.key && !sslConfig.ca)
    {
      return true
    }

    return sslConfig
  }

  protected resolveUsername(config: PostgreSQLConfig): string | undefined
  {
    if (config.username)
    {
      return config.username
    }

    if (config.username_file)
    {
      return this.resolveCredentialFile(config.username_file, "username_file")
    }
    return undefined
  }

  protected resolvePassword(config: PostgreSQLConfig): string | undefined
  {
    if (config.password)
    {
      return config.password
    }

    if (config.password_file)
    {
      return this.resolveCredentialFile(config.password_file, "password_file")
    }
    return undefined
  }

  protected resolveCredentialFile(filePath: string, field: "username_file" | "password_file"): string
  {
    try
    {
      return resolveSecret(filePath)
    }
    catch (error)
    {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new DBConnectionException(`Failed to read PostgreSQL credential file "${field}" from path "${filePath}": ${reason}`)
    }
  }
}

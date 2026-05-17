import type DBDriver from "@/api/database/DBDriver"
import type { PostgreSQLConfig } from "@/api/database/drivers/PostgreSQLConfig"
import DBConnectionException from "@/exceptions/database/DBConnectionException"
import PostgreSQLClient from "@/modules/database/clients/PostgreSQLClient"
import resolveSecret from "@/security/resolveSecret"
import { Pool } from "pg"

export default class PostgreSQLDriver implements DBDriver
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

  public async connect(): Promise<PostgreSQLClient>
  {
    try
    {
      const client = await this.pool.connect()
      return new PostgreSQLClient(client)
    }
    catch (error)
    {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new DBConnectionException(`Failed to connect PostgreSQL client from pool: ${reason}`)
    }
  }

  public async disconnect(): Promise<void>
  {
    try
    {
      await this.pool.end()
    }
    catch (error)
    {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new DBConnectionException(`Failed to disconnect PostgreSQL pool: ${reason}`)
    }
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

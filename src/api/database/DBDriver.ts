import type DBClient from "@/api/database/DBClient"

export default interface DBDriver
{
  connect(): Promise<DBClient>
  disconnect(): Promise<void>
}

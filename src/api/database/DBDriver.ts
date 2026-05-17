import type DBClient from "@/api/database/DBClient"

export default interface DBDriver<Row extends Record<string, unknown>>
{
  connect(): Promise<DBClient<Row>>
  disconnect(): Promise<void>
}

import type DBClient from "@/api/database/DBClient"

export default interface DBDriver<Query>
{
  connect(): Promise<DBClient<Query>>
  disconnect(): Promise<void>
}

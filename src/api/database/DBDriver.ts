import type DBClient from "@/api/database/DBClient"
import type Entity from "@/Entity"

export default interface DBDriver
{
  connect<Row extends Entity>(): Promise<DBClient<Row>>
  disconnect(): Promise<void>
}

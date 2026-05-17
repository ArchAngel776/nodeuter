import type Entity from "@/Entity"
import type Transaction from "@/api/database/Transaction"

export default interface DBClient<Row extends Entity>
{
  release(): Promise<void>
  beginTransaction(): Promise<Transaction>
  create(...rows: readonly Row[]): Promise<void>
  read(): Promise<Row>
  readAll(): Promise<Row[]>
  update(row: Row): Promise<void>
  delete(row: Row): Promise<void>
}

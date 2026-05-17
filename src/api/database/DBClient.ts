import type Entity from "@/Entity"
import type Transaction from "@/api/database/Transaction"

export default interface DBClient
{
  release(): Promise<void>
  beginTransaction(): Promise<Transaction>
  create<Row extends Entity>(...rows: readonly Row[]): Promise<void>
  read<Row extends Entity>(): Promise<Row>
  update<Row extends Entity>(row: Row): Promise<void>
  delete<Row extends Entity>(row: Row): Promise<void>
}

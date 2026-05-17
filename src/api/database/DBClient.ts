import type Transaction from "@/api/database/Transaction"

export default interface DBClient<Row extends Record<string, unknown>>
{
  release(): Promise<void>
  beginTransaction(): Promise<Transaction>
  create(row: Row): Promise<void>
  createBatch(rows: readonly Row[]): Promise<void>
  read(): Promise<Row>
  readAll(): Promise<Row[]>
  update(row: Row): Promise<void>
  delete(row: Row): Promise<void>
}

import type Transaction from "@/api/database/Transaction"

export default interface DBDriver<Row extends Record<string, unknown>>
{
  connect(): Promise<void>
  disconnect(): Promise<void>
  beginTransaction(): Promise<Transaction>
  create(row: Row): Promise<void>
  createBatch(rows: readonly Row[]): Promise<void>
  read(): Promise<Row>
  readAll(): Promise<Row[]>
  update(row: Row): Promise<void>
  delete(row: Row): Promise<void>
}

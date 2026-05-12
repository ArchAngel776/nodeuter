import type Transaction from "@/api/database/Transaction"

export default interface DBDriver<Row>
{
  connect(): Promise<void>
  disconnect(): Promise<void>
  beginTransaction(): Promise<Transaction>
  create(row: Row): Promise<void>
  read(): Promise<Row>
  update(row: Row): Promise<void>
  delete(row: Row): Promise<void>
}

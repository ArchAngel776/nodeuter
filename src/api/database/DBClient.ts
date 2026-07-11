import type Entity from "@/Entity"
import type QueryBuilder from "@/api/database/QueryBuilder"
import type Transaction from "@/api/database/Transaction"

export default interface DBClient<Query>
{
  release(): Promise<void>
  beginTransaction(): Promise<Transaction>
  create(query: QueryBuilder<Query>): Promise<void>
  read<Row extends Entity>(query: QueryBuilder<Query>): AsyncIterable<Row>
  update(query: QueryBuilder<Query>): Promise<void>
  delete(query: QueryBuilder<Query>): Promise<void>
}

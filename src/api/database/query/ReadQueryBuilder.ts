import type QueryBuilder from "@/api/database/QueryBuilder"

export type ConditionBlockReadQueryBuilder<Value = unknown> =
{
  field: string
  operator: symbol
  value: Value
}

export interface ConditionsReadQueryBuilder
{
  where<Value = unknown>(condition: ConditionBlockReadQueryBuilder<Value>): this
  orWhere<Value = unknown>(...conditions: ConditionBlockReadQueryBuilder<Value>[]): this
  orWhere(callback: (conditionsReadQueryBuilder: ConditionsReadQueryBuilder) => ConditionsReadQueryBuilder): this
  andWhere<Value = unknown>(...conditions: ConditionBlockReadQueryBuilder<Value>[]): this
  andWhere(callback: (conditionsReadQueryBuilder: ConditionsReadQueryBuilder) => ConditionsReadQueryBuilder): this
}

export default interface ReadQueryBuilder<Query> extends QueryBuilder<Query>
{
  source(source: string): this
  fields(...fields: string[]): this
  conditions(callback: (conditionsReadQueryBuilder: ConditionsReadQueryBuilder) => ConditionsReadQueryBuilder): this
  offset(offset: number): this
  length(length: number): this
  distinct(distinct: boolean): this
}

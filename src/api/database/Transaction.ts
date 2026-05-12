export default interface Transaction
{
  commit(): Promise<void>
  rollback(): Promise<void>
}

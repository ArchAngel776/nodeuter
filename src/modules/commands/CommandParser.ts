export default abstract class CommandParser<Type>
{
  public abstract parse(value: string): Type
}

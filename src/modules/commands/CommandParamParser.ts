export default abstract class CommandParamParser<Type>
{
  public abstract parse(value: string): Type
}

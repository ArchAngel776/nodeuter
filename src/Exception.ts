export abstract class Exception extends Error
{
  public constructor()
  {
    super()
  }

  public abstract getName(): string
  public abstract getMessage(): string
}

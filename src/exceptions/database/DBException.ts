import { Exception } from "@/Exception"

export default abstract class DBException extends Exception
{
  protected readonly details: string

  public constructor(details: string)
  {
    super()
    this.details = details
  }

  public getMessage(): string
  {
    return this.details
  }
}

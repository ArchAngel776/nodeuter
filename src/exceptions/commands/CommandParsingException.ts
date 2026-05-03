import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"

@Except
export default class CommandParsingException extends Exception
{
  protected readonly details: string

  public constructor(details: string)
  {
    super()
    this.details = details
  }

  public getName(): string
  {
    return "CommandParsingException"
  }

  public getMessage(): string
  {
    return this.details
  }
}

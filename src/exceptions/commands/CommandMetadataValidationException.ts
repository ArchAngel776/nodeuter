import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"

@Except
export default class CommandMetadataValidationException extends Exception
{
  private readonly details: string

  public constructor(details: string)
  {
    super()
    this.details = details
  }

  public getName(): string
  {
    return "CommandMetadataValidationException"
  }

  public getMessage(): string
  {
    return this.details
  }
}

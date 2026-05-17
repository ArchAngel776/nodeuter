import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"

@Except
export default class SecretReadException extends Exception
{
  protected readonly filePath: string
  protected readonly reason: string

  public constructor(filePath: string, reason: string)
  {
    super()
    this.filePath = filePath
    this.reason = reason
  }

  public getName(): string
  {
    return "SecretReadException"
  }

  public getMessage(): string
  {
    return `Secret file at path "${this.filePath}" cannot be read: ${this.reason}`
  }
}

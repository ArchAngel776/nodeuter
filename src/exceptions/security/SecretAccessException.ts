import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"

@Except
export default class SecretAccessException extends Exception
{
  protected readonly filePath: string
  protected readonly errorCode: "EACCES" | "EPERM"

  public constructor(filePath: string, errorCode: "EACCES" | "EPERM")
  {
    super()
    this.filePath = filePath
    this.errorCode = errorCode
  }

  public getName(): string
  {
    return "SecretAccessException"
  }

  public getMessage(): string
  {
    return `Secret file at path "${this.filePath}" cannot be accessed (${this.errorCode})`
  }
}

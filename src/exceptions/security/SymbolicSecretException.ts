import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"

@Except
export default class SymbolicSecretException extends Exception
{
  protected readonly filePath: string

  public constructor(filePath: string)
  {
    super()
    this.filePath = filePath
  }

  public getName(): string
  {
    return "SymbolicSecretException"
  }

  public getMessage(): string
  {
    return `Secret file at path "${this.filePath}" cannot be a symbolic link`
  }
}

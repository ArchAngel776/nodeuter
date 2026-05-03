import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"

@Except
export default class CommandRegisterNotFoundException extends Exception
{
  protected readonly key: string

  public constructor(key: string)
  {
    super()
    this.key = key
  }

  public getName(): string
  {
    return "CommandRegisterNotFoundException"
  }

  public getMessage(): string
  {
    return `Command constructor is not registered under key "${this.key}"`
  }
}

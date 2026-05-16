import { Except } from "@/decorators/class/Except"
import DBException from "@/exceptions/database/DBException"

@Except
export default class DBWriteException extends DBException
{
  public getName(): string
  {
    return "DBWriteException"
  }
}

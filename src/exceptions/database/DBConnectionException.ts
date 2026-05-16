import { Except } from "@/decorators/class/Except"
import DBException from "@/exceptions/database/DBException"

@Except
export default class DBConnectionException extends DBException
{
  public getName(): string
  {
    return "DBConnectionException"
  }
}

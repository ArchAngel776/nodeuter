import { Except } from "@/decorators/class/Except"
import { Exception } from "@/Exception"
import { ALLOWED_SECRET_FILE_MODES } from "@/security/secretFileModes"

@Except
export default class SecretPermissionsException extends Exception
{
  protected readonly filePath: string
  protected readonly currentPermissions: number

  public constructor(filePath: string, currentPermissions: number)
  {
    super()
    this.filePath = filePath
    this.currentPermissions = currentPermissions
  }

  public getName(): string
  {
    return "SecretPermissionsException"
  }

  public getMessage(): string
  {
    const allowedPermissions =
      [
        ...ALLOWED_SECRET_FILE_MODES
      ]
        .map((mode: number): string => mode.toString(8))
        .sort()
        .join(", ")

    return `Secret file at path "${this.filePath}" has unsupported permissions "${this.currentPermissions.toString(8)}". Allowed modes are ${allowedPermissions}`
  }
}

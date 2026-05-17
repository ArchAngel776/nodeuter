import { lstatSync, readFileSync } from "node:fs"
import SecretAccessException from "@/exceptions/security/SecretAccessException"
import SecretNotFoundException from "@/exceptions/security/SecretNotFoundException"
import SecretPermissionsException from "@/exceptions/security/SecretPermissionsException"
import SecretReadException from "@/exceptions/security/SecretReadException"
import SymbolicSecretException from "@/exceptions/security/SymbolicSecretException"
import { ALLOWED_SECRET_FILE_MODES } from "@/security/secretFileModes"

export default function resolveSecret(filePath: string): string
{
  const fileStats = readSecretStats(filePath)

  if (fileStats.isSymbolicLink())
  {
    throw new SymbolicSecretException(filePath)
  }

  const fileMode = fileStats.mode & 0o777

  if (!ALLOWED_SECRET_FILE_MODES.has(fileMode))
  {
    throw new SecretPermissionsException(filePath, fileMode)
  }

  const content = readSecretContent(filePath)
  return content.trimEnd()
}

function readSecretStats(filePath: string)
{
  try
  {
    return lstatSync(filePath)
  }
  catch (error)
  {
    throw mapFileSystemError(filePath, error)
  }
}

function readSecretContent(filePath: string): string
{
  try
  {
    return readFileSync(filePath, "utf8")
  }
  catch (error)
  {
    throw mapFileSystemError(filePath, error)
  }
}

function mapFileSystemError(filePath: string, error: unknown): Error
{
  if (isErrnoException(error))
  {
    if (error.code === "ENOENT")
    {
      return new SecretNotFoundException(filePath)
    }

    if (error.code === "EACCES" || error.code === "EPERM")
    {
      return new SecretAccessException(filePath, error.code)
    }
  }

  const reason = error instanceof Error ? error.message : "Unknown error"
  return new SecretReadException(filePath, reason)
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException
{
  if (!(error instanceof Error))
  {
    return false
  }

  return "code" in error && typeof error.code === "string"
}

type SecretWithFile<
  SecretKey extends string,
  SecretFileKey extends string
> =
  | ({
      [Key in SecretKey]: string
    } & {
      [Key in SecretFileKey]?: string
    })
  | ({
      [Key in SecretKey]?: string
    } & {
      [Key in SecretFileKey]: string
    })

type PostgreSQLCredentials =
  SecretWithFile<"username", "username_file">
  & SecretWithFile<"password", "password_file">

export type PostgreSQLConfig =
{
  host: string
  port?: number
  database: string
  application_name?: string
  connect_timeout?: number
  statement_timeout?: number
  options?: string
  ssl?: boolean
  sslmode?: "disable" | "allow" | "prefer" | "require" | "verify-ca" | "verify-full"
  sslcert?: string
  sslcert_file?: string
  sslkey?: string
  sslkey_file?: string
  sslrootcert?: string
  sslrootcert_file?: string
}
& PostgreSQLCredentials

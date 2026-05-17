export const ALLOWED_SECRET_FILE_MODES: ReadonlySet<number> =
  new Set<number>(
    [
      0o400,
      0o440,
      0o600,
      0o640
    ]
  )

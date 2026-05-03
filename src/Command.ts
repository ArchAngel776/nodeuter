import type CommandParser from "@/modules/commands/CommandParser"
import CommandMetadataValidationException from "@/exceptions/commands/CommandMetadataValidationException"

export type CommandResult = void | Promise<void>

export type CommandParserConstructor<Type> = new () => CommandParser<Type>

export type CommandMetadataBase<Type> =
{
  field: string
  parser: CommandParserConstructor<Type>
}

export type CommandOption<Type> = CommandMetadataBase<Type> &
{
  kind: "option"
  flag: string
}

export type CommandArgument<Type> = CommandMetadataBase<Type> &
{
  kind: "argument"
  index: number
}

export type CommandMetadata = CommandOption<unknown> | CommandArgument<unknown>

export type CommandMetadataCollection = readonly CommandMetadata[]

const COMMAND_METADATA = Symbol("command:metadata")

export default abstract class Command
{
  public static [COMMAND_METADATA]: CommandMetadataCollection = []

  public abstract execute(): CommandResult

  public static setCommandMetadata(metadata: CommandMetadataCollection): void
  {
    saveCommandMetadata(this, metadata)
  }

  public static addCommandMetadata(...entries: CommandMetadata[]): void
  {
    const nextMetadata =
    [
      ...readCommandMetadata(this),
      ...entries
    ]

    saveCommandMetadata(this, nextMetadata)
  }

  public static getCommandMetadata(): CommandMetadataCollection
  {
    return readCommandMetadata(this)
  }

  public static clearCommandMetadata(): void
  {
    resetCommandMetadata(this)
  }
}

function validateCommandMetadata(metadata: CommandMetadataCollection): void
{
  const fields = new Set<string>()
  const flags = new Set<string>()
  const argumentIndexes = new Set<number>()

  for (const entry of metadata)
  {
    if (fields.has(entry.field))
    {
      throw new CommandMetadataValidationException(
        `Duplicated metadata field: "${entry.field}"`
      )
    }

    fields.add(entry.field)

    if (entry.kind === "option")
    {
      if (flags.has(entry.flag))
      {
        throw new CommandMetadataValidationException(
          `Duplicated option flag: "${entry.flag}"`
        )
      }

      flags.add(entry.flag)

      continue
    }

    if (argumentIndexes.has(entry.index))
    {
      throw new CommandMetadataValidationException(
        `Duplicated argument index: ${entry.index}`
      )
    }

    argumentIndexes.add(entry.index)
  }
}

function readCommandMetadata(target: typeof Command): CommandMetadataCollection
{
  if (Object.prototype.hasOwnProperty.call(target, COMMAND_METADATA) === false)
  {
    return []
  }

  return target[COMMAND_METADATA]
}

function saveCommandMetadata(
  target: typeof Command,
  metadata: CommandMetadataCollection
): void
{
  validateCommandMetadata(metadata)
  target[COMMAND_METADATA] = [...metadata]
}

function resetCommandMetadata(target: typeof Command): void
{
  Reflect.deleteProperty(target, COMMAND_METADATA)
}

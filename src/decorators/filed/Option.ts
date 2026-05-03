import Command, {
  type CommandMetadata,
  type CommandOption,
  type CommandParserConstructor
} from "@/Command"
import CommandMetadataValidationException from "@/exceptions/commands/CommandMetadataValidationException"

type CommandFieldContext<This extends Command, Type> =
  ClassFieldDecoratorContext<This, Type>

export function Option<Type>(
  flag: string,
  parser: CommandParserConstructor<Type>
): <This extends Command>(
  value: undefined,
  context: CommandFieldContext<This, Type>
) => void
{
  return <This extends Command>(
    _value: undefined,
    context: CommandFieldContext<This, Type>
  ): void =>
  {
    const field = validateCommandFieldContext(context)

    context.addInitializer(function addOptionMetadata(this: This): void
    {
      const target = getCommandTarget(this)
      const metadata: CommandOption<Type> =
      {
        kind: "option",
        field,
        flag,
        parser
      }

      registerMetadata(target, metadata)
    })
  }
}

function validateCommandFieldContext<This extends Command, Type>(
  context: CommandFieldContext<This, Type>
): string
{
  if (context.static)
  {
    throw new CommandMetadataValidationException(
      "Option decorator cannot target static fields"
    )
  }

  return resolveFieldName(context.name)
}

function getCommandTarget(instance: Command): typeof Command
{
  const constructor = instance.constructor

  if (isCommandTarget(constructor) === false)
  {
    throw new CommandMetadataValidationException(
      "Option decorator can be used only on Command subclasses"
    )
  }

  return constructor
}

function isCommandTarget(value: unknown): value is typeof Command
{
  if (typeof value !== "function")
  {
    return false
  }

  return Command.prototype.isPrototypeOf(value.prototype)
}

function resolveFieldName(name: string | symbol): string
{
  if (typeof name === "string")
  {
    return name
  }

  throw new CommandMetadataValidationException(
    "Option decorator supports only string field names"
  )
}

function registerMetadata(
  target: typeof Command,
  metadata: CommandMetadata
): void
{
  const alreadyRegistered = target
    .getCommandMetadata()
    .some((entry) => entry.field === metadata.field)

  if (alreadyRegistered)
  {
    return
  }

  target.addCommandMetadata(metadata)
}

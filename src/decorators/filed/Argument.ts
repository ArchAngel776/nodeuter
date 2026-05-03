import Command, {
  type CommandArgument,
  type CommandMetadata,
  type CommandParserConstructor
} from "@/Command"
import CommandMetadataValidationException from "@/exceptions/commands/CommandMetadataValidationException"

type CommandFieldContext<This extends Command, Type> =
  ClassFieldDecoratorContext<This, Type>

export function Argument<Type>(
  index: number,
  parser: CommandParserConstructor<Type>
): <This extends Command>(
  value: undefined,
  context: CommandFieldContext<This, Type>
) => void
{
  if (Number.isInteger(index) === false || index < 0)
  {
    throw new CommandMetadataValidationException(
      "Argument decorator requires a non-negative integer index"
    )
  }

  return <This extends Command>(
    _value: undefined,
    context: CommandFieldContext<This, Type>
  ): void =>
  {
    const field = validateCommandFieldContext(context)

    context.addInitializer(function addArgumentMetadata(this: This): void
    {
      const target = getCommandTarget(this)
      const metadata: CommandArgument<Type> =
      {
        kind: "argument",
        field,
        index,
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
      "Argument decorator cannot target static fields"
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
      "Argument decorator can be used only on Command subclasses"
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
    "Argument decorator supports only string field names"
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

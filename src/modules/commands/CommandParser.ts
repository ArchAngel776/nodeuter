import Command, { type CommandMetadataCollection } from "@/Command"
import CommandParsingException from "@/exceptions/commands/CommandParsingException"

type CommandMetadataReader = Pick<typeof Command, "getCommandMetadata">

export type CommandConstructor<CommandType extends Command> =
  (new (params: any, ...args: any[]) => CommandType) & CommandMetadataReader

export type CommandParams<Constructor extends CommandConstructor<Command>> =
  ConstructorParameters<Constructor> extends [infer Params, ...unknown[]]
    ? Params
    : never

type ParsedCommandChain =
{
  options: Map<string, string>
  arguments: string[]
}

export default class CommandParser<
  CommandType extends Command,
  Constructor extends CommandConstructor<CommandType> = CommandConstructor<CommandType>
>
{
  protected readonly commandConstructor: Constructor
  protected readonly chain: readonly string[]

  public constructor(
    commandConstructor: Constructor,
    chain: readonly string[]
  )
  {
    this.commandConstructor = commandConstructor
    this.chain = chain
  }

  public parse(): CommandParams<Constructor>
  {
    const commandChain = this.parseCommandChain()
    const metadata = this.commandConstructor.getCommandMetadata()
    const parsedParams = this.parseMetadata(metadata, commandChain)

    return parsedParams as CommandParams<Constructor>
  }

  protected parseCommandChain(): ParsedCommandChain
  {
    const options = new Map<string, string>()
    const argumentTokens: string[] = []
    let hasArguments = false

    for (let index = 0; index < this.chain.length; index += 1)
    {
      const token = this.chain[index]

      if (token === undefined)
      {
        continue
      }

      if (hasArguments)
      {
        if (token.startsWith("--"))
        {
          throw new CommandParsingException(
            "Options must appear before positional arguments"
          )
        }

        argumentTokens.push(token)

        continue
      }

      if (token.startsWith("--"))
      {
        const nextToken = this.chain[index + 1]

        if (nextToken === undefined || nextToken.startsWith("--"))
        {
          throw new CommandParsingException(
            `Option "${token}" requires a value`
          )
        }

        options.set(token, nextToken)
        index += 1

        continue
      }

      hasArguments = true
      argumentTokens.push(token)
    }

    return {
      options,
      arguments: argumentTokens
    }
  }

  protected parseMetadata(
    metadata: CommandMetadataCollection,
    commandChain: ParsedCommandChain
  ): Record<string, unknown>
  {
    const parsedParams: Record<string, unknown> = {}

    for (const entry of metadata)
    {
      if (entry.kind === "option")
      {
        const rawValue = commandChain.options.get(entry.flag)

        if (rawValue === undefined)
        {
          continue
        }

        const parser = new entry.parser()

        parsedParams[entry.field] = parser.parse(rawValue)

        continue
      }

      const rawValue = commandChain.arguments[entry.index]

      if (rawValue === undefined)
      {
        continue
      }

      const parser = new entry.parser()

      parsedParams[entry.field] = parser.parse(rawValue)
    }

    return parsedParams
  }
}

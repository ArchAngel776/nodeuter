import assert from "node:assert/strict"
import test from "node:test"

import
{
  Argument,
  Command,
  CommandParser,
  Option
} from "../../dist/index"

class NumberParser extends CommandParser<number>
{
  public parse(value: string): number
  {
    return Number(value)
  }
}

class EchoCommand extends Command
{
  @Option("--limit", NumberParser)
  public readonly limit!: number

  @Argument(0, NumberParser)
  public readonly first!: number

  public execute(): void
  {
    return
  }
}

class HiddenFieldsCommand extends Command
{
  @Option("--secret", NumberParser)
  private readonly secret!: number

  @Argument(1, NumberParser)
  protected readonly offset!: number

  public execute(): void
  {
    return
  }
}

interface ConstructorParams
{
  limit: number
  first: number
}

class ConstructorBoundCommand extends Command implements ConstructorParams
{
  @Option("--limit", NumberParser)
  public readonly limit: number

  @Argument(0, NumberParser)
  public readonly first: number

  public constructor({ limit, first }: ConstructorParams)
  {
    super()
    this.limit = limit
    this.first = first
  }

  public execute(): void
  {
    return
  }
}

test("Option and Argument register command metadata only once per field", () =>
{
  EchoCommand.clearCommandMetadata()

  const firstInstance = new EchoCommand()
  const firstMetadata = EchoCommand.getCommandMetadata()

  assert.ok(firstInstance instanceof EchoCommand)
  assert.equal(firstMetadata.length, 2)
  assert.deepEqual(firstMetadata[0], {
    kind: "option",
    field: "limit",
    flag: "--limit",
    parser: NumberParser
  })
  assert.deepEqual(firstMetadata[1], {
    kind: "argument",
    field: "first",
    index: 0,
    parser: NumberParser
  })

  const secondInstance = new EchoCommand()
  const secondMetadata = EchoCommand.getCommandMetadata()

  assert.ok(secondInstance instanceof EchoCommand)
  assert.equal(secondMetadata.length, 2)
})

test("Option and Argument support private and protected fields", () =>
{
  HiddenFieldsCommand.clearCommandMetadata()

  const instance = new HiddenFieldsCommand()
  const metadata = HiddenFieldsCommand.getCommandMetadata()

  assert.ok(instance instanceof HiddenFieldsCommand)
  assert.equal(metadata.length, 2)
  assert.equal(metadata[0].kind, "option")
  assert.equal(metadata[1].kind, "argument")
})

test("Command can assign interface-based constructor params to decorated fields", () =>
{
  ConstructorBoundCommand.clearCommandMetadata()

  const params: ConstructorParams =
  {
    limit: 25,
    first: 4
  }
  const command = new ConstructorBoundCommand(params)
  const metadata = ConstructorBoundCommand.getCommandMetadata()

  assert.equal(command.limit, 25)
  assert.equal(command.first, 4)
  assert.equal(metadata.length, 2)
})

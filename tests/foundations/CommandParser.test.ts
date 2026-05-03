import assert from "node:assert/strict"
import test from "node:test"

import
{
  Argument,
  Command,
  CommandParamParser,
  CommandParsingException,
  CommandParser,
  Option
} from "../../dist/index"

class NumberParamParser extends CommandParamParser<number>
{
  public parse(value: string): number
  {
    return Number(value)
  }
}

interface ParseDemoParams
{
  limit: number
  count: number
}

class ParseDemoCommand extends Command
{
  @Option("--limit", NumberParamParser)
  protected readonly limit: number

  @Argument(0, NumberParamParser)
  protected readonly count: number

  public constructor({ limit, count }: ParseDemoParams)
  {
    super()
    this.limit = limit
    this.count = count
  }

  public execute(): void
  {
    return
  }
}

test("CommandParser parses option-value pairs and trailing arguments", () =>
{
  ParseDemoCommand.clearCommandMetadata()
  new ParseDemoCommand({ limit: 0, count: 0 })

  const parser = new CommandParser(
    ParseDemoCommand,
    ["--limit", "25", "7"]
  )
  const parsed = parser.parse()

  assert.equal(parsed.limit, 25)
  assert.equal(parsed.count, 7)
})

test("CommandParser rejects options after positional arguments", () =>
{
  ParseDemoCommand.clearCommandMetadata()
  new ParseDemoCommand({ limit: 0, count: 0 })

  const parser = new CommandParser(
    ParseDemoCommand,
    ["7", "--limit", "25"]
  )

  assert.throws(
    () => parser.parse(),
    (error: unknown): boolean =>
    {
      assert.ok(error instanceof CommandParsingException)
      assert.match(
        error.message,
        /Options must appear before positional arguments/
      )

      return true
    }
  )
})

test("CommandParser requires value for each option token", () =>
{
  ParseDemoCommand.clearCommandMetadata()
  new ParseDemoCommand({ limit: 0, count: 0 })

  const parser = new CommandParser(
    ParseDemoCommand,
    ["--limit"]
  )

  assert.throws(
    () => parser.parse(),
    (error: unknown): boolean =>
    {
      assert.ok(error instanceof CommandParsingException)
      assert.match(error.message, /Option "--limit" requires a value/)

      return true
    }
  )
})

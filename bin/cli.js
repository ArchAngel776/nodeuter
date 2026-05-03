#!/usr/bin/env node
"use strict"

const
{
  CommandBootstrap,
  CommandParser,
  CommandRegister,
  CommandRegisterNotFoundException,
  CommandParsingException
} = require("../dist")

async function main()
{
  const [commandKey, ...chain] = process.argv.slice(2)

  if (commandKey === undefined)
  {
    console.error("Missing command key. Usage: nodeuter <command> [...args]")
    process.exitCode = 1

    return
  }

  const bootstrap = new CommandBootstrap()

  bootstrap.run()

  const register = CommandRegister.getInstance()

  try
  {
    const commandConstructor = register.get(commandKey)
    const parser = new CommandParser(commandConstructor, chain)
    const params = parser.parse()
    const command = new commandConstructor(params)

    await Promise.resolve(command.execute())
  }
  catch (error)
  {
    if (
      error instanceof CommandRegisterNotFoundException
      || error instanceof CommandParsingException
    )
    {
      console.error(error.message)
      process.exitCode = 1

      return
    }

    throw error
  }
}

main().catch((error) =>
{
  const message = error instanceof Error ? error.stack ?? error.message : String(error)

  console.error(message)
  process.exitCode = 1
})

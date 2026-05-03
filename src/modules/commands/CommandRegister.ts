import Command from "@/Command"
import CommandRegisterNotFoundException from "@/exceptions/commands/CommandRegisterNotFoundException"

export type RegisteredCommandConstructor =
  (new (params: any, ...args: any[]) => Command)
  & Pick<typeof Command, "getCommandMetadata">

export default class CommandRegister
{
  protected static instance: CommandRegister | null = null

  protected readonly commands: Map<string, RegisteredCommandConstructor>

  protected constructor()
  {
    this.commands = new Map<string, RegisteredCommandConstructor>()
  }

  public static getInstance(): CommandRegister
  {
    if (this.instance === null)
    {
      this.instance = new CommandRegister()
    }

    return this.instance
  }

  public register(
    key: string,
    commandConstructor: RegisteredCommandConstructor
  ): void
  {
    this.commands.set(key, commandConstructor)
  }

  public get(key: string): RegisteredCommandConstructor
  {
    const commandConstructor = this.commands.get(key)

    if (commandConstructor === undefined)
    {
      throw new CommandRegisterNotFoundException(key)
    }

    return commandConstructor
  }
}

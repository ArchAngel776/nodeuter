import CommandRegister from "@/modules/commands/CommandRegister"

export type CommandBootstrapHook = (register: CommandRegister) => void

export default class CommandBootstrap
{
  protected readonly register: CommandRegister
  protected readonly hooks: CommandBootstrapHook[]

  public constructor()
  {
    this.register = CommandRegister.getInstance()
    this.hooks = []
  }

  public addHook(hook: CommandBootstrapHook): this
  {
    this.hooks.push(hook)

    return this
  }

  public run(): void
  {
    this.registerSystemCommands()

    for (const hook of this.hooks)
    {
      hook(this.register)
    }
  }

  protected registerSystemCommands(): void
  {
    return
  }
}

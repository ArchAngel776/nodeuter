import assert from "node:assert/strict"
import test from "node:test"

import
{
  CommandBootstrap,
  CommandRegister,
  type CommandBootstrapHook
} from "../../dist/index"

test("CommandBootstrap invokes hooks with singleton CommandRegister", () =>
{
  const register = CommandRegister.getInstance()
  const calls: string[] = []

  const firstHook: CommandBootstrapHook = (hookRegister): void =>
  {
    calls.push("first")
    assert.equal(hookRegister, register)
  }
  const secondHook: CommandBootstrapHook = (hookRegister): void =>
  {
    calls.push("second")
    assert.equal(hookRegister, register)
  }
  const bootstrap = new CommandBootstrap()
    .addHook(firstHook)
    .addHook(secondHook)

  bootstrap.run()

  assert.deepEqual(calls, ["first", "second"])
})

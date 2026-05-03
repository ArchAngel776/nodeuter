import assert from "node:assert/strict"
import test from "node:test"

import
{
  Command,
  CommandRegister,
  CommandRegisterNotFoundException
} from "../../dist/index"

class RegisterDemoCommand extends Command
{
  public execute(): void
  {
    return
  }
}

let keyCounter = 0

function createKey(prefix: string): string
{
  keyCounter += 1

  return `${prefix}-${keyCounter}`
}

test("CommandRegister is a singleton", () =>
{
  const first = CommandRegister.getInstance()
  const second = CommandRegister.getInstance()

  assert.equal(first, second)
})

test("CommandRegister stores and resolves command constructors", () =>
{
  const register = CommandRegister.getInstance()
  const key = createKey("register-demo")

  register.register(key, RegisterDemoCommand)

  const resolved = register.get(key)

  assert.equal(resolved, RegisterDemoCommand)
})

test("CommandRegister throws custom exception for unknown keys", () =>
{
  const register = CommandRegister.getInstance()
  const key = createKey("missing-command")

  assert.throws(
    () => register.get(key),
    (error: unknown): boolean =>
    {
      assert.ok(error instanceof CommandRegisterNotFoundException)
      assert.match(
        error.message,
        /Command constructor is not registered under key/
      )

      return true
    }
  )
})

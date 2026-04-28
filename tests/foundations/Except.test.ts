import assert from "node:assert/strict"
import test from "node:test"

import { Except, Exception } from "../../src/index"

type RuntimeDetails = {
  operation: string
  reason: string
}

@Except
class RuntimeException extends Exception
{
  private readonly details: RuntimeDetails

  public constructor(details: RuntimeDetails)
  {
    super()
    this.details = details
  }

  public getName(): string
  {
    return "RuntimeException"
  }

  public getMessage(): string
  {
    return `Operation "${this.details.operation}" failed: ${this.details.reason}`
  }
}

test("Except maps getName/getMessage onto Error fields", () =>
{
  const details: RuntimeDetails =
  {
    operation: "bootstrap",
    reason: "configuration is missing"
  }

  try
  {
    throw new RuntimeException(details)
  }
  catch (error: unknown)
  {
    assert.ok(error instanceof RuntimeException)
    assert.equal(error.name, "RuntimeException")
    assert.equal(
      error.message,
      'Operation "bootstrap" failed: configuration is missing'
    )

    const printed = String(error)

    assert.equal(
      printed,
      'RuntimeException: Operation "bootstrap" failed: configuration is missing'
    )
  }
})

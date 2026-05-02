import test from "node:test"
import assert from "node:assert/strict"

import
{
  ClassMethod,
  ClassMethodDecorator,
  type ClassMethodContext
} from "../../dist/index"

type DemoArguments = [a: number, b: number]
type DecoratorParams = { multiplier: number }

class SumWithMultiplierDecorator extends ClassMethodDecorator<
  DemoService,
  DemoArguments,
  number,
  DecoratorParams
>
{
  public method<Decorator extends ClassMethodDecorator<
    DemoService,
    DemoArguments,
    number,
    DecoratorParams
  >>(
    this: DemoService,
    context: ClassMethodContext<DemoArguments, number, Decorator>,
    ...args: DemoArguments
  ): number
  {
    const originalValue = context.method(...args)

    assert.equal(typeof originalValue, "number")
    assert.ok(context.decorator instanceof SumWithMultiplierDecorator)
    assert.equal(context.decorator.params.multiplier, 3)

    return originalValue * context.decorator.params.multiplier
  }
}

class DemoService
{
  private readonly base: number
  public calls: number

  public constructor()
  {
    this.base = 10
    this.calls = 0
  }

  @ClassMethod<
    DemoService,
    DemoArguments,
    number,
    DecoratorParams,
    SumWithMultiplierDecorator
  >(
    SumWithMultiplierDecorator,
    {
      multiplier: 3
    }
  )
  public sum(a: number, b: number): number
  {
    this.calls += 1

    return this.base + a + b
  }
}

test("ClassMethod decorates method and preserves binding/context contract", () =>
{
  const service = new DemoService()
  const originalMethod = service.sum
  const result = service.sum(4, 6)

  assert.notEqual(typeof originalMethod, "undefined")
  assert.equal(service.calls, 1)
  assert.equal(result, 60)
})

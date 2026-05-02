export type ClassMethodContext<
  Arguments extends unknown[],
  Return,
  Decorator
> =
{
  method: (...args: Arguments) => Return
  decorator: Decorator
}

export abstract class ClassMethodDecorator<
  Target,
  Arguments extends unknown[],
  Return,
  Params extends object = {}
>
{
  protected readonly params: Params

  public constructor(params: Params)
  {
    this.params = params
  }

  public abstract method<
    Decorator extends ClassMethodDecorator<Target, Arguments, Return, Params>
  >(
    this: Target,
    context: ClassMethodContext<Arguments, Return, Decorator>,
    ...args: Arguments
  ): Return
}

export type ClassMethodDecoratorConstructor<
  Target,
  Arguments extends unknown[],
  Return,
  Params extends object,
  Decorator extends ClassMethodDecorator<Target, Arguments, Return, Params>
> = new (params: Params) => Decorator

export function ClassMethod<
  Target,
  Arguments extends unknown[],
  Return,
  Params extends object,
  Decorator extends ClassMethodDecorator<Target, Arguments, Return, Params>
>(
  DecoratorConstructor: ClassMethodDecoratorConstructor<
    Target,
    Arguments,
    Return,
    Params,
    Decorator
  >,
  params?: Params
): (
  originalMethod: (this: Target, ...args: Arguments) => Return
) => (this: Target, ...args: Arguments) => Return
{
  return (originalMethod) =>
  {
    return function methodDecorator(this: Target, ...args: Arguments): Return
    {
      const decoratorParams: Params = params ?? ({} as Params)
      const decorator = new DecoratorConstructor(decoratorParams)
      const method = (...methodArgs: Arguments): Return =>
      {
        return originalMethod.call(this, ...methodArgs)
      }

      const boundDecoratorMethod = (
        context: ClassMethodContext<Arguments, Return, Decorator>,
        ...methodArgs: Arguments
      ): Return =>
      {
        return decorator.method.call(this, context, ...methodArgs)
      }

      return boundDecoratorMethod(
        {
          method,
          decorator
        },
        ...args
      )
    }
  }
}

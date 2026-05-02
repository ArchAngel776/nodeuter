import { Exception } from "@/Exception"

type ExceptionInstance = Exception &
{
  getName(): string
  getMessage(): string
}

type ExceptionConstructor = new (...args: any[]) => ExceptionInstance

export function Except<
  Constructor extends ExceptionConstructor
>(TargetConstructor: Constructor): Constructor
{
  return class extends TargetConstructor
  {
    public constructor(...args: any[])
    {
      super(...args)

      this.name = this.getName()
      this.message = this.getMessage()
    }
  } as Constructor
}

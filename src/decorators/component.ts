const componentMetadata = Symbol.for("nodeuter.component");

export type ComponentConstructor = abstract new (...args: never[]) => unknown;

export function component(
  target: ComponentConstructor,
  context: ClassDecoratorContext<ComponentConstructor>
): void {
  if (context.kind !== "class") {
    throw new TypeError("@component can only decorate classes");
  }

  Object.defineProperty(target, componentMetadata, {
    value: context.name ?? target.name,
    enumerable: false
  });
}

export function getComponentName(target: ComponentConstructor): string | undefined {
  return Reflect.get(target, componentMetadata) as string | undefined;
}

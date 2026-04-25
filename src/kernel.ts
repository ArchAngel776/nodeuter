import { component, getComponentName } from "@/decorators/component";

@component
export class Kernel {
  start(): string {
    const componentName = getComponentName(Kernel) ?? "Kernel";

    return `${componentName} initialized`;
  }
}

export function createKernel(): Kernel {
  return new Kernel();
}

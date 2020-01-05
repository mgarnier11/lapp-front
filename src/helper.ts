export class Helper {
  public static clone<T>(instance: T, newProps?: Partial<T>): T {
    return Object.assign(Object.create(instance as any), instance, newProps);
  }
}

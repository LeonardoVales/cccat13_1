export default class Registry {
  dependencies: { [name: string]: any }
  static instance: Registry

  private constructor() {
    this.dependencies = {}
  }

  privide(name: string, dependency: any) {
    this.dependencies[name] = dependency
  }

  inject(name: string) {
    return this.dependencies[name]
  }

  static getInstance() {
    if (!Registry.instance) {
      Registry.instance = new Registry()
    }

    return Registry.instance
  }
}
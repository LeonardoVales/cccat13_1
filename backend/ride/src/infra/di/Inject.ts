import Registry from "./Registry"


//target é a classe que eu estou "decorando", que no caso é o MainController
export default function inject(name: string) {
  return (target: any, propertyKey: string) => {
    target[propertyKey] = new Proxy({}, {
      get(target: any, propertyKey: string, receiver: any) {
        const dependency = Registry.getInstance().inject(name)
        return dependency[propertyKey]
      }
    })
  }
}
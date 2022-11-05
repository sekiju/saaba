import { MetadataKeys } from './metadata.keys'

export enum Methods {
	GET = 'get',
	POST = 'post',
	DELETE = 'delete',
	PUT = 'put',
	PATCH = 'patch',
	OPTIONS = 'options',
	HEAD = 'head',
	ALL = 'all',
}

export interface IRouter {
	method: Methods
	path: string
	handlerName: string | symbol
}

const methodDecoratorFactory = (method: Methods) => {
	return (path?: string): MethodDecorator => {
		return (target, propertyKey, descriptor: PropertyDescriptor) => {
			const original = descriptor.value

			const controllerClass = target.constructor
			const routers: IRouter[] = Reflect.hasMetadata(MetadataKeys.ROUTERS, controllerClass) ?
				Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass) : []

			routers.push({
				method,
				path: path || '',
				handlerName: propertyKey,
			})

			Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass)

			descriptor.value = (...args: any[]) => {
				return original.apply(this, args)
			}
		}
	}
}

export const Get = methodDecoratorFactory(Methods.GET)
export const Post = methodDecoratorFactory(Methods.POST)
export const Delete = methodDecoratorFactory(Methods.DELETE)
export const Put = methodDecoratorFactory(Methods.PUT)
export const Patch = methodDecoratorFactory(Methods.PATCH)
export const Options = methodDecoratorFactory(Methods.OPTIONS)
export const Head = methodDecoratorFactory(Methods.HEAD)
export const All = methodDecoratorFactory(Methods.ALL)

import Koa from 'koa'
import body, { KoaBodyMiddlewareOptions } from 'koa-body'
import json from 'koa-json'
import Router  from 'koa-router'
import { ILogger, Logger } from './utils/logger'
import { container } from './container'
import { join } from 'path'
import fetchFiles from './utils/fetchFiles'
import { IRouter, MetadataKeys } from './decorators'
import { isConstructor } from './utils/resolvers'
import { throwErrorFunction, useErrorMiddleware } from '../middlewares/error'
import Err from './structures/error'

interface KoaOptions {
	env?: string | undefined,
	keys?: string[] | undefined,
	proxy?: boolean | undefined,
	subdomainOffset?: number | undefined,
	proxyIpHeader?: string | undefined,
	maxIpsCount?: number | undefined,
}

export interface SaabaApplicationOptions extends KoaOptions {
	/**
	 * The base directory of project
	 * @default null
	 */
	baseUserDirectory?: string

	/**
	 * Server API endpoint
	 * @default null
	 */
	endpoint?: string

	/**
	 * The logger to be used by the framework. By default, a {@link Logger} instance is used, which emits the
	 * messages to the console.
	 */
	logger: ILogger

	/**
	 * Log level
	 * @default "debug"
	 */
	logLevel?: string

	/**
	* [koa-body]{@link https://www.npmjs.com/package/koa-body} middleware options
    * @default undefiend
	*/
	bodyMiddlewareOptions?: KoaBodyMiddlewareOptions
}

export default class SaabaApplication extends Koa {
	endpoint: string

	constructor(options?: SaabaApplicationOptions) {
		super(options)

		container.application = this
		container.logger = options?.logger ?? Logger
		container.logger.level = options?.logLevel ?? 'debug'

		this.endpoint = options?.endpoint ?? ''

		this.context.throwError = throwErrorFunction

		this.use(json())
		this.use(body(options?.bodyMiddlewareOptions))

		this.registerMiddlewares()
		this.registerRouters(options?.baseUserDirectory ?? require.main?.path as string)
	}

	private async registerRouters(baseDirectoryPath: string) {
		const paths = await fetchFiles(join(baseDirectoryPath, 'routers'))
		for (const path of paths) {
			const { default: controller } = await import(path)
			if (!isConstructor(controller)) {
				container.logger.error(`Invalid router file on ${path} path. Export default class with Router @decorator.`)
				continue
			}

			const instance = new controller()

			const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controller)
			const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controller)

			routers.forEach(({ method, path, handlerName }) => {
				const router = new Router()
				router[method]((this.endpoint + basePath + path), instance[String(handlerName)].bind(instance))
				this.use(router.routes())
				container.logger.info(`New router ${basePath + path} registered.`)
			})
		}
	}

	private registerMiddlewares() {
		this.use(async (ctx, next) => {
			await next()
			const rt = ctx.response.get('X-Response-Time')
			Logger.debug(`${ctx.method} ${ctx.url} - ${rt}`)
		})

		this.use(async (ctx, next) => {
			const start = Date.now()
			await next()
			const ms = Date.now() - start
			ctx.set('X-Response-Time', `${ms}ms`)
		})

		this.on('error', useErrorMiddleware)
	}
}

declare module 'koa' {
	interface ExtendableContext extends Koa.BaseContext {
		throwError(error: Err): unknown
	}
}

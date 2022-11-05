import { Context } from 'koa'
import { RouterContext } from 'koa-router'
import { validate } from 'class-validator'
import Err from '../structures/error'

/**
 * Query validator used for validating ctx.request.query data
 * @param {any} validatorClass - Class with [class-validator]{@link https://www.npmjs.com/package/class-validator} decorators
 */
export const QueryValidator = (validatorClass: any): MethodDecorator => {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		const original = descriptor.value
		descriptor.value = (...args: any[]) => {
			const ctx: Context | RouterContext = args[0]
			const query = ctx.request.query

			const validator = new validatorClass() as any

			Object.keys(query).forEach(key => {
				validator[key] = query[key]
			})

			return validate(validator).then(errors => {
				if (errors.length > 0) {
					const list = errors.map((error) => Object.values(error.constraints as any).join('; ')).join('; ')
					return ctx.throwError(Err.BadRequest(list))
				}

				ctx.request.query = validator
				return original.apply(this, args)
			})
		}
	}
}

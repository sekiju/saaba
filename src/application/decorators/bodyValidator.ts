import { Context } from 'koa'
import { RouterContext } from 'koa-router'
import { validate } from 'class-validator'
import Err from '../structures/error'

/**
 * Body validator used for validating ctx.request.body data
 * @param {any} validatorClass - Class with [class-validator]{@link https://www.npmjs.com/package/class-validator} decorators
*/
export const BodyValidator = (validatorClass: any): MethodDecorator => {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		const original = descriptor.value
		descriptor.value = (...args: any[]) => {
			const ctx: Context | RouterContext = args[0]
			const body = ctx.request.body

			const validator = new validatorClass() as any

			Object.keys(body).forEach(key => {
				validator[key] = body[key]
			})

			return validate(validator).then(errors => {
				if (errors.length > 0) {
					const list = errors.map((error) => Object.values(error.constraints as any).join('; ')).join('; ')
					return ctx.throwError(Err.BadRequest(list))
				}

				ctx.request.body = validator
				return original.apply(this, args)
			})
		}
	}
}

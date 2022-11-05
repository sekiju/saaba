import { container } from '../application/container'
import Koa from 'koa'
import Err from '../application/structures/error'

export const useErrorMiddleware = (err: Err) => {
	return err.status > 500 ? container.logger.error(err) : container.logger.debug(err)
}

export const throwErrorFunction = function (this: Koa.BaseContext & Koa.DefaultContext, err: Err) {
	this.type = 'json'
	this.status = err.status
	this.body = { error: { status: err.status, message: err.message, details: err.details } }
	return this.app.emit('error', err, this)
}

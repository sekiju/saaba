
export interface IErr {
	status: number
	message: string
	details?: string | string[]
}

/**
 * Custom error class
 * @constructor
 * @param {number} status - Status code
 * @param {string} message - Short message on error throwing
 * @param {string | string[] | null} details - Optional string or array of strings contains detailed information of error
 * */
export default class Err implements IErr {
	status: number
	message: string
	details?: string | string[]

	constructor(status: number, message: string, details?: string | string[]) {
		this.status = status
		this.message = message
		this.details = details
	}

	static BadRequest = (details?: string | string[]) => new this(400, "Bad Request", details)
	static Unauthorized = (details?: string | string[]) => new this(401, "Unauthorized", details)
	static Forbidden = (details?: string | string[]) => new this(403, "You don't have permission for this action", details)
	static NotFound = (details?: string | string[]) => new this(404, "Not Found Error", details)
	static Conflict = (details?: string | string[]) => new this(409, "Conflict", details)
	static ImTeapot = (details?: string | string[]) => new this(418, "I'm a teapot", details)
	static TooManyRequests = (details?: string | string[]) => new this(419, "Too Many Requests", details)

	static Internal = (details?: string | string[]) => new this(500, "Internal Server Error", details)
	static BadGateway = (details?: string | string[]) => new this(502, "Bad Gateway", details)
}

import { createLogger, format, transports, addColors, Logger as ILogger } from 'winston'

addColors({
	info: 'cyan',
})

const consoleFormat = format.printf( ({ level, message, timestamp, ...metadata}) => {
	let msg = `[${level}] [1m[90m${new Date(timestamp).toTimeString().split(' ')[0]}[39m[22m ${message} `
	if (metadata && metadata.lenght > 0)
		msg += JSON.stringify(metadata)
	return msg
})

const Logger = createLogger({
	level: 'debug',
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		verbose: 4,
		debug: 5,
		silly: 6,
	},
	format: format.combine(
		format(info => {
			info.level = info.level.toUpperCase()
			return info
		})(),
		format.splat(),
		format.timestamp(),
	),
	transports: [ new transports.Console({ format: format.combine(format.colorize(), consoleFormat) }) ],
})

export { Logger, ILogger }

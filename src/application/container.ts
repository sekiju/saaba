import { ILogger } from './utils/logger'
import SaabaApplication from './client'

interface Container {
	application: SaabaApplication
	logger: ILogger
}

export const container: Container = {
	application: {} as SaabaApplication,
	logger: {} as ILogger,
}

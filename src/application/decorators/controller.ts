import { MetadataKeys } from './metadata.keys'

/**
 *
 * @param {string} basePath - Controller base path
 */
export const Controller = (basePath?: string): ClassDecorator => {
	return (target) => {
		Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath || '', target)
	}
}

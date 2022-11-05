import { resolve } from 'path'
import { readdirSync } from 'fs'

const fetchFiles = async (dir: string) => {
	const dirents = readdirSync(dir, {withFileTypes: true})
	const files: any = await Promise.all(dirents.map((dirent) => {
		const res = resolve(dir, dirent.name)
		return dirent.isDirectory() ? fetchFiles(res) : res
	}))
	return Array.prototype.concat(...files)
}

export default fetchFiles

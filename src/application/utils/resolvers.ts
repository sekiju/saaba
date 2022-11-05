export const isConstructor = (object: any): boolean => {
	try {
		new object()
	} catch (err: any) {
		if (err.message.indexOf('is not a constructor') >= 0)
			return false
	}
	return true
}

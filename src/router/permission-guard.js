import utils from 'src/utils/utils'

const { checkIfExistDataUser, checkPermissions } = utils

export const hasPermissionGuard = async (to, from, next) => {
	if (sessionStorage.getItem('impedimentos_token')) {
		if ((await checkIfExistDataUser()) === true) {
			if (
				to &&
				to.meta &&
				to.meta.requiredPermission &&
				checkPermissions(to.meta.requiredPermission) === true
			) {
				next()
			} else {
				next({ name: 'AdministrationMenu' })
			}
		} else {
			next({ name: 'AdministrationMenu' })
		}
	} else {
		next({ name: 'login' })
	}
}

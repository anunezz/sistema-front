import { axiosInstance } from 'src/boot/axios'
import { useAuthUserStore } from 'src/stores/AuthUser'
import { SessionStorage } from 'quasar'

async function checkIfExistDataUser() {
	try{
	const store = useAuthUserStore()

	let dataUser = store.user

	if (Object.keys(dataUser).length < 1) {

		//return new Promise((resolve, reject) => {
			axiosInstance
				.get('/user/' + SessionStorage.getItem('impedimentos_hash'))
				.then((response) => {
					store.setUser = response.data.user
					return true;
		//			resolve()
				})
				.catch((error) => {
					console.log('error', error)
		//			reject(error)
				})
		//})
	} else {
		return true
	}
}catch(error){
	console.error('error',error)
}
}

function checkPermissions(permission) {
	const store = useAuthUserStore()
	const permissions = store.user.permissions

	return permissions.includes(permission)
}

export default {
	checkIfExistDataUser,
	checkPermissions,
}

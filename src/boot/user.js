import { boot } from "quasar/wrappers";
import { useAuthUserStore } from "src/stores/AuthUser";

export default boot(async({router,store})=>{
	const token = sessionStorage.getItem('impedimentos_token');

	const authUserStore = useAuthUserStore(store);

	if(token){
		await authUserStore.sessionInfo();
	}

	router.isReady();
})

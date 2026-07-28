import {RouterView} from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
	path: 'servicios',
	component: RouterView,
	beforeEnter: hasPermissionGuard,
	children: [
		{
			path: '',
			name: 'IndexServicios',
			component: () => import('src/views/administration/servicios/Index.vue'),
			meta:{requiredPermission: 'servicios'}
		},
		/*{
			path: 'nuevo',
			name: 'UserCreate',
			component: () => import('src/views/administration/binnacle/Create'),
		},
		{
			path: 'editar/:id',
			name: 'UserEdit',
			component: () => import('src/views/administration/Users/Edit'),
		}*/
	]
}

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
		{
			// El hash_id del servicio va en la URL (no solo en Pinia) para que
			// F5 / abrir la URL directamente pueda reconstruir el contexto
			// consultando la API, igual que Form_request.vue usa
			// route.params.hash_id para las solicitudes.
			path: 'contenido/:hash_id',
			name: 'ServiciosContenido',
			component: () => import('src/views/administration/servicios/Contenido.vue'),
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

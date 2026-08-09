import {RouterView} from "vue-router";
import { Notify } from "quasar";
import { hasPermissionGuard } from "src/router/permission-guard";
import { useCatServiciosStore } from "src/stores/CatServicios";

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
			path: 'contenido',
			name: 'ServiciosContenido',
			component: () => import('src/views/administration/servicios/Contenido.vue'),
			meta:{requiredPermission: 'servicios'},
			beforeEnter: (to, from, next) => {
				const store = useCatServiciosStore();
				if (!store.selectedService) {
					Notify.create({
						type: 'warning',
						message: 'Selecciona un servicio',
						caption: 'Primero debes elegir un servicio desde el listado para administrar su contenido.'
					});
					next({ name: 'IndexServicios' });
					return;
				}
				next();
			}
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

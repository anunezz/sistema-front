import { RouterView } from 'vue-router'
import { hasPermissionGuard } from 'src/router/permission-guard'

export default {
	path: 'servicios',
	component: RouterView,
	beforeEnter: hasPermissionGuard,
	children: [
		{
			path: '',
			name: 'IndexServicios',
			component: () => import('src/views/administration/servicios/Index.vue'),
			meta: { requiredPermission: 'servicios' },
		},
		{
			// El hash_id del servicio va en la URL (no solo en Pinia) para que
			// F5 / abrir la URL directamente pueda reconstruir el contexto
			// consultando la API, igual que Form_request.vue usa
			// route.params.hash_id para las solicitudes.
			path: 'contenido/:hash_id',
			name: 'ServiciosContenido',
			component: () => import('src/views/administration/servicios/Contenido.vue'),
			meta: { requiredPermission: 'servicios' },
		},
		{
			// Administración de Servicios agendables (AppointmentService) del
			// Servicio padre seleccionado — movida aquí desde Agenda (antes
			// pestaña "Servicios agendables" en administration/agenda). Mismo
			// criterio de hash_id-en-URL que "contenido" arriba. Los endpoints
			// que consume (administration/agenda/servicios-agendables) siguen
			// exigiendo el permiso "agenda" en backend (no se tocó esa regla) —
			// un usuario necesita AMBOS permisos ("servicios" para entrar aquí y
			// "agenda" para que las peticiones no devuelvan 403).
			path: 'servicios-agendables/:hash_id',
			name: 'ServiciosAgendablesDeServicio',
			component: () => import('src/views/administration/servicios/ServiciosAgendables.vue'),
			meta: { requiredPermission: 'servicios' },
		},
		{
			// Productos del Servicio padre seleccionado — mismo criterio de
			// hash_id-en-URL que "contenido"/"servicios-agendables" arriba.
			// A diferencia de servicios-agendables, el backend de Productos SÍ
			// vive bajo el permiso "servicios" (administration/catalogos/productos,
			// ver .claude/skills/servicios/) porque Producto no es un concepto de
			// Agenda — no requiere el permiso "agenda" adicional.
			path: 'productos/:hash_id',
			name: 'ProductosDeServicio',
			component: () => import('src/views/administration/servicios/ProductosDeServicio.vue'),
			meta: { requiredPermission: 'servicios' },
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
	],
}

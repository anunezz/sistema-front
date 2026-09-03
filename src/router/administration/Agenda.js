import { RouterView } from 'vue-router'
import { hasPermissionGuard } from 'src/router/permission-guard'

export default {
	path: 'agenda',
	component: RouterView,
	beforeEnter: hasPermissionGuard,
	children: [
		{
			path: '',
			name: 'IndexAgenda',
			component: () => import('src/views/administration/agenda/Index.vue'),
			meta: { requiredPermission: 'agenda' }
		}
	]
}

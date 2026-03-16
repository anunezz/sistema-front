import {RouterView} from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'usuarios',
    component: RouterView,
    children: [
        {
            path: '',
            name: 'UsersIndex',
            component: () => import('src/views/administration/users/Index.vue'),
            meta:{requiredPermission: 'user_management'}
        }
    ],
	beforeEnter: hasPermissionGuard,
}


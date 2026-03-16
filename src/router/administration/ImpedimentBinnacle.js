import {RouterView} from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'impedimento-bitacora',
    component: RouterView,
    beforeEnter: hasPermissionGuard,
    children: [
        {
            path: '',
            name: 'ImpedimentBinnacleIndex',
            component: () => import('src/views/administration/impediment_binnacle/Index.vue'),
			meta:{requiredPermission: 'impediment_log'}
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


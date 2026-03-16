import {RouterView} from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'bitacora',
    component: RouterView,
    beforeEnter: hasPermissionGuard,
    children: [
        {
            path: '',
            name: 'BinnacleIndex',
            component: () => import('src/views/administration/binnacle/Index.vue'),
            meta:{requiredPermission: 'logbook'}
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


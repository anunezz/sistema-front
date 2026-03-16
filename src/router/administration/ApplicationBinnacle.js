import {RouterView} from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'solicitud-bitacora',
    component: RouterView,
    beforeEnter: hasPermissionGuard,
    children: [
        {
            path: '',
            name: 'ApplicationBinnacleIndex',
            component: () => import('src/views/administration/application_binnacle/Index.vue'),
            meta:{requiredPermission: 'request_log'}
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


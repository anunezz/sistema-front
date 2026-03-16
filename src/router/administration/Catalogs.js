import { RouterView } from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'catalogos',
    component: RouterView,
    beforeEnter: hasPermissionGuard,
    children: [
        {
            path: '',
            name: 'CatalogsIndex',
            component: () => import('src/views/administration/catalogs/Index.vue'),
            meta:{requiredPermission: 'catalog_management'}
        },
    ]
}


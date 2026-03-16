import { RouterView } from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'reportes',
    component: RouterView,
    beforeEnter: hasPermissionGuard,
    children: [
        {
            path: '',
            name: 'ReportesIndex',
            component: () => import('src/views/administration/reports/Index.vue'),
            meta:{requiredPermission: 'reports'}
        },
    ]
}


import { RouterView } from "vue-router";
import { hasPermissionGuard } from "src/router/permission-guard";

export default {
    path: 'reporte-estadisticos',
    component: RouterView,
    children: [
        {
            path: '',
            name: 'ReportesEstadisticosIndex',
            component: () => import('src/views/administration/reports/impediments.vue'),
            beforeEnter: hasPermissionGuard,
            meta:{requiredPermission: 'reports'}
        },
    ]
}


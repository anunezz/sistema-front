// Módulo inicial del administrador (spec §14) — sin permission-guard a
// propósito: es la pantalla de aterrizaje para CUALQUIER usuario autenticado
// (mismo criterio que 'AdministrationMenu', que tampoco exige un permiso
// específico), no un módulo de dominio como Agenda/Servicios/Usuarios. La
// autenticación ya la exige el guard padre (isAuthenticatedGuard en
// routes.js). Los datos reales de Agenda que muestra sí siguen protegidos
// por permission:agenda en el backend (ver AgendaAdminServices.ts::DashboardApi).
export default {
	path: 'inicio',
	name: 'Inicio',
	component: () => import('src/views/administration/inicio/Index.vue'),
}

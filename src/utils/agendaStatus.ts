import type { AppointmentStatus } from 'src/interfaces/agenda'

export interface StatusMeta {
	label: string
	color: string
	textColor?: string
	icon: string
}

// Única fuente de verdad de color/ícono por estatus de cita — reutilizada por
// StatusChip.vue (calendario/detalle de cita) y por el dashboard de Inicio
// (tarjetas + gráfica de barras, spec §17: "si ya existe una función para
// obtener el color según el estatus, reutilizarla"). Coincide con los
// colores fc-status-* de ThePlanetCalendar.vue — si cambias un color aquí,
// cámbialo también allá.
export const STATUS_META: Record<AppointmentStatus, StatusMeta> = {
	PENDIENTE: { label: 'Pendiente', color: 'amber-8', textColor: 'dark', icon: 'schedule' },
	CONFIRMADA: { label: 'Confirmada', color: 'positive', icon: 'check_circle' },
	CANCELADA: { label: 'Cancelada', color: 'negative', icon: 'cancel' },
	COMPLETADA: { label: 'Completada', color: 'blue-8', icon: 'task_alt' },
	NO_SHOW: { label: 'No se presentó', color: 'purple-6', icon: 'person_off' },
}

export function getStatusMeta(status: string): StatusMeta {
	return (STATUS_META as Record<string, StatusMeta>)[status] || { label: status, color: 'grey-6', icon: 'help' }
}

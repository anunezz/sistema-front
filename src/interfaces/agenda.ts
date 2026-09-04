// Horario y bloqueos son del negocio completo (globales, no por barbero).
// Las citas sí son por barbero — decisión de producto confirmada al
// reintroducir barbero (ver .claude/skills/agenda/ y
// .claude/skills/usuarios/). is_barbero=true en un usuario NO implica
// disponibilidad real, eso lo calcula el backend (AvailabilityService).

export interface BarberoRecord {
	hash_id: string
	name: string
}

export interface AppointmentServiceRecord {
	id: number
	hash_id: string
	service_category_id: number
	name: string
	duration_minutes: number
	price: string | number | null
	active: boolean
	sort_order: number
	category?: { id: number; title: string } | null
}

export interface WorkingHourDay {
	day_of_week: number
	start_time: string
	end_time: string
	active: boolean
}

// Bloqueo público (GET agenda/bloqueos, sin auth) — homólogo de
// ScheduleBlockRecord sin hash_id ni reason (ver PublicScheduleBlockResource
// en backend). Solo lo necesario para pintar franjas "CERRADO" en el
// calendario público.
export interface PublicScheduleBlockRecord {
	starts_at: string
	ends_at: string
	all_day: boolean
	reason: string | null
}

export interface ScheduleBlockRecord {
	hash_id: string
	starts_at: string
	ends_at: string
	all_day: boolean
	reason: string | null
	active: boolean
}

// Estados reales definidos en backend (App\Models\Appointment::STATUSES) —
// no inventar estados nuevos, ver .claude/skills/agenda/ §5.
export const APPOINTMENT_STATUSES = [
	'PENDIENTE',
	'CONFIRMADA',
	'CANCELADA',
	'COMPLETADA',
	'NO_SHOW',
] as const

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]

// Mensaje sugerido al cliente según el estatus elegido (spec §7) — solo
// rellena el campo "Mensaje para el cliente" en el modal de detalle, el
// admin puede editarlo antes de guardar. No es una regla de negocio del
// backend, es UX; vive aquí para no duplicarlo si otra vista lo necesita.
export const APPOINTMENT_STATUS_SUGGESTED_MESSAGE: Record<AppointmentStatus, string> = {
	PENDIENTE: 'Tu cita se encuentra pendiente de confirmación.',
	CONFIRMADA: 'Tu cita ha sido confirmada. Te esperamos en The Planet Studio.',
	CANCELADA: 'Tu cita ha sido cancelada correctamente.',
	COMPLETADA: 'Tu cita ha sido marcada como completada. ¡Gracias por visitarnos!',
	NO_SHOW: 'Tu cita fue registrada como no presentada.',
}

export interface AppointmentSummary {
	hash_id: string
	folio: string
	status: AppointmentStatus
	appointment_date: string
	start_time: string
	end_time: string
	customer_name: string
	customer_phone: string
	customer_email: string | null
	barbero?: { hash_id: string; name: string } | null
	service?: {
		hash_id: string
		name: string
		duration_minutes: number
		price: string | number | null
	}
	category?: { title: string } | null
}

// Calendario ADMINISTRATIVO (GET administration/agenda/citas, auth) — sí
// lleva datos de cliente, folio y mensaje del administrador (ver
// .claude/skills/agenda/ y AppointmentCalendarResource).
export interface AppointmentCalendarEvent {
	id: string
	title: string
	start: string
	end: string
	extendedProps: {
		folio: string
		status: AppointmentStatus
		customer_name: string
		customer_phone: string
		customer_email: string | null
		service: string
		category: string | null
		barbero: string | null
		duration_minutes: number | null
		created_by_admin: boolean
		created_at: string | null
		updated_at: string | null
		admin_message: string | null
	}
}

// Calendario PÚBLICO (GET agenda/citas, sin auth) — nunca lleva datos de
// cliente NI folio (el folio es privado, solo se conoce/consulta con el
// folio exacto), ver .claude/skills/agenda/ y PublicAppointmentCalendarResource.
export interface PublicAppointmentCalendarEvent {
	id: string
	title: string
	start: string
	end: string
	extendedProps: {
		status: AppointmentStatus
		service: string
		category: string | null
		barbero: string | null
		// Motivo de cancelación (reutiliza admin_message) — solo viene
		// poblado cuando status === 'CANCELADA', ver
		// PublicAppointmentCalendarResource en backend.
		reason: string | null
	}
}

// Detalle de cita para consulta pública por folio (GET agenda/citas/{folio})
// — el cliente sí ve su propio folio y el mensaje del administrador (si
// existe), a diferencia del clic sobre el calendario público.
export interface PublicAppointmentDetail {
	folio: string
	status: AppointmentStatus
	// El frontend muestra "Cancelar cita" solo cuando esto es true — el
	// backend decide qué estados son cancelables (Appointment::
	// CANCELLABLE_STATUSES), no se duplica esa regla aquí.
	cancellable: boolean
	appointment_date: string
	start_time: string
	end_time: string
	service: string | null
	category: string | null
	barbero: string | null
	message: string | null
}

export interface ApiSuccess<T> {
	success: boolean
	data: T
	message?: string
}

export interface ApiError {
	success: false
	message: string
	errors?: Record<string, string[]>
}

export interface BookAppointmentPayload {
	appointment_service_id: string
	barbero_user_id: string
	appointment_date: string
	start_time: string
	customer_name: string
	customer_phone: string
	customer_email?: string | null
	customer_comments?: string | null
}

// Cancelación pública por folio — motivo del CLIENTE, distinto de
// admin_message (motivo del barbero/administrador, no se toca desde aquí).
export interface CancelAppointmentPayload {
	client_cancellation_reason: string
}

import { axiosInstance } from 'src/boot/axios'
import type { AxiosResponse } from 'axios'
import type {
	ApiSuccess,
	AppointmentServiceRecord,
	AppointmentSummary,
	BarberoRecord,
	BookAppointmentPayload,
	CancelAppointmentPayload,
	PublicAppointmentCalendarEvent,
	PublicAppointmentDetail,
	PublicScheduleBlockRecord,
	WorkingHourDay,
} from 'src/interfaces/agenda'

class AgendaApi {
	async getServices(): Promise<ApiSuccess<AppointmentServiceRecord[]>> {
		const { data } =
			await axiosInstance.get<ApiSuccess<AppointmentServiceRecord[]>>('/agenda/servicios')
		return data
	}

	// Horario de atención real (solo días activos) — reemplaza el rango
	// hardcodeado que tenía el calendario (ver .claude/skills/agenda/ §13.5).
	async getWorkingHours(): Promise<ApiSuccess<WorkingHourDay[]>> {
		const { data } = await axiosInstance.get<ApiSuccess<WorkingHourDay[]>>('/agenda/horario')
		return data
	}

	// Bloqueos activos que traslapan [start, end] — se pintan como franjas
	// "CERRADO" en el calendario público.
	async getBlocks(start: string, end: string): Promise<ApiSuccess<PublicScheduleBlockRecord[]>> {
		const { data } = await axiosInstance.get<ApiSuccess<PublicScheduleBlockRecord[]>>(
			'/agenda/bloqueos',
			{ params: { start, end } },
		)
		return data
	}

	async getAvailableDays(appointmentServiceId: string): Promise<ApiSuccess<string[]>> {
		const { data } = await axiosInstance.get<ApiSuccess<string[]>>('/agenda/dias-disponibles', {
			params: { appointment_service_id: appointmentServiceId },
		})
		return data
	}

	// start_time opcional: con él, filtra a barberos disponibles para ESE
	// slot exacto (paso "Barbero" del flujo actual, posterior a elegir
	// horario) — sin él, barberos con algo libre ese día.
	async getBarberos(
		appointmentServiceId: string,
		date: string,
		startTime: string | null = null,
	): Promise<ApiSuccess<BarberoRecord[]>> {
		const { data } = await axiosInstance.get<ApiSuccess<BarberoRecord[]>>('/agenda/barberos', {
			params: { appointment_service_id: appointmentServiceId, date, start_time: startTime },
		})
		return data
	}

	// barberoUserId opcional: sin él, devuelve la disponibilidad agregada
	// (unión de todos los barberos válidos) — paso "Horarios disponibles"
	// del flujo actual, que precede a elegir barbero.
	async getAvailability(
		appointmentServiceId: string,
		date: string,
		barberoUserId: string | null = null,
	): Promise<ApiSuccess<string[]>> {
		const { data } = await axiosInstance.get<ApiSuccess<string[]>>('/agenda/disponibilidad', {
			params: {
				appointment_service_id: appointmentServiceId,
				barbero_user_id: barberoUserId,
				date,
			},
		})
		return data
	}

	bookAppointment(
		payload: BookAppointmentPayload,
	): Promise<AxiosResponse<ApiSuccess<AppointmentSummary>>> {
		return axiosInstance.post('/agenda/citas', payload)
	}

	async getPublicCalendar(
		start: string,
		end: string,
	): Promise<ApiSuccess<PublicAppointmentCalendarEvent[]>> {
		const { data } = await axiosInstance.get<ApiSuccess<PublicAppointmentCalendarEvent[]>>(
			'/agenda/citas',
			{ params: { start, end } },
		)
		return data
	}

	getAppointmentByFolio(
		folio: string,
	): Promise<AxiosResponse<ApiSuccess<PublicAppointmentDetail>>> {
		return axiosInstance.get(`/agenda/citas/${encodeURIComponent(folio)}`)
	}

	// Cancelación por el CLIENTE, identificada por folio (el backend nunca
	// confía en un id enviado por el navegador, ver AppointmentCancellationService).
	cancelAppointment(
		folio: string,
		payload: CancelAppointmentPayload,
	): Promise<AxiosResponse<ApiSuccess<PublicAppointmentDetail>>> {
		return axiosInstance.post(`/agenda/citas/${encodeURIComponent(folio)}/cancelar`, payload)
	}
}

export default new AgendaApi()

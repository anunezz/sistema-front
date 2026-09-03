import { axiosInstance } from 'src/boot/axios'
import type { AxiosResponse } from 'axios'
import type {
	ApiSuccess,
	AppointmentServiceRecord,
	WorkingHourDay,
	ScheduleBlockRecord,
	AppointmentCalendarEvent,
	AppointmentStatus,
} from 'src/interfaces/agenda'

const BASE = 'administration/agenda'

// Un solo archivo para los recursos administrativos de Agenda (horario,
// servicios agendables, bloqueos, calendario) en vez de un archivo por
// recurso como en catalogs/CatServiciosServices.ts — son pantallas de
// configuración pequeñas, separar no aporta claridad extra en esta iteración.
//
// Horario y bloqueos son del negocio completo (globales), no por barbero —
// solo las citas distinguen barbero (ver .claude/skills/agenda/).
export const AppointmentServiceApi = {
	// filters.service_category_id: reutiliza AppointmentService::scopeSearch()
	// ya existente en backend (no se agregó filtro nuevo) — usado por la
	// pantalla "Servicios agendables de <Servicio>" (módulo Servicios) para
	// mostrar solo los hijos del Servicio seleccionado.
	index(filters?: {
		service_category_id?: number
	}): Promise<AxiosResponse<ApiSuccess<AppointmentServiceRecord[]>>> {
		return axiosInstance.get(`${BASE}/servicios-agendables`, { params: { filters } })
	},
	store(
		data: Partial<AppointmentServiceRecord>,
	): Promise<AxiosResponse<ApiSuccess<AppointmentServiceRecord>>> {
		return axiosInstance.post(`${BASE}/servicios-agendables`, data)
	},
	update(
		hashId: string,
		data: Partial<AppointmentServiceRecord>,
	): Promise<AxiosResponse<ApiSuccess<AppointmentServiceRecord>>> {
		return axiosInstance.put(`${BASE}/servicios-agendables/${hashId}`, data)
	},
	remove(hashId: string): Promise<AxiosResponse<{ success: boolean }>> {
		return axiosInstance.delete(`${BASE}/servicios-agendables/${hashId}`)
	},
}

export const WorkingHourApi = {
	index(): Promise<AxiosResponse<ApiSuccess<WorkingHourDay[]>>> {
		return axiosInstance.get(`${BASE}/horario`)
	},
	update(days: WorkingHourDay[]): Promise<AxiosResponse<ApiSuccess<WorkingHourDay[]>>> {
		return axiosInstance.put(`${BASE}/horario`, { days })
	},
}

export const ScheduleBlockApi = {
	index(): Promise<AxiosResponse<ApiSuccess<ScheduleBlockRecord[]>>> {
		return axiosInstance.get(`${BASE}/bloqueos`)
	},
	store(data: {
		date: string
		all_day: boolean
		start_time?: string | null
		end_time?: string | null
		reason?: string | null
	}): Promise<AxiosResponse<ApiSuccess<ScheduleBlockRecord>>> {
		return axiosInstance.post(`${BASE}/bloqueos`, data)
	},
	remove(hashId: string): Promise<AxiosResponse<{ success: boolean }>> {
		return axiosInstance.delete(`${BASE}/bloqueos/${hashId}`)
	},
}

export const AppointmentCalendarApi = {
	index(
		start: string,
		end: string,
	): Promise<AxiosResponse<ApiSuccess<AppointmentCalendarEvent[]>>> {
		return axiosInstance.get(`${BASE}/citas`, { params: { start, end } })
	},
	updateStatus(
		hashId: string,
		status: AppointmentStatus,
	): Promise<AxiosResponse<ApiSuccess<AppointmentCalendarEvent>>> {
		return axiosInstance.put(`${BASE}/citas/${hashId}/estatus`, { status })
	},
	// Mensaje del administrador para el cliente — un mensaje vigente por
	// cita, se reescribe (ver .claude/skills/agenda/).
	updateMessage(
		hashId: string,
		message: string,
	): Promise<AxiosResponse<ApiSuccess<AppointmentCalendarEvent>>> {
		return axiosInstance.put(`${BASE}/citas/${hashId}/mensaje`, { message })
	},
}

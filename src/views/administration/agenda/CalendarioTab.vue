<template>
	<div class="q-pa-md">
		<q-banner v-if="loadError" class="bg-negative text-white q-mb-md" rounded>
			No se pudieron cargar las citas. Intenta de nuevo.
		</q-banner>

		<div class="row justify-end q-mb-md">
			<q-btn
				outline
				color="primary"
				icon="manage_search"
				label="Búsqueda avanzada"
				@click="searchDialogOpen = true"
			/>
		</div>

		<ThePlanetCalendar
			:events="events"
			:business-hours="calendarBounds.businessHours"
			:slot-min-time="calendarBounds.slotMinTime"
			:slot-max-time="calendarBounds.slotMaxTime"
			:closed-days-of-week="calendarBounds.closedDaysOfWeek"
			:blocks="activeBlocks"
			:editable="false"
			:show-day-nav="true"
			:restrict-to-current-month="false"
			initial-view="dayGridMonth"
			@event-click="onEventClick"
			@dates-set="onDatesSet"
		/>

		<!-- DETALLE / ESTATUS DE LA CITA -->
		<q-dialog v-model="detailOpen">
			<q-card style="min-width: 380px; max-width: 480px">
				<!-- Mismo color que el header administrativo (MainLayout.vue
				     q-header, #691C32) — spec §4: no inventar paleta nueva. -->
				<q-card-section
					class="row items-center text-white"
					style="background-color: #691c32"
				>
					<div class="text-h6">Detalle de la cita</div>
					<q-space />
					<q-btn icon="close" flat round dense color="white" v-close-popup />
				</q-card-section>
				<q-card-section v-if="selected" class="q-gutter-xs">
					<div><b>Folio:</b> {{ selected.folio }}</div>
					<div><b>Servicio:</b> {{ selected.category || 'N/D' }}</div>
					<div><b>Servicio agendable:</b> {{ selected.service }}</div>
					<div v-if="selected.barbero"><b>Barbero:</b> {{ selected.barbero }}</div>
					<div><b>Día:</b> {{ selectedDay }}</div>
					<div><b>Horario:</b> {{ selectedTime }}</div>
					<div><b>Nombre:</b> {{ selected.customer_name }}</div>
					<div><b>Teléfono:</b> {{ selected.customer_phone }}</div>
					<div v-if="selected.customer_email">
						<b>Correo:</b> {{ selected.customer_email }}
					</div>
					<div v-if="selected.duration_minutes">
						<b>Duración:</b> {{ selected.duration_minutes }} min
					</div>
					<div v-if="selected.created_at">
						<b>Fecha de creación:</b> {{ selectedCreatedAt }}
					</div>
					<div v-if="selected.updated_at">
						<b>Fecha de actualización:</b> {{ selectedUpdatedAt }}
					</div>
					<div class="row items-center q-gutter-sm">
						<b>Estatus actual:</b>
						<StatusChip :status="selected.status" />
					</div>
					<div v-if="selected.created_by_admin" class="text-caption text-grey-7">
						Creada por el administrador
					</div>
					<div v-else class="text-caption text-grey-7">
						Reservada desde la vista pública
					</div>
				</q-card-section>
				<q-card-section>
					<q-select
						v-model="selectedStatus"
						:options="APPOINTMENT_STATUSES"
						label="Estatus"
						outlined
						dense
						@update:model-value="onStatusChange"
					/>
				</q-card-section>

				<!-- MENSAJE PARA EL CLIENTE: se autocompleta segun el estatus elegido
				     (spec S7); si el admin ya lo edito a mano, onStatusChange pregunta
				     antes de reemplazarlo (ver script). -->
				<q-card-section>
					<div class="text-subtitle2 q-mb-sm">Mensaje para el cliente</div>
					<q-input
						v-model="messageInput"
						type="textarea"
						outlined
						dense
						maxlength="2000"
						counter
						placeholder="Ej. Hola Juan, tu cita ha sido confirmada. Te esperamos el día..."
						@update:model-value="messageManuallyEdited = true"
					/>
					<div class="text-caption text-grey-7 q-mt-xs">
						Visible para el cliente al consultar su cita con el folio.
					</div>
				</q-card-section>

				<!-- GUARDAR unico (spec S6): un solo boton, una sola confirmacion, una
				     sola peticion que persiste estatus y mensaje juntos. -->
				<q-card-actions align="right">
					<q-btn flat label="Cerrar" v-close-popup />
					<q-btn
						color="primary"
						label="Guardar"
						icon="save"
						:loading="saving"
						@click="save"
					/>
				</q-card-actions>
			</q-card>
		</q-dialog>

		<!-- BÚSQUEDA AVANZADA (spec §9): fecha (día/rango, solo calendario) +
		     estatus (múltiple, todos los reales). No cambia lo que pinta el
		     calendario detrás — resultados en tabla aparte, con el mismo modal
		     de detalle de arriba al hacer clic en una fila. -->
		<Modal v-model="searchDialogOpen" title="Búsqueda avanzada" header-color="#691c32">
			<div class="q-pa-md q-gutter-md">
				<q-input outlined dense readonly v-model="searchDateDisplay" label="Fecha">
					<template v-slot:append>
						<q-icon name="event" class="cursor-pointer">
							<q-popup-proxy cover transition-show="scale" transition-hide="scale">
								<q-date v-model="searchDateRange" mask="DD-MM-YYYY" range />
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>

				<q-select
					outlined
					dense
					multiple
					use-chips
					emit-value
					map-options
					v-model="searchStatuses"
					:options="statusSelectOptions"
					label="Estatus"
				/>

				<div class="row justify-end q-gutter-sm">
					<q-btn flat label="Limpiar" @click="clearSearch" />
					<q-btn color="primary" label="Buscar" :loading="searching" @click="runSearch" />
				</div>

				<q-separator />

				<q-table
					:rows="searchResults"
					:columns="searchColumns"
					row-key="id"
					flat
					dense
					:loading="searching"
					@row-click="(evt, row) => openDetailFromRecord(row)"
				>
					<template v-slot:body-cell-status="props">
						<q-td :props="props">
							<StatusChip :status="props.row.extendedProps.status" />
						</q-td>
					</template>
					<template v-slot:no-data>
						<div class="full-width row flex-center text-grey-7 q-pa-md">
							Sin resultados para este filtro.
						</div>
					</template>
				</q-table>
			</div>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Dialog, Notify } from 'quasar'
import ThePlanetCalendar from 'src/components/the_planet/ThePlanetCalendar.vue'
import StatusChip from 'src/components/the_planet/StatusChip.vue'
import DeleteAlert from 'src/components/DeleteAlert.vue'
import Modal from 'src/components/Modal.vue'
import {
	AppointmentCalendarApi,
	WorkingHourApi,
	ScheduleBlockApi,
} from 'src/services/administration/agenda/AgendaAdminServices'
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_SUGGESTED_MESSAGE } from 'src/interfaces/agenda'
import { getStatusMeta } from 'src/utils/agendaStatus'
import type {
	AppointmentCalendarEvent,
	AppointmentStatus,
	ScheduleBlockRecord,
} from 'src/interfaces/agenda'
import { buildCalendarBounds } from 'src/utils/agendaSchedule'
import { formatDateDMY, formatDateTimeDMY } from 'src/utils/date'

const events = ref<AppointmentCalendarEvent[]>([])
const loadError = ref(false)
const detailOpen = ref(false)

// Horario real (WorkingHour) + bloqueos (ScheduleBlock) — mismos catálogos
// que administra este módulo, alimentan los límites/franjas "CERRADO" del
// calendario (antes rango fijo hardcodeado, ver .claude/skills/agenda/
// §13.5). Reutiliza WorkingHourApi/ScheduleBlockApi ya existentes.
const workingHours = ref([])
const blocks = ref<ScheduleBlockRecord[]>([])
const calendarBounds = computed(() => buildCalendarBounds(workingHours.value))
const activeBlocks = computed(() => blocks.value.filter((b) => b.active))
const selectedId = ref<string | null>(null)
const selected = ref<AppointmentCalendarEvent['extendedProps'] | null>(null)
const selectedStatus = ref<AppointmentStatus | null>(null)
const selectedStart = ref<Date | null>(null)
const selectedEnd = ref<Date | null>(null)
const messageInput = ref('')
// true cuando el admin escribió el mensaje a mano en ESTA apertura del modal
// (spec §7: no sobrescribir un mensaje ya editado sin advertir) — se resetea
// cada vez que se abre una cita, ver onEventClick.
const messageManuallyEdited = ref(false)
const saving = ref(false)

const pad = (n: number) => String(n).padStart(2, '0')

// Búsqueda avanzada (spec §9/§10) — fecha (día/rango, solo calendario) +
// estatus múltiple, con Buscar/Limpiar. No toca lo que pinta el calendario
// detrás (visibleRange/loadEvents siguen igual); usa el mismo
// AppointmentCalendarApi.index() con el parámetro opcional `statuses`.
const searchDialogOpen = ref(false)
const searching = ref(false)
const searchResults = ref<AppointmentCalendarEvent[]>([])

const todayDMY = () => {
	const d = new Date()
	return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}

const searchDateRange = ref<{ from: string; to: string } | string>({
	from: todayDMY(),
	to: todayDMY(),
})
// Por defecto: TODOS los estatus (spec §10).
const searchStatuses = ref<AppointmentStatus[]>([...APPOINTMENT_STATUSES])

const statusSelectOptions = APPOINTMENT_STATUSES.map((status) => ({
	label: getStatusMeta(status).label,
	value: status,
}))

const searchDateDisplay = computed(() => {
	const range = searchDateRange.value
	if (!range) return ''
	if (typeof range === 'string') return range
	if (!range.from) return ''
	return range.from === range.to ? range.from : `${range.from} - ${range.to}`
})

const toIsoDate = (displayDate: string) => {
	const [day, month, year] = displayDate.split('-')
	return `${year}-${month}-${day}`
}

const searchColumns = [
	{ name: 'date', label: 'Día', field: (row: AppointmentCalendarEvent) => formatDateDMY(new Date(row.start)), align: 'left' as const },
	{ name: 'time', label: 'Horario', field: (row: AppointmentCalendarEvent) => `${new Date(row.start).toTimeString().slice(0, 5)} - ${new Date(row.end).toTimeString().slice(0, 5)}`, align: 'left' as const },
	{ name: 'service', label: 'Servicio', field: (row: AppointmentCalendarEvent) => row.extendedProps.service, align: 'left' as const },
	{ name: 'customer_name', label: 'Cliente', field: (row: AppointmentCalendarEvent) => row.extendedProps.customer_name, align: 'left' as const },
	{ name: 'status', label: 'Estatus', field: () => '', align: 'left' as const },
]

const runSearch = async () => {
	const range = searchDateRange.value
	let start = ''
	let end = ''

	if (range && typeof range === 'object' && range.from) {
		start = toIsoDate(range.from)
		end = toIsoDate(range.to || range.from)
	} else if (typeof range === 'string' && range) {
		start = toIsoDate(range)
		end = start
	} else {
		return
	}

	searching.value = true
	try {
		const response = await AppointmentCalendarApi.index(start, end, searchStatuses.value)
		searchResults.value = response.data.success ? response.data.data : []
	} catch {
		searchResults.value = []
		Notify.create({ type: 'negative', message: 'No se pudo completar la búsqueda.' })
	} finally {
		searching.value = false
	}
}

// Limpiar regresa a día actual + todos los estatus, y vuelve a mostrar esas
// citas — nunca deja la tabla de resultados vacía por limpiar (spec §10).
const clearSearch = () => {
	searchDateRange.value = { from: todayDMY(), to: todayDMY() }
	searchStatuses.value = [...APPOINTMENT_STATUSES]
	runSearch()
}

// Fechas visibles al usuario en DD-MM-YYYY (spec §8) — la API sigue
// devolviendo ISO, esto solo cambia la presentación.
const selectedDay = computed(() => {
	if (!selectedStart.value) return ''
	return formatDateDMY(selectedStart.value)
})

const selectedTime = computed(() => {
	if (!selectedStart.value || !selectedEnd.value) return ''
	const s = selectedStart.value
	const e = selectedEnd.value
	return `${pad(s.getHours())}:${pad(s.getMinutes())} - ${pad(e.getHours())}:${pad(e.getMinutes())}`
})

const selectedCreatedAt = computed(() => {
	if (!selected.value?.created_at) return ''
	return formatDateTimeDMY(selected.value.created_at)
})

// Spec §11: además de creación, mostrar actualización.
const selectedUpdatedAt = computed(() => {
	if (!selected.value?.updated_at) return ''
	return formatDateTimeDMY(selected.value.updated_at)
})

interface FullCalendarClickArg {
	event: {
		id: string
		start: Date
		end: Date
		extendedProps: AppointmentCalendarEvent['extendedProps']
	}
}

// Abre el modal de detalle a partir de un registro con la misma forma que
// AppointmentCalendarEvent (id/start/end/extendedProps) — lo alimentan tanto
// un clic en el calendario (onEventClick) como una fila de la tabla de
// resultados de Búsqueda avanzada (openDetailFromRecord), sin duplicar esta
// lógica en dos sitios.
const openDetailFromRecord = (record: {
	id: string
	start: Date | string
	end: Date | string
	extendedProps: AppointmentCalendarEvent['extendedProps']
}) => {
	selectedId.value = record.id
	selected.value = record.extendedProps
	selectedStart.value = new Date(record.start)
	selectedEnd.value = new Date(record.end)
	selectedStatus.value = record.extendedProps.status
	messageInput.value = record.extendedProps.admin_message || ''
	// Asignación directa de refs (no interacción del usuario) — no dispara
	// @update:model-value de q-select/q-input, así que no hace falta un guard
	// extra para evitar que onStatusChange/el marcado de "editado a mano" se
	// disparen al abrir el modal.
	messageManuallyEdited.value = false
	detailOpen.value = true
}

const onEventClick = (arg: FullCalendarClickArg) => {
	openDetailFromRecord(arg.event)
}

// Mensaje sugerido al cambiar de estatus (spec §7). Solo se dispara con
// interacción real del q-select (@update:model-value), nunca con la
// asignación programática de onEventClick — ver comentario ahí.
const onStatusChange = (newStatus: AppointmentStatus | null) => {
	if (!newStatus) return
	const suggested = APPOINTMENT_STATUS_SUGGESTED_MESSAGE[newStatus]

	if (!messageManuallyEdited.value || messageInput.value === suggested) {
		messageInput.value = suggested
		messageManuallyEdited.value = false
		return
	}

	// El admin ya escribió algo a mano: advertir antes de perderlo (spec §7,
	// "lógica segura para evitar pérdida de información").
	Dialog.create({
		component: DeleteAlert,
		componentProps: {
			icon: 'edit_note',
			title: 'Reemplazar mensaje',
			subtitle: 'Ya modificaste el mensaje del cliente manualmente.',
			question: '¿Deseas reemplazarlo por el mensaje sugerido para este estatus?',
			button: 'Reemplazar',
			// Mismo color del header administrativo (spec §4).
			avatarStyle: 'background-color:#691c32',
		},
	}).onOk(() => {
		messageInput.value = suggested
		messageManuallyEdited.value = false
	})
}

// Rango REALMENTE visible en el calendario (ver ThePlanetCalendar.vue
// @dates-set) — antes se asumía "el mes calendario en curso al montar el
// componente", calculado una sola vez con `new Date()`: las citas de
// cualquier otro mes/rango (p. ej. el mes anterior, o el rango que resulta
// de cambiar a Vista Semana/Día) nunca llegaban a pedirse al backend. Bug
// real corregido — ver también restrictToCurrentMonth=false en el template.
const visibleRange = ref<{ start: string; end: string } | null>(null)

const loadEvents = async () => {
	if (!visibleRange.value) return

	try {
		const response = await AppointmentCalendarApi.index(
			visibleRange.value.start,
			visibleRange.value.end,
		)
		if (response.data.success) {
			events.value = response.data.data
		}
	} catch {
		loadError.value = true
		Notify.create({
			type: 'negative',
			message: 'Error',
			caption: 'No se pudieron cargar las citas.',
		})
	}
}

// FullCalendar dispara datesSet en cada navegación (incluida la carga
// inicial) con el rango de fechas que realmente va a pintar — se vuelve a
// consultar el backend con ESE rango exacto en vez de uno fijo calculado
// una sola vez.
interface DatesSetArg {
	startStr: string
	endStr: string
}

// CAUSA RAÍZ del bucle de peticiones (verificado en el código fuente de
// @fullcalendar/vue3, no supuesto): `calendarOptions` en ThePlanetCalendar.vue
// es un computed que arma un objeto `events` NUEVO cada vez que `events`
// (este ref) cambia. El wrapper de FullCalendar vigila `options` con
// `deep:true` (node_modules/@fullcalendar/vue3/dist/FullCalendar.js) y ante
// cualquier cambio de referencia llama `calendar.resetOptions(...)`, lo que
// dispara un render interno que reconstruye el dateProfile y REEMITE
// 'datesSet' (@fullcalendar/core/index.js:1103) aunque el rango visible no
// haya cambiado. Sin este guard: loadEvents() cambia `events` -> nuevo
// calendarOptions -> resetOptions -> datesSet de nuevo -> loadEvents() ->
// ciclo infinito. Comparar el rango entrante contra el ya cargado corta el
// ciclo sin impedir la navegación real (día/semana/mes/vista sí cambian el
// rango y sí deben recargar).
const onDatesSet = (arg: DatesSetArg) => {
	const start = arg.startStr.slice(0, 10)
	const end = arg.endStr.slice(0, 10)

	if (visibleRange.value?.start === start && visibleRange.value?.end === end) return

	visibleRange.value = { start, end }
	loadEvents()
}

const loadWorkingHours = async () => {
	try {
		const response = await WorkingHourApi.index()
		workingHours.value = response.data.success ? response.data.data : []
	} catch {
		workingHours.value = []
	}
}

const loadBlocks = async () => {
	try {
		const response = await ScheduleBlockApi.index()
		blocks.value = response.data.success ? response.data.data : []
	} catch {
		blocks.value = []
	}
}

// GUARDAR único (spec §6/§31): una sola confirmación (reutiliza DeleteAlert,
// mismo componente genérico ya usado en BloqueosTab.vue/ServiciosTab.vue/
// ProductosDeServicio.vue) y una sola petición (AppointmentCalendarApi.update)
// que persiste estatus y mensaje juntos. Reemplaza los antiguos "Guardar
// estatus"/"Guardar mensaje" (dos botones, dos confirmaciones, dos requests).
const save = () => {
	if (!selectedId.value || !selectedStatus.value) return

	Dialog.create({
		component: DeleteAlert,
		componentProps: {
			icon: 'save',
			title: 'Guardar cambios',
			subtitle: `Estatus: ${selectedStatus.value}`,
			question: '¿Deseas guardar los cambios de esta cita?',
			button: 'Confirmar',
			// Mismo color del header administrativo (spec §4).
			avatarStyle: 'background-color:#691c32',
		},
	}).onOk(async () => {
		saving.value = true
		try {
			await AppointmentCalendarApi.update(selectedId.value, {
				status: selectedStatus.value,
				message: messageInput.value,
			})
			Notify.create({ type: 'positive', message: 'Cambios guardados.' })
			detailOpen.value = false
			await loadEvents()
		} catch {
			Notify.create({ type: 'negative', message: 'No se pudieron guardar los cambios.' })
		} finally {
			saving.value = false
		}
	})
}

// Un bloqueo nuevo/eliminado (alta en el tab "Bloqueos") puede cambiar tanto
// la lista de citas visibles (auto-cancel por traslape, ver
// ScheduleBlockCatalogService) como las franjas "CERRADO" pintadas. Ya no
// hace falta refrescar esto manualmente vía ref: Index.vue ahora desmonta
// este componente al salir del tab "Calendario" (v-if, no q-tab-panels) y lo
// vuelve a montar desde cero al reactivarlo, así que onMounted ya trae los
// bloqueos/citas al día por sí solo.

// loadEvents() ya no se llama aquí: datesSet se dispara también en el
// render inicial de FullCalendar (ver onDatesSet), con el rango real de la
// vista inicial (Mes, ver initial-view="dayGridMonth" en el template).
onMounted(() => {
	loadWorkingHours()
	loadBlocks()
})

// Carga los resultados (día actual + todos los estatus, spec §10) la primera
// vez que se abre el diálogo — no en onMounted, para no disparar una
// petición extra si el admin nunca usa la búsqueda avanzada.
watch(searchDialogOpen, (open) => {
	if (open && searchResults.value.length === 0) runSearch()
})
</script>

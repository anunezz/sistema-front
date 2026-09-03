<template>
	<div class="q-pa-md">
		<q-banner v-if="loadError" class="bg-negative text-white q-mb-md" rounded>
			No se pudieron cargar las citas. Intenta de nuevo.
		</q-banner>

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
				<q-card-section class="row items-center">
					<div class="text-h6">Detalle de la cita</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
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
					/>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn
						color="primary"
						label="Guardar estatus"
						icon="save"
						:loading="savingStatus"
						@click="saveStatus"
					/>
				</q-card-actions>

				<q-separator />

				<!-- MENSAJE PARA EL CLIENTE -->
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
					/>
					<div class="text-caption text-grey-7 q-mt-xs">
						Visible para el cliente al consultar su cita con el folio.
					</div>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn flat label="Cerrar" v-close-popup />
					<q-btn
						color="secondary"
						label="Guardar mensaje"
						icon="chat"
						:loading="savingMessage"
						:disable="!messageInput"
						@click="saveMessage"
					/>
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import ThePlanetCalendar from 'src/components/the_planet/ThePlanetCalendar.vue'
import StatusChip from 'src/components/the_planet/StatusChip.vue'
import {
	AppointmentCalendarApi,
	WorkingHourApi,
	ScheduleBlockApi,
} from 'src/services/administration/agenda/AgendaAdminServices'
import { APPOINTMENT_STATUSES } from 'src/interfaces/agenda'
import type {
	AppointmentCalendarEvent,
	AppointmentStatus,
	ScheduleBlockRecord,
} from 'src/interfaces/agenda'
import { buildCalendarBounds } from 'src/utils/agendaSchedule'

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
const savingStatus = ref(false)
const selectedStart = ref<Date | null>(null)
const selectedEnd = ref<Date | null>(null)
const messageInput = ref('')
const savingMessage = ref(false)

const pad = (n: number) => String(n).padStart(2, '0')

const selectedDay = computed(() => {
	if (!selectedStart.value) return ''
	const d = selectedStart.value
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
})

const selectedTime = computed(() => {
	if (!selectedStart.value || !selectedEnd.value) return ''
	const s = selectedStart.value
	const e = selectedEnd.value
	return `${pad(s.getHours())}:${pad(s.getMinutes())} - ${pad(e.getHours())}:${pad(e.getMinutes())}`
})

const selectedCreatedAt = computed(() => {
	if (!selected.value?.created_at) return ''
	const d = new Date(selected.value.created_at)
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
})

interface FullCalendarClickArg {
	event: {
		id: string
		start: Date
		end: Date
		extendedProps: AppointmentCalendarEvent['extendedProps']
	}
}

const onEventClick = (arg: FullCalendarClickArg) => {
	selectedId.value = arg.event.id
	selected.value = arg.event.extendedProps
	selectedStart.value = arg.event.start
	selectedEnd.value = arg.event.end
	selectedStatus.value = arg.event.extendedProps.status
	messageInput.value = arg.event.extendedProps.admin_message || ''
	detailOpen.value = true
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

const onDatesSet = (arg: DatesSetArg) => {
	visibleRange.value = { start: arg.startStr.slice(0, 10), end: arg.endStr.slice(0, 10) }
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

const saveStatus = async () => {
	if (!selectedId.value || !selectedStatus.value) return

	savingStatus.value = true
	try {
		await AppointmentCalendarApi.updateStatus(selectedId.value, selectedStatus.value)
		Notify.create({ type: 'positive', message: 'Estatus actualizado.' })
		detailOpen.value = false
		await loadEvents()
	} catch {
		Notify.create({ type: 'negative', message: 'No se pudo actualizar el estatus.' })
	} finally {
		savingStatus.value = false
	}
}

// Mensaje del administrador para el cliente — un mensaje vigente por cita,
// se reescribe (ver .claude/skills/agenda/). Visible públicamente al
// consultar la cita por folio.
const saveMessage = async () => {
	if (!selectedId.value || !messageInput.value) return

	savingMessage.value = true
	try {
		await AppointmentCalendarApi.updateMessage(selectedId.value, messageInput.value)
		Notify.create({ type: 'positive', message: 'Mensaje guardado.' })
		await loadEvents()
	} catch {
		Notify.create({ type: 'negative', message: 'No se pudo guardar el mensaje.' })
	} finally {
		savingMessage.value = false
	}
}

// Un bloqueo nuevo/eliminado (alta en el tab "Bloqueos", ver Index.vue) puede
// cambiar tanto la lista de citas visibles (auto-cancel por traslape, ver
// ScheduleBlockCatalogService) como las franjas "CERRADO" pintadas — se
// recargan ambas. Expuesto para que Index.vue lo invoque al cambiar de tab
// (q-tab-panels mantiene este componente montado, no se refresca solo).
const reload = () => {
	loadEvents()
	loadBlocks()
}

defineExpose({ reload })

// loadEvents() ya no se llama aquí: datesSet se dispara también en el
// render inicial de FullCalendar (ver onDatesSet), con el rango real de la
// vista inicial (Mes, ver initial-view="dayGridMonth" en el template).
onMounted(() => {
	loadWorkingHours()
	loadBlocks()
})
</script>

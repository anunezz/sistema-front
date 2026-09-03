<template>
	<q-card class="planet-calendar-card">
		<FullCalendar ref="calendarRef" :options="calendarOptions" />
	</q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

import FullCalendar from '@fullcalendar/vue3'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import esLocale from '@fullcalendar/core/locales/es'

/*
|--------------------------------------------------------------------------
| Props / Emits
|--------------------------------------------------------------------------
| Componente desacoplado: recibe datos por props (con datos de prueba por
| defecto) y notifica interacciones por eventos, listo para conectarse
| más adelante con la API Laravel sin tocar su lógica interna.
*/

const props = defineProps({
	events: {
		type: Array,
		default: () => [
			{
				title: 'Facial Premium',
				start: '2026-05-25T11:00:00',
				end: '2026-05-25T12:00:00',
			},
			{
				title: 'Aplicación de Uñas',
				start: '2026-05-25T13:00:00',
				end: '2026-05-25T14:00:00',
			},
		],
	},

	// Sin horario real cargado aún: sin franja verde de "disponible" (no se
	// asume un horario de negocio por defecto — ver skill agenda §13.5, el
	// horario real siempre viene de WorkingHour vía props, nunca hardcodeado
	// aquí).
	businessHours: {
		type: [Array, Object, Boolean],
		default: () => false,
	},

	// Límites reales del día a mostrar en Vista Día/Semana — derivados del
	// horario de atención configurado (WorkingHour), NUNCA un rango fijo
	// (antes hardcodeado a 11:00-19:00, recortaba configuraciones reales más
	// amplias, ver .claude/skills/agenda/). Los defaults aquí son "todo el
	// día" (sin recorte), no una franja de negocio asumida.
	slotMinTime: {
		type: String,
		default: '00:00:00',
	},

	slotMaxTime: {
		type: String,
		default: '24:00:00',
	},

	// Bloqueos activos (ScheduleBlock, ya en el rango visible) — se pintan
	// como franjas "CERRADO" de fondo (ver calendarOptions). No se calcula
	// disponibilidad aquí: el componente solo pinta lo que ya decidió el
	// backend (AvailabilityService), igual que con "events".
	blocks: {
		type: Array,
		default: () => [],
	},

	// Días de la semana (0=domingo..6=sábado) sin horario de atención activo
	// — se pintan como "CERRADO" en Vista Mes/cabecera de día. Antes
	// hardcodeado solo a domingo; ahora refleja el WorkingHour real.
	closedDaysOfWeek: {
		type: Array,
		default: () => [0],
	},

	// '' = automático (Día, tanto en desktop como en móvil)
	initialView: {
		type: String,
		default: '',
	},

	locale: {
		type: [String, Object],
		default: () => esLocale,
	},

	editable: {
		type: Boolean,
		default: false,
	},

	// Vista pública: sin Anterior/Siguiente (ver más abajo). Calendario
	// administrativo: los agrega, para navegar día a día — siguen acotados
	// al mes actual por el mismo validRange (FullCalendar deshabilita los
	// botones nativamente al llegar a cualquiera de los dos límites).
	showDayNav: {
		type: Boolean,
		default: false,
	},

	// Vista pública (default true, sin cambios): el calendario solo permite
	// reservar dentro de [hoy, fin de mes actual] — ver validRange abajo.
	// Calendario ADMINISTRATIVO (CalendarioTab.vue pasa false): no reserva
	// nada desde aquí (editable=false, sin dateClick de booking), y SÍ
	// necesita ver/gestionar citas ya pasadas (marcar COMPLETADA/NO_SHOW,
	// consultar historial) — con validRange activo, FullCalendar oculta por
	// completo cualquier día y evento anterior a "hoy" (bug real: citas
	// reales con fecha pasada dejaban de mostrarse en el calendario admin
	// aunque sí llegaban correctamente en la prop `events`).
	restrictToCurrentMonth: {
		type: Boolean,
		default: true,
	},
})

const emit = defineEmits([
	'dateClick',
	'eventClick',
	'eventDrop',
	'eventResize',
	'select',
	'datesSet',
])

const calendarRef = ref(null)

const $q = useQuasar()

const isMobile = computed(() => $q.screen.lt.md)

/*
|--------------------------------------------------------------------------
| Configuración de FullCalendar
|--------------------------------------------------------------------------
*/

const today = new Date()

// límite superior de navegación: el calendario es solo para reservar dentro
// del mes actual, así que no se puede avanzar más allá de su primer día
// (límite exclusivo, como espera FullCalendar)
const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)

const pad2 = (n) => String(n).padStart(2, '0')

const toIsoDateLocal = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

// Un día está "CERRADO" si: (a) ese día de la semana no tiene horario de
// atención activo (closedDaysOfWeek, viene de WorkingHour real — antes
// hardcodeado solo a domingo), o (b) existe un bloqueo de día completo
// (ScheduleBlock.all_day=true) para esa fecha exacta — ver
// .claude/skills/agenda/ §2 "Bloqueos de disponibilidad".
function isDayFullyClosed(dateObj) {
	if (props.closedDaysOfWeek.includes(dateObj.getDay())) return true

	const iso = toIsoDateLocal(dateObj)

	return props.blocks.some(
		(block) => block.all_day && String(block.starts_at).slice(0, 10) === iso,
	)
}

const calendarOptions = computed(() => ({
	plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

	locale: props.locale,

	// Vista Día como vista principal, tanto en desktop como en móvil
	initialView: props.initialView || 'timeGridDay',

	initialDate: today,

	// validRange con start Y end: FullCalendar deshabilita "Anterior"/
	// "Siguiente" automáticamente al llegar a cualquiera de los dos límites,
	// y también bloquea gotoDate/next/prev llamados por API o teclado — todo
	// de forma nativa, sin código adicional. start=hoy (no se muestran citas
	// en días ya pasados), end=inicio del mes siguiente (nunca se sale del
	// mes actual). Restricción de RESERVA pública únicamente: el calendario
	// administrativo la desactiva (restrictToCurrentMonth=false) porque
	// oculta también los EVENTOS de días pasados, no solo la navegación —
	// el admin sí necesita ver/gestionar citas ya ocurridas (bug real
	// corregido: citas reales con fecha pasada existían en `events` pero
	// nunca se pintaban).
	...(props.restrictToCurrentMonth ? { validRange: { start: today, end: nextMonthStart } } : {}),

	editable: props.editable,

	businessHours: props.businessHours,

	// Citas reales + bloqueos activos pintados como franjas de fondo
	// "CERRADO" (ver eventDidMount/eventClassNames más abajo) — un solo
	// arreglo de eventos, FullCalendar los distingue por "display".
	events: [
		...props.events,
		...props.blocks.map((block) => ({
			start: String(block.starts_at).replace(' ', 'T'),
			end: String(block.ends_at).replace(' ', 'T'),
			display: 'background',
			classNames: ['fc-block-closed'],
			extendedProps: { reason: block.reason },
		})),
	],

	dayHeaderFormat: {
		weekday: 'short',
		day: 'numeric',
	},

	slotLabelFormat: {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	},

	eventTimeFormat: {
		hour: 'numeric',
		minute: '2-digit',
		meridiem: 'short',
	},

	// Rango real de horas visibles en Vista Día/Semana — viene del horario de
	// atención configurado (WorkingHour, vía props), nunca un límite fijo (ver
	// .claude/skills/agenda/ §13.5: antes hardcodeado a 11:00-19:00, recortaba
	// configuraciones reales más amplias).
	slotMinTime: props.slotMinTime,

	slotMaxTime: props.slotMaxTime,

	allDaySlot: false,

	// Un barbero ya puede tener varias citas activas en el mismo slot
	// exacto (decisión de producto, ver .claude/skills/agenda/) — con
	// slotEventOverlap:true (default de FullCalendar) las citas se pintan
	// apiladas ocupando casi todo el ancho; false las divide en columnas
	// más angostas, una por cita, dentro del mismo slot.
	slotEventOverlap: false,

	nowIndicator: true,

	selectable: true,

	weekends: true,

	// el domingo se muestra (no se oculta) para poder marcarlo como
	// "CERRADO"; businessHours ya lo excluye del horario disponible
	hiddenDays: [],

	// las filas de horario aprovechan toda la altura disponible en vez de
	// quedar con su tamaño mínimo — más lleno y profesional, sobre todo en
	// la Vista Día
	expandRows: true,

	height: isMobile.value ? 650 : 850,

	// Vista pública (showDayNav=false, por defecto): solo Hoy / Día / Semana /
	// Mes — sin "Anterior"/"Siguiente", el calendario no navega fuera del mes
	// actual (ver validRange arriba). Calendario administrativo
	// (showDayNav=true): agrega "Anterior"/"Siguiente" para recorrer los días
	// del mes uno a uno — siguen acotados por el mismo validRange, sin lógica
	// de límites adicional.
	headerToolbar: {
		left: props.showDayNav ? 'prev,next today' : 'today',
		center: 'title',
		right: 'timeGridDay,timeGridWeek,dayGridMonth',
	},

	views: {
		timeGridWeek: {
			visibleRange(currentDate) {
				const start = new Date(currentDate)

				const end = new Date(currentDate)

				start.setHours(0, 0, 0, 0)

				end.setDate(end.getDate() + 6)

				return {
					start,
					end,
				}
			},
		},

		// dayCellDidMount/dayCellContent van SOLO aquí (no en el nivel superior
		// del calendario): antes vivían como hooks globales y también se
		// aplicaban a las columnas de día de la Vista Semana, ocultando
		// (display:none) las columnas anteriores a hoy dentro de la semana
		// actual — eso colapsaba la cuadrícula a 2-3 columnas y rompía por
		// completo el cálculo interno de tamaño de FullCalendar (la grilla
		// desaparecía, solo quedaba visible la barra de herramientas).
		//
		// Los días pasados YA quedan bloqueados de forma nativa por
		// validRange (abajo): FullCalendar les agrega la clase fc-day-disabled,
		// deshabilita su selección/click y desactiva el botón "Anterior" al
		// llegar al límite — no hace falta ocultarlos a mano con JS. Aquí solo
		// queda mostrar el domingo en gris, que sí es específico de esta vista.
		dayGridMonth: {
			fixedWeekCount: false,

			showNonCurrentDates: false,

			dayCellDidMount(info) {
				if (isDayFullyClosed(info.date)) {
					info.el.style.background = 'rgba(120,120,130,0.18)'
				}
			},

			dayCellContent: (arg) => {
				if (isDayFullyClosed(arg.date)) {
					return {
						html: `
              <div style="
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                height:100%;
              ">
                <div>${arg.dayNumberText}</div>

                <div style="
                  color:#9e9e9e;
                  font-size:11px;
                  font-weight:bold;
                  margin-top:4px;
                ">
                  CERRADO
                </div>
              </div>
            `,
					}
				}

				return {
					html: `<div>${arg.dayNumberText}</div>`,
				}
			},
		},
	},

	// Día cerrado (sin horario activo ese día de semana, o bloqueo de día
	// completo) también en la cabecera de día/semana.
	dayHeaderContent: (arg) => {
		if (isDayFullyClosed(arg.date)) {
			return {
				html: `
          <div class="fc-planet-header-closed">
            <div>${arg.text}</div>
            <div class="fc-planet-header-closed-label">CERRADO</div>
          </div>
        `,
			}
		}

		return {
			html: `<div>${arg.text}</div>`,
		}
	},

	// Colorea cada cita real según su estatus (ver
	// .claude/skills/agenda/ §5: PENDIENTE/CONFIRMADA/CANCELADA/COMPLETADA/
	// NO_SHOW) — mismas clases en vista pública y administrativa, un solo
	// punto de verdad de color (ver <style> más abajo). Los eventos de fondo
	// (bloqueos) no llevan estatus, se excluyen.
	eventClassNames(arg) {
		if (arg.event.display === 'background') return []

		const status = arg.event.extendedProps?.status

		return status ? [`fc-status-${String(status).toLowerCase()}`] : []
	},

	eventDidMount(arg) {
		if (arg.event.display === 'background') {
			const label = document.createElement('div')

			label.className = 'fc-block-closed-label'

			// "CERRADO" + motivo real del bloqueo (spec §2/§3) — nunca un
			// texto genérico cuando sí hay un motivo capturado.
			const reason = arg.event.extendedProps?.reason
			label.textContent = reason ? `CERRADO - ${reason}` : 'CERRADO'

			arg.el.appendChild(label)
			return
		}

		// Citas más angostas (varias en el mismo slot, ver
		// slotEventOverlap:false): el texto puede truncarse visualmente —
		// un tooltip nativo (title) conserva la info completa al pasar el
		// mouse, sin depender del ancho disponible.
		const status = arg.event.extendedProps?.status
		// "reason" (calendario público) o "admin_message" (calendario
		// administrativo, ya trae el mensaje/motivo sin filtrar por
		// estatus) — mismo campo real (admin_message en backend), distinto
		// nombre según el resource (ver PublicAppointmentCalendarResource
		// vs AppointmentCalendarResource).
		const reason = arg.event.extendedProps?.reason ?? arg.event.extendedProps?.admin_message
		const parts = [arg.event.title]
		if (status === 'CANCELADA' && reason) parts.push(`Motivo: ${reason}`)
		arg.el.setAttribute('title', parts.join(' — '))
	},

	dateClick(arg) {
		emit('dateClick', arg)
	},

	eventClick(arg) {
		emit('eventClick', arg)
	},

	eventDrop(arg) {
		emit('eventDrop', arg)
	},

	eventResize(arg) {
		emit('eventResize', arg)
	},

	select(arg) {
		emit('select', arg)
	},

	// Rango de fechas REALMENTE visible tras cada navegación (cambio de
	// vista, Anterior/Siguiente, ir a una fecha) — el calendario
	// administrativo lo usa para volver a consultar las citas de ese rango
	// exacto (ver CalendarioTab.vue), en vez de asumir "el mes en curso al
	// montar el componente" como antes (bug real: nunca se pedían las citas
	// de meses/días fuera de ese cálculo fijo).
	datesSet(arg) {
		emit('datesSet', arg)
	},
}))

defineExpose({
	calendarRef,
})
</script>

<style scoped>
.planet-calendar-card {
	background: rgba(255, 255, 255, 0.04);
	border-radius: 24px;
	padding: 15px;
	overflow: hidden;
	max-width: 100%;
}

.planet-calendar-card :deep(.fc) {
	color: white;
	width: 100%;
}

/* red de seguridad: si el harness llegara a desbordar, scrollea dentro del
   calendario (nunca en la página). No se usa la opción dayMinWidth de
   FullCalendar para forzar columnas angostas a un ancho mínimo real: requiere
   el plugin @fullcalendar/scrollgrid (no instalado); sin él, dayMinWidth
   rompe el render por completo con "Error: No ScrollGrid implementation".
   Sin esa dependencia, las columnas de la Vista Semana simplemente se
   angostan de forma proporcional en pantallas chicas — no hay forma nativa
   de evitarlo sin ese plugin. */
.planet-calendar-card :deep(.fc-view-harness) {
	overflow-x: auto;
}

.planet-calendar-card :deep(.fc-theme-standard) td,
.planet-calendar-card :deep(.fc-theme-standard) th,
.planet-calendar-card :deep(.fc-theme-standard) .fc-scrollgrid {
	border-color: rgba(255, 255, 255, 0.08);
}

.planet-calendar-card :deep(.fc-toolbar-title) {
	color: #d4af37;
}

.planet-calendar-card :deep(.fc-toolbar) {
	flex-wrap: wrap;
	gap: 10px;
}

.planet-calendar-card :deep(.fc-button) {
	background: #c2185b !important;
	border: none !important;
	text-transform: capitalize;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

.planet-calendar-card :deep(.fc-button:hover) {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(233, 30, 99, 0.35);
}

.planet-calendar-card :deep(.fc-button-active) {
	background: #e91e63 !important;
}

.planet-calendar-card :deep(.fc-timegrid-slot-label) {
	color: #d4af37;
	font-weight: bold;
}

/* Disponible: horario dentro del negocio (fondo base de los slots de
   Día/Semana). Verde suave pero con suficiente contraste para distinguirse
   a simple vista del resto de estados. */
.planet-calendar-card :deep(.fc-timegrid-col) {
	background: rgba(76, 175, 80, 0.16);
}

/* Fuera de horario laboral / domingo cerrado — bien oscuro para que
   contraste con el verde de "disponible" */
.planet-calendar-card :deep(.fc-non-business) {
	background: rgba(45, 45, 52, 0.85) !important;
}

/* Vista Mes: solo el mes actual — los días de meses adyacentes quedan
   invisibles y sin interacción, pero SIGUEN ocupando su celda en la
   cuadrícula (visibility, no display:none) para no repetir el problema
   que colapsó la Vista Semana */
.planet-calendar-card :deep(.fc-day-other) {
	visibility: hidden;
	pointer-events: none;
}

/* Días/horarios pasados: FullCalendar los marca así automáticamente por
   validRange (bloquea navegación, click y selección de forma nativa) */
.planet-calendar-card :deep(.fc-day-disabled) {
	background: rgba(30, 30, 34, 0.75) !important;
	opacity: 0.55;
}

.planet-calendar-card :deep(.fc-slot-disabled) {
	background: rgba(30, 30, 34, 0.75) !important;
}

/* Hoy: resaltado con el dorado de la marca, distinto del verde de
   "disponible" y del gris de "cerrado/pasado". Va después para ganar el
   empate de especificidad contra fc-timegrid-col/fc-daygrid-day. */
.planet-calendar-card :deep(.fc-day-today) {
	background: rgba(212, 175, 55, 0.16) !important;
}

/* Ocupado: eventos ya reservados — el color real lo da la clase de estatus
   de abajo (fc-status-*, ver eventClassNames), esto es solo la forma base. */
.planet-calendar-card :deep(.fc-event) {
	border: none !important;
	border-radius: 10px;
}

/* Colores por estatus de cita — consistentes en vista pública y
   administrativa (mismo componente, ver .claude/skills/agenda/ §5):
   PENDIENTE=amarillo, CONFIRMADA=verde, CANCELADA=rojo, COMPLETADA=azul,
   NO_SHOW=morado (distinguible de los 4 anteriores). */
.planet-calendar-card :deep(.fc-status-pendiente) {
	background: linear-gradient(135deg, #f9a825, #ffca28) !important;
	color: #212121 !important;
}

.planet-calendar-card :deep(.fc-status-pendiente) .fc-event-time,
.planet-calendar-card :deep(.fc-status-pendiente) .fc-event-title {
	color: #212121 !important;
}

.planet-calendar-card :deep(.fc-status-confirmada) {
	background: linear-gradient(135deg, #2e7d32, #66bb6a) !important;
}

.planet-calendar-card :deep(.fc-status-cancelada) {
	background: linear-gradient(135deg, #c62828, #e57373) !important;
}

.planet-calendar-card :deep(.fc-status-completada) {
	background: linear-gradient(135deg, #1565c0, #64b5f6) !important;
}

.planet-calendar-card :deep(.fc-status-no_show) {
	background: linear-gradient(135deg, #6a1b9a, #ab47bc) !important;
}

/* Bloqueo (ScheduleBlock activo) pintado como franja de fondo "CERRADO" —
   distinta de "fuera de horario" (fc-non-business) para no confundir un
   bloqueo puntual con la ausencia de horario configurado. */
.planet-calendar-card :deep(.fc-block-closed) {
	background: repeating-linear-gradient(
		45deg,
		rgba(66, 66, 70, 0.6),
		rgba(66, 66, 70, 0.6) 10px,
		rgba(40, 40, 44, 0.6) 10px,
		rgba(40, 40, 44, 0.6) 20px
	) !important;
}

.planet-calendar-card :deep(.fc-block-closed-label) {
	position: absolute;
	top: 2px;
	left: 4px;
	font-size: 10px;
	font-weight: bold;
	letter-spacing: 0.5px;
	color: #e0e0e0;
	pointer-events: none;
}

/* Hora actual: línea muy visible */
.planet-calendar-card :deep(.fc-timegrid-now-indicator-line) {
	border-color: #ff1744;
	border-width: 2px;
}

.planet-calendar-card :deep(.fc-timegrid-now-indicator-arrow) {
	border-color: #ff1744;
	color: #ff1744;
}

.planet-calendar-card :deep(.fc-planet-header-closed) {
	display: flex;
	flex-direction: column;
	align-items: center;
	line-height: 1.3;
}

.planet-calendar-card :deep(.fc-planet-header-closed-label) {
	color: #9e9e9e;
	font-size: 10px;
	font-weight: bold;
}

/* RESPONSIVE */

@media (max-width: 768px) {
	.planet-calendar-card :deep(.fc) {
		font-size: 11px;
	}

	.planet-calendar-card :deep(.fc-toolbar) {
		flex-direction: column;
		gap: 10px;
	}

	.planet-calendar-card :deep(.fc-toolbar-title) {
		font-size: 16px !important;
	}

	.planet-calendar-card :deep(.fc-button) {
		padding: 5px 8px !important;
		font-size: 10px !important;
	}
}
</style>

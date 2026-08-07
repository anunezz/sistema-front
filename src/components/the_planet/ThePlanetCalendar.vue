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
        end: '2026-05-25T12:00:00'
      },
      {
        title: 'Aplicación de Uñas',
        start: '2026-05-25T13:00:00',
        end: '2026-05-25T14:00:00'
      }
    ]
  },

  businessHours: {
    type: [Array, Object, Boolean],
    default: () => [
      {
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: '11:00',
        endTime: '19:00'
      }
    ]
  },

  // '' = automático (Día, tanto en desktop como en móvil)
  initialView: {
    type: String,
    default: ''
  },

  locale: {
    type: [String, Object],
    default: () => esLocale
  },

  editable: {
    type: Boolean,
    default: false
  }

})

const emit = defineEmits([
  'dateClick',
  'eventClick',
  'eventDrop',
  'eventResize',
  'select'
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

const calendarOptions = computed(() => ({

  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
  ],

  locale: props.locale,

  // Vista Día como vista principal, tanto en desktop como en móvil
  initialView: props.initialView || 'timeGridDay',

  initialDate: today,

  // validRange con start Y end: FullCalendar deshabilita "Anterior"/
  // "Siguiente" automáticamente al llegar a cualquiera de los dos límites,
  // y también bloquea gotoDate/next/prev llamados por API o teclado — todo
  // de forma nativa, sin código adicional. start=hoy (no se muestran citas
  // en días ya pasados), end=inicio del mes siguiente (nunca se sale del
  // mes actual).
  validRange: {
    start: today,
    end: nextMonthStart
  },

  editable: props.editable,

  businessHours: props.businessHours,

  events: props.events,

  dayHeaderFormat: {
    weekday: 'short',
    day: 'numeric'
  },

  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  },

  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short'
  },

  // Horario del negocio: Lunes a Sábado 11:00-19:00, Domingo cerrado.
  // Restringir slotMinTime/slotMaxTime evita mostrar horarios inexistentes.
  slotMinTime: '11:00:00',

  slotMaxTime: '19:00:00',

  allDaySlot: false,

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

  height: isMobile.value
    ? 650
    : 850,

  // solo Hoy / Día / Semana / Mes — sin "Anterior"/"Siguiente": el
  // calendario no navega fuera del mes actual (ver validRange arriba), así
  // que esos botones no tienen ningún destino al que llevar al usuario
  headerToolbar: {
    left: 'today',
    center: 'title',
    right: 'timeGridDay,timeGridWeek,dayGridMonth'
  },

  views: {

    timeGridWeek: {

      visibleRange(currentDate) {

        const start = new Date(currentDate)

        const end = new Date(currentDate)

        start.setHours(0,0,0,0)

        end.setDate(end.getDate() + 6)

        return {
          start,
          end
        }

      }

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

        if (info.date.getDay() === 0) {

          info.el.style.background =
            'rgba(120,120,130,0.18)'

        }

      },

      dayCellContent: (arg) => {

        const isSunday = arg.date.getDay() === 0

        if (isSunday) {

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
            `
          }

        }

        return {
          html: `<div>${arg.dayNumberText}</div>`
        }

      }

    }

  },

  // Domingo cerrado también en la cabecera de día/semana
  dayHeaderContent: (arg) => {

    const isSunday = arg.date.getDay() === 0

    if (isSunday) {

      return {
        html: `
          <div class="fc-planet-header-closed">
            <div>${arg.text}</div>
            <div class="fc-planet-header-closed-label">CERRADO</div>
          </div>
        `
      }

    }

    return {
      html: `<div>${arg.text}</div>`
    }

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

  }

}))

defineExpose({
  calendarRef
})

</script>

<style scoped>

.planet-calendar-card {
  background: rgba(255,255,255,0.04);
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
  border-color: rgba(255,255,255,0.08);
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.planet-calendar-card :deep(.fc-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(233,30,99,0.35);
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

/* Ocupado: eventos ya reservados */
.planet-calendar-card :deep(.fc-event) {
  background:
    linear-gradient(
      135deg,
      #c62828,
      #e57373
    ) !important;
  border: none !important;
  border-radius: 10px;
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

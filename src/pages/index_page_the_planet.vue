<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="header-glass">

      <q-toolbar class="q-px-lg">

        <div class="row items-center">

			<img
			src="~/src/assets/The_planet/Th3eplanet.png"
			class="logo-mini"
			/>

          <div class="q-ml-md">

            <div class="text-h6 text-weight-bold text-gold">
              THE PLANET STUDIO
            </div>

            <div class="text-caption text-pink-2">
              Estética & Peluquería
            </div>

          </div>

        </div>

        <q-space />

        <div class="desktop-menu">

			<q-btn
			flat
			label="Inicio"
			class="menu-btn"
			@click="scrollToSection('inicio')"
			/>

			<q-btn
			flat
			label="Servicios"
			class="menu-btn"
			@click="scrollToSection('servicios')"
			/>

			<q-btn
			flat
			label="Agenda"
			class="menu-btn"
			@click="scrollToSection('agenda')"
			/>

			<q-btn
			flat
			label="Productos"
			class="menu-btn"
			@click="scrollToSection('productos')"
			/>

			<q-btn
			flat
			label="Contacto"
			class="menu-btn"
			@click="scrollToSection('contacto')"
			/>

        </div>

		<q-btn
			color="pink-6"
			rounded
			unelevated
			label="Agendar Cita"
			icon="event"
			@click="showReservationModal = true"
		/>

      </q-toolbar>

    </q-header>

    <q-page-container>

	<!-- MODAL RESERVA -->

	<q-dialog v-model="showReservationModal">

	<q-card
		class="reservation-modal"
		style="min-width:350px; max-width:500px; width:100%;"
	>

		<q-card-section class="row items-center q-pb-none">

		<div class="text-h5 text-gold text-weight-bold">
			Reservar Cita
		</div>

		<q-space />

		<q-btn
			icon="close"
			flat
			round
			dense
			v-close-popup
		/>

		</q-card-section>

		<q-card-section>

		<div class="q-gutter-md">

			<!-- NOMBRE -->

			<q-input
			outlined
			dark
			color="pink"
			v-model="reservationForm.name"
			label="Nombre"
			prepend-icon="person"
			/>

			<!-- FECHA -->

			<q-input
			outlined
			dark
			color="pink"
			v-model="reservationForm.date"
			label="Día de reserva"
			prepend-icon="event"
			>

			<template v-slot:append>

				<q-icon
				name="event"
				class="cursor-pointer"
				>

				<q-popup-proxy
					cover
					transition-show="scale"
					transition-hide="scale"
				>

				<q-date
				v-model="reservationForm.date"
				mask="DD-MM-YYYY"
				color="pink"
				:options="disablePastDates"
				/>

				</q-popup-proxy>

				</q-icon>

			</template>

			</q-input>

			<!-- HORA -->

			<q-input
			outlined
			dark
			color="pink"
			v-model="reservationForm.hour"
			label="Hora"
			prepend-icon="schedule"
			>

			<template v-slot:append>

				<q-icon
				name="schedule"
				class="cursor-pointer"
				>

				<q-popup-proxy
					cover
					transition-show="scale"
					transition-hide="scale"
				>

					<q-time
					v-model="reservationForm.hour"
					format24h
					color="pink"
					/>

				</q-popup-proxy>

				</q-icon>

			</template>

			</q-input>

			<!-- SERVICIO -->

			<q-select
			outlined
			dark
			color="pink"
			v-model="reservationForm.service"
			label="Servicio"
			:options="[
				'Peluquería',
				'Belleza',
				'Masajes',
				'Terapias',
				'Faciales'
			]"
			/>

		</div>

		</q-card-section>

		<q-card-actions align="right">

		<q-btn
			flat
			label="Cancelar"
			color="grey"
			v-close-popup
		/>

		<q-btn
			unelevated
			color="pink-6"
			label="Guardar Reserva"
			icon="event_available"
			@click="saveReservation"
		/>

		</q-card-actions>

	</q-card>

	</q-dialog>


      <q-page class="bg-dark-page">

        <!-- HERO -->

        <section id="inicio" class="hero-section">

          <div class="hero-overlay"></div>

          <div class="hero-content">

            <img
              src="~/src/assets/The_planet/The_planert_logo.png"
              class="hero-logo"
            />

            <div class="text-h2 text-weight-bold text-gold text-center">
              THE PLANET STUDIO
            </div>

            <div class="text-h5 text-pink-2 text-center q-mt-sm">
              Estética y Peluquería
            </div>

            <div class="text-subtitle1 text-grey-3 text-center q-mt-md">
              Belleza • Terapias • Masajes • Productos • Wellness
            </div>

            <q-btn
              class="q-mt-xl"
              color="pink-6"
              rounded
              unelevated
              size="lg"
              icon="spa"
              label="Reservar Ahora"
			  @click="showReservationModal = true"
            />

          </div>

        </section>

        <!-- SERVICIOS -->

		<ServicesSection />


        <!-- CALENDARIO -->

        <section class="q-pa-lg q-pa-xl-md">

          <div class="text-center q-mb-xl">

            <div id="agenda" class="text-h3 text-weight-bold text-gold">
              Agenda Tu Cita
            </div>

            <div class="text-subtitle1 text-grey-5 q-mt-sm">
              Consulta horarios disponibles.
            </div>

          </div>

          <q-card class="calendar-card">

            <FullCalendar :options="calendarOptions" />

          </q-card>

        </section>

        <!-- FOOTER -->

        <footer class="footer-section">

          <div class="footer-grid">

            <div>

              <div class="text-h5 text-gold text-weight-bold">
                THE PLANET STUDIO
              </div>

              <div class="text-grey-5 q-mt-sm">
                Estética y peluquería premium.
              </div>

            </div>

            <div>

              <div class="text-h6 text-pink-3">
                Contacto
              </div>

              <div class="text-grey-5 q-mt-md">
                📍 Sahuayo 76, Janitzio
              </div>

              <div class="text-grey-5">
                📧 ricknatureye@yahoo.com
              </div>

            </div>

          </div>

        </footer>

      </q-page>

    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import ServicesSection from 'src/components/the_planet/ServicesSection.vue'

import FullCalendar from '@fullcalendar/vue3'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import esLocale from '@fullcalendar/core/locales/es'

const $q = useQuasar()

const isMobile = computed(() => $q.screen.lt.md)
const showReservationModal = ref(false)
const reservationForm = ref({
  name: '',
  date: '',
  hour: '',
  service: ''
})

function saveReservation() {

  console.log('Reserva guardada:', reservationForm.value)

  showReservationModal.value = false

}

function disablePastDates(date) {

  const today = new Date()

  const year = today.getFullYear()

  const month = String(today.getMonth() + 1).padStart(2, '0')

  const day = String(today.getDate()).padStart(2, '0')

  const currentDate = `${year}/${month}/${day}`

  return date >= currentDate

}

function scrollToSection(id) {

  const element = document.getElementById(id)

  if (element) {

    element.scrollIntoView({
      behavior: 'smooth'
    })

  }

}

/*
=====================================
AQUI PEGA EL NUEVO calendarOptions
=====================================
*/
const today = new Date()

const calendarOptions = computed(() => ({

  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
  ],

  locale: esLocale,

  initialView: 'timeGridDay',

  initialDate: today,

  validRange: {
    start: today
  },

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

  slotMinTime: '11:00:00',

  slotMaxTime: '19:00:00',

  allDaySlot: false,

  nowIndicator: true,

  selectable: true,

  editable: false,

  weekends: true,

  height: isMobile.value
    ? 650
    : 850,

  businessHours: [
    {
      daysOfWeek: [1,2,3,4,5,6],
      startTime: '11:00',
      endTime: '19:00'
    }
  ],

  headerToolbar: isMobile.value
    ? {
        left: 'title',
        center: '',
        right: 'timeGridDay'
      }
    : {
        left: 'prev,next today',
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

    dayGridMonth: {

      fixedWeekCount: false,

      showNonCurrentDates: false

    }

  },

  dayCellDidMount(info) {

    const cellDate = new Date(info.date)

    const now = new Date()

    now.setHours(0,0,0,0)

    if (cellDate < now) {

      info.el.style.display = 'none'

    }

    if (cellDate.getDay() === 0) {

      info.el.style.background =
        'rgba(255,64,129,0.08)'

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
              color:#ff4081;
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

  },

  events: [

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

}))



</script>

<style scoped>

body {
  background: #060606;
}

.bg-dark-page {
  background:
    radial-gradient(circle at top,
      rgba(255,105,180,0.12),
      #060606 45%);
}

/* HEADER */

.header-glass {
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.logo-mini {
  width: 55px;
  height: 55px;
  border-radius: 50%;
}

.text-gold {
  color: #d4af37;
}

.menu-btn {
  color: white;
  margin-right: 10px;
}

.desktop-menu {
  display: flex;
  margin-right: 20px;
}

/* HERO */

.hero-section {
  position: relative;
  min-height: 700px;

  background-image:
    url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop');

  background-size: cover;
  background-position: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0,0,0,0.82),
      rgba(91,22,45,0.45)
    );
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-logo {
  width: 190px;
  height: 190px;
  object-fit: contain;
  margin: auto;
  display: block;
  filter: drop-shadow(0 0 20px rgba(212,175,55,0.45));
}

/* SERVICES */

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.service-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  color: white;
}

/* ABOUT */

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.about-image {
  width: 100%;
  border-radius: 24px;
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
}

.features-list {
  margin-top: 20px;
  color: #ddd;
}

.features-list li {
  margin-bottom: 10px;
}

/* CALENDAR */

.calendar-card {
  background: rgba(255,255,255,0.04);
  border-radius: 24px;
  padding: 15px;
  overflow: hidden;
}

.fc {
  color: white;
  width: 100%;
}

.fc-theme-standard td,
.fc-theme-standard th,
.fc-theme-standard .fc-scrollgrid {
  border-color: rgba(255,255,255,0.08);
}

.fc-toolbar-title {
  color: #d4af37;
}

.fc-button {
  background: #c2185b !important;
  border: none !important;
}

.fc-event {
  border: none;
  border-radius: 10px;
  background: #ad1457;
}

/* FOOTER */

.footer-section {
  margin-top: 80px;
  padding: 40px;
  background: rgba(0,0,0,0.85);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* RESPONSIVE */

@media (max-width: 768px) {

  .desktop-menu {
    display: none;
  }

  .hero-section {
    min-height: 600px;
    padding: 20px;
  }

  .hero-logo {
    width: 130px;
    height: 130px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .fc {
    font-size: 11px;
  }

  .fc-toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .fc-toolbar-title {
    font-size: 16px !important;
  }

  .fc-button {
    padding: 5px 8px !important;
    font-size: 10px !important;
  }

}


.about-carousel {
  border-radius: 30px;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(0,0,0,0.45),
    0 0 20px rgba(212,175,55,0.12);
}

.about-carousel .q-carousel__slide {
  background-size: cover;
  background-position: center;
}

@media (max-width: 768px) {

  .about-carousel {
    height: 350px !important;
  }

}

.fc-timegrid-slot-label {
  color: #d4af37;
  font-weight: bold;
}

.fc-event {
  background:
    linear-gradient(
      135deg,
      #ad1457,
      #e91e63
    ) !important;

  border: none !important;

  border-radius: 12px;
}


html {
  scroll-behavior: smooth;
}

.reservation-modal {

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,0.98),
      rgba(40,40,40,0.95)
    );

  color: white;

  border-radius: 24px;

  border: 1px solid rgba(255,255,255,0.08);

  backdrop-filter: blur(18px);

  box-shadow:
    0 0 40px rgba(0,0,0,0.45),
    0 0 20px rgba(212,175,55,0.15);

}



.carousel-overlay {

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0,0,0,0.72),
      rgba(0,0,0,0.25)
    );

}

.carousel-content {

  position: absolute;

z-index: 2;

  left: 50px;
  bottom: 60px;

  max-width: 500px;

  pointer-events: none;

}

@media (max-width: 768px) {

  .carousel-content {

    left: 20px;
    right: 20px;
    bottom: 30px;

  }

}

</style>

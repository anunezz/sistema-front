<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="header-glass">

      <q-toolbar class="q-px-md q-px-lg-lg toolbar-responsive">

        <div class="row items-center">

			<img
			src="~/src/assets/The_planet/Th3eplanet.png"
			class="logo-mini"
			/>

          <div class="q-ml-md">

            <div class="text-h6 text-weight-bold text-gold brand-title">
              THE PLANET STUDIO
            </div>

            <div class="text-caption text-pink-2 brand-subtitle">
              Estética & Peluquería
            </div>

          </div>

        </div>

        <q-space />

        <div class="desktop-menu">

			<q-btn
			v-for="item in menuItems"
			:key="item.id"
			flat
			:label="item.label"
			class="menu-btn"
			:class="{ 'menu-btn-active': activeSection === item.id }"
			@click="goToSection(item.id)"
			/>

        </div>

		<q-btn
			color="pink-6"
			rounded
			unelevated
			label="Agendar Cita"
			icon="event"
			class="cta-header-btn"
			@click="showReservationModal = true"
		/>

		<q-btn
			flat
			round
			dense
			icon="menu"
			color="white"
			class="mobile-menu-btn"
			aria-label="Abrir menú"
			@click="drawerOpen = true"
		/>

      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="drawerOpen"
      side="right"
      overlay
      bordered
      dark
      behavior="mobile"
      class="mobile-drawer"
      :width="300"
    >

      <div class="column full-height no-wrap drawer-inner">

        <!-- ENCABEZADO -->

        <div class="row items-center no-wrap q-pa-md drawer-header">

          <img
            src="~/src/assets/The_planet/Th3eplanet.png"
            class="logo-mini drawer-logo"
          />

          <div class="q-ml-md drawer-brand">
            <div class="text-subtitle1 text-weight-bold text-gold drawer-brand-title">
              THE PLANET STUDIO
            </div>
            <div class="text-caption text-pink-2 drawer-brand-subtitle">
              Estética & Peluquería
            </div>
          </div>

          <q-space />

          <q-btn
            icon="close"
            flat
            round
            dense
            color="white"
            class="drawer-close-btn"
            aria-label="Cerrar menú"
            @click="drawerOpen = false"
          />

        </div>

        <q-separator class="drawer-separator" />

        <!-- NAVEGACIÓN -->

        <q-list class="q-mt-sm drawer-list">

          <q-item
            v-for="item in menuItems"
            :key="item.id"
            clickable
            v-ripple
            class="drawer-item"
            :class="{ 'drawer-item-active': activeSection === item.id }"
            @click="goToSection(item.id)"
          >
            <q-item-section avatar class="drawer-item-icon">
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section class="drawer-item-label">
              {{ item.label }}
            </q-item-section>
            <q-item-section
              v-if="activeSection === item.id"
              side
            >
              <q-icon name="fiber_manual_record" size="8px" color="pink-4" />
            </q-item-section>
          </q-item>

        </q-list>

        <q-space />

        <q-separator class="drawer-separator" />

        <!-- CTA -->

        <div class="q-pa-md drawer-cta-wrap">

          <q-btn
            color="pink-6"
            rounded
            unelevated
            label="Agendar Cita"
            icon="event"
            class="full-width drawer-cta-btn"
            @click="openReservationFromDrawer"
          />

        </div>

      </div>

    </q-drawer>

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

            <div class="text-weight-bold text-gold text-center hero-title">
              THE PLANET STUDIO
            </div>

            <div class="text-pink-2 text-center q-mt-sm hero-subtitle">
              Estética y Peluquería
            </div>

            <div class="text-grey-3 text-center q-mt-md hero-tagline">
              Belleza • Terapias • Masajes • Productos • Wellness
            </div>

            <q-btn
              class="q-mt-xl hero-cta"
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

		<div id="servicios-anchor">

			<ServicesSection />

		</div>

        <!-- PRODUCTOS -->

        <section id="productos" class="q-pa-md q-pa-md-xl products-section">

          <div class="text-center q-mb-xl">

            <div class="text-weight-bold text-gold section-title">
              Nuestros Productos
            </div>

            <div class="text-grey-5 q-mt-sm section-subtitle">
              Línea profesional para el cuidado de tu belleza.
            </div>

          </div>

          <div class="products-chips">

            <q-chip
              v-for="product in productItems"
              :key="product"
              color="pink-6"
              text-color="white"
              class="product-chip"
            >
              {{ product }}
            </q-chip>

          </div>

        </section>

        <!-- CALENDARIO -->

        <section id="agenda" class="q-pa-md q-pa-md-xl calendar-section">

          <div class="text-center q-mb-xl">

            <div class="text-weight-bold text-gold section-title">
              Agenda Tu Cita
            </div>

            <div class="text-grey-5 q-mt-sm section-subtitle">
              Consulta horarios disponibles.
            </div>

          </div>

          <ThePlanetCalendar
            :events="calendarEvents"
            @date-click="handleCalendarDateClick"
            @event-click="handleCalendarEventClick"
            @event-drop="handleCalendarEventDrop"
            @event-resize="handleCalendarEventResize"
            @select="handleCalendarSelect"
          />

        </section>

        <!-- FOOTER -->

        <footer id="contacto" class="footer-section">

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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ServicesSection from 'src/components/the_planet/ServicesSection.vue'
import ThePlanetCalendar from 'src/components/the_planet/ThePlanetCalendar.vue'

const planetLogo = new URL('../assets/The_planet/Th3eplanet.png', import.meta.url).href

const showReservationModal = ref(false)
const drawerOpen = ref(false)
const activeSection = ref('inicio')
const reservationForm = ref({
  name: '',
  date: '',
  hour: '',
  service: ''
})

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'servicios', label: 'Servicios', icon: 'spa' },
  { id: 'productos', label: 'Productos', icon: 'shopping_bag' },
  { id: 'agenda', label: 'Agenda', icon: 'event' },
  { id: 'contacto', label: 'Contacto', icon: 'mail' }
]

const productItems = [
  'Shampoo Premium',
  'Aceites Esenciales',
  'Cremas Faciales',
  'Kits de Belleza'
]

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

const HEADER_OFFSET = 96

// "servicios" carga su contenido async (ver ServicesSection.vue) y reemplaza
// su nodo raíz al terminar; #servicios-anchor envuelve ese componente en este
// archivo y nunca se reemplaza, así que sirve como blanco estable de scroll/observer.
const SECTION_ANCHORS = {
  servicios: 'servicios-anchor'
}

function getSectionElement(id) {

  return document.getElementById(SECTION_ANCHORS[id] || id)

}

function scrollToSection(id) {

  const element = getSectionElement(id)

  if (!element) {

    return

  }

  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

  window.scrollTo({
    top,
    behavior: 'smooth'
  })

}

function goToSection(id) {

  // en móvil, Quasar bloquea el scroll del body mientras el Drawer está
  // abierto (clase body--prevent-scroll); si se hace scroll ANTES de cerrar
  // el Drawer, window.scrollTo no tiene efecto porque el body sigue
  // bloqueado. Por eso primero se cierra el Drawer y se espera al siguiente
  // tick (ya con el bloqueo liberado) antes de iniciar el scroll.
  drawerOpen.value = false

  nextTick(() => {

    scrollToSection(id)

  })

}

function openReservationFromDrawer() {

  drawerOpen.value = false

  showReservationModal.value = true

}

// favicon + título de pestaña (solo visual, no altera lógica del sistema)
function applyPlanetFavicon() {

  document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove())

  const link = document.createElement('link')

  link.rel = 'icon'

  link.type = 'image/png'

  link.href = planetLogo

  document.head.appendChild(link)

}

// resalta la opción del menú según la sección visible en pantalla.
//
// nota: se probó primero con IntersectionObserver (rootMargin + ratios),
// pero durante un scroll animado (el que dispara scrollToSection al hacer
// clic en el menú) el navegador deja de emitir callbacks del observer antes
// de que el scroll termine, dejando el estado activo desactualizado — se
// confirmó instrumentando el observer real en el navegador. Un listener de
// scroll con recálculo geométrico no depende de esos callbacks: se ejecuta
// en cada evento de scroll (manual o animado) y siempre refleja la posición
// real, así que es la técnica que efectivamente funciona aquí.
let scrollRafId = null

function computeActiveSection() {

  let bestId = menuItems[0].id
  let bestTop = -Infinity

  menuItems.forEach((item) => {

    const el = getSectionElement(item.id)

    if (!el) {

      return

    }

    const top = el.getBoundingClientRect().top

    if (top <= HEADER_OFFSET + 1 && top > bestTop) {

      bestTop = top
      bestId = item.id

    }

  })

  // cerca del final de la página una sección corta (p.ej. "contacto") puede
  // no alcanzar nunca la línea del header porque ya no queda más scroll —
  // en ese caso se promueve igual, pero solo si realmente ocupa una porción
  // relevante de la pantalla (si apenas asoma, la anterior sigue siendo la
  // que el usuario está viendo de verdad).
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

  if (atBottom) {

    const lastItem = menuItems[menuItems.length - 1]
    const lastEl = getSectionElement(lastItem.id)

    if (lastEl) {

      const rect = lastEl.getBoundingClientRect()
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, HEADER_OFFSET)
      const availableHeight = window.innerHeight - HEADER_OFFSET

      if (visibleHeight >= availableHeight * 0.35) {

        bestId = lastItem.id

      }

    }

  }

  activeSection.value = bestId

}

function onWindowScroll() {

  if (scrollRafId !== null) {

    return

  }

  scrollRafId = requestAnimationFrame(() => {

    computeActiveSection()

    scrollRafId = null

  })

}

onMounted(() => {

  document.title = 'THE PLANET STUDIO'

  applyPlanetFavicon()

  computeActiveSection()

  window.addEventListener('scroll', onWindowScroll, { passive: true })

})

onBeforeUnmount(() => {

  window.removeEventListener('scroll', onWindowScroll)

  if (scrollRafId !== null) {

    cancelAnimationFrame(scrollRafId)

  }

})

/*
|--------------------------------------------------------------------------
| Calendario (ThePlanetCalendar)
|--------------------------------------------------------------------------
| Datos de prueba por ahora; el punto de conexión con la API Laravel es
| reemplazar calendarEvents por el resultado del endpoint correspondiente.
| El resto de la lógica de FullCalendar vive dentro del componente.
*/
const calendarEvents = ref([
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
])

function handleCalendarDateClick(arg) {

  console.log('dateClick:', arg)

}

function handleCalendarEventClick(arg) {

  console.log('eventClick:', arg)

}

function handleCalendarEventDrop(arg) {

  console.log('eventDrop:', arg)

}

function handleCalendarEventResize(arg) {

  console.log('eventResize:', arg)

}

function handleCalendarSelect(arg) {

  console.log('select:', arg)

}

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
  overflow-x: hidden;
}

/* HEADER */

.header-glass {
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.toolbar-responsive {
  min-height: 64px;
  flex-wrap: nowrap;
}

.logo-mini {
  width: clamp(38px, 6vw, 55px);
  height: clamp(38px, 6vw, 55px);
  border-radius: 50%;
  flex-shrink: 0;
}

.brand-title {
  font-size: clamp(0.85rem, 2.4vw, 1.25rem);
  white-space: nowrap;
}

.brand-subtitle {
  white-space: nowrap;
}

.text-gold {
  color: #d4af37;
}

.menu-btn {
  color: white;
  margin-right: 10px;
  position: relative;
  transition: color 0.25s ease;
}

.menu-btn::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 6px;
  height: 2px;
  background: #e91e63;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
}

.menu-btn:hover::after {
  transform: scaleX(1);
}

.menu-btn-active {
  color: #ff8fb3 !important;
}

.menu-btn-active::after {
  transform: scaleX(1);
  background: #ff8fb3;
}

.desktop-menu {
  display: flex;
  margin-right: 20px;
  animation: fadeIn 0.6s ease;
}

.cta-header-btn {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cta-header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(233,30,99,0.35);
}

.mobile-menu-btn {
  display: none;
}

.mobile-drawer :deep(.q-drawer__content) {
  background:
    linear-gradient(
      160deg,
      rgba(15,15,15,0.98),
      rgba(35,10,20,0.97)
    ) !important;
  color: #fff;
}

.drawer-inner {
  min-height: 100%;
}

.drawer-header {
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(212,175,55,0.15);
}

.drawer-logo {
  box-shadow: 0 0 0 2px rgba(212,175,55,0.35);
}

.drawer-brand-title {
  font-size: clamp(0.95rem, 4vw, 1.1rem);
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.drawer-brand-subtitle {
  white-space: nowrap;
}

.drawer-close-btn {
  transition: transform 0.25s ease, background 0.25s ease;
}

.drawer-close-btn:hover,
.drawer-close-btn:active {
  transform: rotate(90deg);
  background: rgba(255,255,255,0.1);
}

.drawer-separator {
  background: rgba(255,255,255,0.08);
}

.drawer-list {
  flex: 1 1 auto;
}

.drawer-item {
  color: #fff !important;
  border-radius: 12px;
  margin: 4px 10px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.drawer-item :deep(.q-icon) {
  color: #f48fb1;
  font-size: 22px;
}

.drawer-item-icon {
  min-width: 40px;
}

.drawer-item-label {
  font-size: 1rem;
  font-weight: 500;
  color: #fff !important;
}

.drawer-item:hover {
  background: rgba(233,30,99,0.15);
  transform: translateX(4px);
}

.drawer-item-active {
  background: rgba(233,30,99,0.22);
  border-left: 3px solid #e91e63;
}

.drawer-item-active .drawer-item-label {
  color: #ff8fb3 !important;
  font-weight: 700;
}

.drawer-item-active :deep(.q-icon) {
  color: #ff8fb3;
}

.drawer-cta-wrap {
  background: rgba(255,255,255,0.03);
}

.drawer-cta-btn {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.drawer-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(233,30,99,0.4);
}

/* HERO */

.hero-section {
  position: relative;
  min-height: 100vh;
  width: 100%;

  background-image:
    url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop');

  background-size: cover;
  background-position: center;
  background-attachment: scroll;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: clamp(16px, 5vw, 48px);
  box-sizing: border-box;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0,0,0,0.85),
      rgba(91,22,45,0.5)
    );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.8s ease;
}

.hero-logo {
  width: clamp(90px, 18vw, 190px);
  height: clamp(90px, 18vw, 190px);
  object-fit: contain;
  margin: auto;
  display: block;
  filter: drop-shadow(0 0 20px rgba(212,175,55,0.45));
  animation: fadeIn 1s ease;
}

.hero-title {
  font-size: clamp(1.75rem, 6vw, 3.5rem);
  line-height: 1.15;
  word-break: break-word;
}

.hero-subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
}

.hero-tagline {
  font-size: clamp(0.8rem, 2.2vw, 1.05rem);
  padding: 0 8px;
}

.hero-cta {
  font-size: clamp(0.85rem, 2vw, 1rem);
  padding: 10px 24px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hero-cta:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 24px rgba(233,30,99,0.4);
}

/* SECTION TITLES */

.section-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
}

.section-subtitle {
  font-size: clamp(0.85rem, 2vw, 1rem);
}

.calendar-section {
  animation: fadeIn 0.8s ease;
}

.products-section {
  animation: fadeIn 0.8s ease;
}

.products-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 700px;
  margin: 0 auto;
}

.product-chip {
  font-size: 0.95rem;
  padding: 10px 6px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(233,30,99,0.35);
}

/* SERVICES (legado, mantenido por compatibilidad visual) */

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
  height: 100%;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
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

/* FOOTER */

.footer-section {
  margin-top: clamp(40px, 8vw, 80px);
  padding: clamp(20px, 5vw, 40px);
  background: rgba(0,0,0,0.85);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* ANIMATIONS */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE - TABLET / IPAD */

@media (max-width: 1024px) {

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

}

/* RESPONSIVE - MOBILE */

@media (max-width: 768px) {

  .desktop-menu,
  .cta-header-btn {
    display: none;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .hero-section {
    min-height: 90vh;
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

}

/* RESPONSIVE - MOBILE LANDSCAPE (altura reducida) */

@media (max-width: 900px) and (orientation: landscape) {

  .hero-section {
    min-height: 130vh;
  }

}

@media (max-width: 480px) {

  .brand-subtitle {
    display: none;
  }

  .footer-grid {
    text-align: center;
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

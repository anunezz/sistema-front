<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="header-glass">
			<q-toolbar class="q-px-md q-px-lg-lg toolbar-responsive">
				<div class="row items-center">
					<img src="~/src/assets/The_planet/Th3eplanet.png" class="logo-mini" />

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
					@click="openReservationModal"
				/>

				<q-btn
					flat
					round
					dense
					icon="search"
					color="white"
					class="folio-search-btn"
					aria-label="Buscar folio"
					@click="openFolioEntryModal"
				>
					<q-tooltip anchor="bottom middle" self="center middle">Buscar folio</q-tooltip>
				</q-btn>

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
						<q-item-section v-if="activeSection === item.id" side>
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

					<q-btn
						flat
						rounded
						label="Buscar folio"
						icon="search"
						color="pink-2"
						class="full-width q-mt-sm"
						@click="openFolioEntryModalFromDrawer"
					/>
				</div>
			</div>
		</q-drawer>

		<q-page-container>
			<!-- MODAL RESERVA -->

			<q-dialog v-model="showReservationModal">
				<q-card
					class="reservation-modal"
					style="min-width: 350px; max-width: 500px; width: 100%"
				>
					<q-card-section class="row items-center q-pb-none">
						<div class="text-h5 text-gold text-weight-bold">Reservar Cita</div>

						<q-space />

						<q-btn icon="close" flat round dense v-close-popup />
					</q-card-section>

					<q-card-section>
						<q-form ref="bookingFormRef" class="q-gutter-md">
							<!-- SERVICIO (antes "Categoría" — misma entidad ServiceCategory,
							     solo se relabeló el campo) -->

							<q-select
								outlined
								dark
								color="pink"
								v-model="reservationForm.service_category_id"
								label="Servicio"
								:options="categoryOptions"
								option-value="value"
								option-label="label"
								emit-value
								map-options
								:rules="[(val) => !!val || 'Selecciona un servicio']"
							/>

							<!-- SERVICIOS AGENDABLES (antes "Servicio" — misma entidad
							     AppointmentService, solo se relabeló el campo) -->

							<q-select
								outlined
								dark
								color="pink"
								v-model="reservationForm.appointment_service_id"
								label="Servicios agendables"
								:options="filteredServiceOptions"
								option-value="value"
								option-label="label"
								emit-value
								map-options
								:disable="!reservationForm.service_category_id"
								:hint="
									!reservationForm.service_category_id
										? 'Elige un servicio primero'
										: ''
								"
								:rules="[(val) => !!val || 'Selecciona un servicio agendable']"
							>
								<template v-slot:option="scope">
									<q-item v-bind="scope.itemProps">
										<q-item-section>
											<q-item-label>{{ scope.opt.label }}</q-item-label>
											<q-item-label
												caption
												class="row items-center q-gutter-sm"
											>
												<span v-if="formatPrice(scope.opt.price)">{{
													formatPrice(scope.opt.price)
												}}</span>
												<span
													>{{ scope.opt.duration_minutes }} minutos</span
												>
											</q-item-label>
										</q-item-section>
									</q-item>
								</template>

								<template v-slot:no-option>
									<q-item>
										<q-item-section class="text-grey-5">
											No hay servicios agendables disponibles para este
											servicio.
										</q-item-section>
									</q-item>
								</template>
							</q-select>

							<!-- DÍA DE RESERVA (solo selección por calendario, sin captura manual) -->

							<q-input
								outlined
								dark
								readonly
								color="pink"
								v-model="reservationForm.date"
								label="Día de reserva"
								prepend-icon="event"
								:disable="!slotPrefilled && !reservationForm.appointment_service_id"
								:hint="dayHint"
								:rules="[(val) => !!val || 'Selecciona un día']"
							>
								<template v-slot:append>
									<q-icon
										name="event"
										:class="
											reservationForm.appointment_service_id
												? 'cursor-pointer'
												: ''
										"
									>
										<q-popup-proxy
											v-if="reservationForm.appointment_service_id"
											cover
											transition-show="scale"
											transition-hide="scale"
										>
											<q-date
												v-model="reservationForm.date"
												mask="DD-MM-YYYY"
												color="pink"
												:options="isDaySelectable"
												:navigation-min-year-month="currentYearMonth"
												:navigation-max-year-month="currentYearMonth"
												:default-year-month="currentYearMonth"
											/>
										</q-popup-proxy>
									</q-icon>
								</template>
							</q-input>

							<!-- HORARIO DISPONIBLE (solo selección, sin captura manual) —
							     agregado entre todos los barberos, precede a elegir barbero. -->

							<q-select
								outlined
								dark
								color="pink"
								v-model="reservationForm.start_time"
								label="Horario disponible"
								:options="availableSlots"
								:loading="loadingSlots"
								:disable="!canQueryAvailability"
								:hint="availabilityHint"
								no-options-label="No hay horarios disponibles para esta fecha."
								:rules="[(val) => !!val || 'Selecciona un horario']"
							/>

							<!-- BARBERO (solo selección, sin captura manual) — filtrado por
							     el horario ya elegido. -->

							<q-select
								outlined
								dark
								color="pink"
								v-model="reservationForm.barbero_user_id"
								label="Barbero"
								:options="barberoOptions"
								option-value="value"
								option-label="label"
								emit-value
								map-options
								:loading="loadingBarberos"
								:disable="!canQueryBarberos"
								:hint="barberoHint"
								no-options-label="No hay barberos disponibles para ese horario"
								:rules="[(val) => !!val || 'Selecciona un barbero']"
							/>

							<!-- NOMBRE -->

							<q-input
								outlined
								dark
								color="pink"
								v-model="reservationForm.customer_name"
								label="Nombre"
								prepend-icon="person"
								maxlength="100"
								counter
								:rules="customerNameRules"
							/>

							<!-- TELÉFONO -->

							<q-input
								outlined
								dark
								color="pink"
								v-model="reservationForm.customer_phone"
								label="Teléfono"
								prepend-icon="phone"
								maxlength="10"
								@keypress="onlyDigitsKeypress"
								:rules="customerPhoneRules"
							/>

							<!-- EMAIL (opcional) -->

							<q-input
								outlined
								dark
								color="pink"
								v-model="reservationForm.customer_email"
								label="Correo (opcional)"
								prepend-icon="mail"
								:rules="customerEmailRules"
							/>

							<!-- COMENTARIOS (opcional) -->

							<q-input
								outlined
								dark
								color="pink"
								v-model="reservationForm.customer_comments"
								label="Comentarios (opcional)"
								type="textarea"
							/>
						</q-form>
					</q-card-section>

					<q-card-actions align="right">
						<q-btn flat label="Cancelar" color="grey" v-close-popup />

						<q-btn
							unelevated
							color="pink-6"
							label="Confirmar cita"
							icon="event_available"
							:disable="!canSubmitBooking"
							@click="openConfirmStep"
						/>
					</q-card-actions>
				</q-card>
			</q-dialog>

			<!-- CONFIRMACIÓN PREVIA (antes de guardar) -->

			<q-dialog v-model="showConfirmStepModal">
				<q-card
					class="reservation-modal"
					style="min-width: 320px; max-width: 450px; width: 100%"
				>
					<q-card-section class="row items-center">
						<q-icon name="help" color="warning" size="32px" class="q-mr-sm" />

						<div class="text-h6 text-gold">Confirmar reservación</div>
					</q-card-section>

					<q-card-section class="q-gutter-xs">
						<div><b>Servicio:</b> {{ confirmPreview.categoryLabel }}</div>
						<div><b>Servicio agendable:</b> {{ confirmPreview.serviceLabel }}</div>
						<div v-if="selectedAppointmentService">
							<b>Precio:</b>
							{{ formatPrice(selectedAppointmentService.price) || 'N/D' }}
							·
							<b>Duración:</b> {{ selectedAppointmentService.duration_minutes }} min
						</div>
						<div><b>Día:</b> {{ reservationForm.date }}</div>
						<div><b>Horario:</b> {{ reservationForm.start_time }}</div>
						<div><b>Barbero:</b> {{ confirmPreview.barberoLabel }}</div>
						<div><b>Nombre:</b> {{ reservationForm.customer_name }}</div>
						<div><b>Teléfono:</b> {{ reservationForm.customer_phone }}</div>
						<div v-if="reservationForm.customer_email">
							<b>Correo:</b> {{ reservationForm.customer_email }}
						</div>
						<div class="q-mt-sm">
							¿Estás completamente seguro de confirmar la reservación de cita?
						</div>
					</q-card-section>

					<q-card-actions align="right">
						<q-btn
							flat
							label="Cancelar"
							color="grey"
							@click="showConfirmStepModal = false"
						/>

						<q-btn
							unelevated
							color="pink-6"
							label="Confirmar reservación"
							icon="event_available"
							:loading="confirmingBooking"
							@click="saveReservation"
						/>
					</q-card-actions>
				</q-card>
			</q-dialog>

			<!-- CONFIRMACIÓN DE RESERVA -->

			<q-dialog v-model="showConfirmationModal">
				<q-card
					class="reservation-modal"
					style="min-width: 320px; max-width: 450px; width: 100%"
				>
					<q-card-section class="row items-center">
						<q-icon name="check_circle" color="positive" size="32px" class="q-mr-sm" />

						<div class="text-h6 text-gold">Reservación confirmada</div>
					</q-card-section>

					<q-card-section v-if="confirmation" class="q-gutter-xs">
						<div class="text-caption text-grey-5">
							Tu cita fue registrada correctamente. Guarda tu folio para consultarla
							posteriormente.
						</div>
						<div class="folio-highlight q-my-sm">
							<div class="text-caption text-pink-2">FOLIO</div>
							<div class="text-h6 text-gold text-weight-bold">
								{{ confirmation.folio }}
							</div>
						</div>
						<div v-if="confirmation.category">
							<b>Servicio:</b> {{ confirmation.category?.title }}
						</div>
						<div><b>Servicio agendable:</b> {{ confirmation.service?.name }}</div>
						<div v-if="confirmation.barbero">
							<b>Barbero:</b> {{ confirmation.barbero?.name }}
						</div>
						<div><b>Día:</b> {{ confirmation.appointment_date }}</div>
						<div>
							<b>Horario:</b> {{ confirmation.start_time }} -
							{{ confirmation.end_time }}
						</div>
						<div class="row items-center q-gutter-xs">
							<b>Estatus:</b>
							<StatusChip :status="confirmation.status" />
						</div>
					</q-card-section>

					<q-card-actions align="right">
						<q-btn unelevated color="pink-6" label="Aceptar" v-close-popup />
					</q-card-actions>
				</q-card>
			</q-dialog>

			<!-- DETALLE DE CITA (clic en calendario público o resultado de folio) -->

			<q-dialog v-model="showCitaDetailModal">
				<q-card
					class="reservation-modal"
					style="min-width: 320px; max-width: 450px; width: 100%"
				>
					<q-card-section class="row items-center">
						<q-icon
							name="confirmation_number"
							color="pink-4"
							size="28px"
							class="q-mr-sm"
						/>

						<div class="text-h6 text-gold">Detalle de cita</div>
					</q-card-section>

					<q-card-section v-if="citaDetail" class="q-gutter-xs">
						<!-- Folio: SOLO se muestra cuando viene de una consulta por folio
						     (el cliente ya lo conoce). Nunca al hacer clic sobre una cita
						     ajena en el calendario público (spec §16/§34). -->
						<div v-if="citaDetail.folio"><b>Folio:</b> {{ citaDetail.folio }}</div>
						<div><b>Servicio:</b> {{ citaDetail.category || 'N/D' }}</div>
						<div><b>Servicio agendable:</b> {{ citaDetail.service }}</div>
						<div><b>Barbero:</b> {{ citaDetail.barbero || 'No asignado' }}</div>
						<div><b>Día:</b> {{ citaDetail.day }}</div>
						<div><b>Horario:</b> {{ citaDetail.time }}</div>
						<div class="row items-center q-gutter-sm q-mt-xs">
							<b>Estatus:</b>
							<StatusChip :status="citaDetail.status" />
						</div>
						<div v-if="citaDetail.message" class="q-mt-sm folio-highlight">
							<div class="text-caption text-pink-2">
								{{ citaDetail.status === 'CANCELADA' ? 'MOTIVO' : 'MENSAJE' }}
							</div>
							<div>{{ citaDetail.message }}</div>
						</div>
					</q-card-section>

					<q-card-actions align="right">
						<!-- "Cancelar cita": SOLO aparece cuando el detalle viene de una
						     consulta por folio exitosa (citaDetail.folio) y el backend
						     indica que el estado actual admite cancelación
						     (citaDetail.cancellable, ver PublicAppointmentResource). Nunca
						     se muestra sobre una cita ajena vista en el calendario público
						     (esa variante nunca trae folio). No cancela de inmediato: abre
						     el formulario de motivo (openCancelReasonModal). -->
						<q-btn
							v-if="citaDetail?.folio && citaDetail?.cancellable"
							flat
							label="Cancelar cita"
							color="negative"
							icon="event_busy"
							@click="openCancelReasonModal"
						/>
						<q-btn flat label="Cerrar" color="grey" v-close-popup />
					</q-card-actions>
				</q-card>
			</q-dialog>

			<!-- MOTIVO DE CANCELACIÓN (cliente) — se abre al presionar "Cancelar
			     cita" en el detalle de folio. No cancela nada por sí sola: solo
			     tras "Confirmar cancelación" se ejecuta la cancelación real. -->

			<q-dialog v-model="showCancelReasonModal" persistent>
				<q-card
					class="reservation-modal"
					style="min-width: 320px; max-width: 450px; width: 100%"
				>
					<q-card-section class="row items-center">
						<q-icon name="event_busy" color="pink-4" size="28px" class="q-mr-sm" />
						<div class="text-h6 text-gold">Cancelar cita</div>
					</q-card-section>

					<q-card-section class="q-gutter-sm">
						<div class="text-grey-4">
							¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede
							deshacer.
						</div>

						<q-input
							outlined
							dark
							color="pink"
							type="textarea"
							v-model="cancelReasonInput"
							label="Motivo de la cancelación"
							maxlength="500"
							counter
							:error="!!cancelReasonError"
							:error-message="cancelReasonError"
						/>
					</q-card-section>

					<q-card-actions align="right">
						<q-btn
							flat
							label="Volver / No cancelar"
							color="grey"
							:disable="cancelling"
							@click="closeCancelReasonModal"
						/>
						<q-btn
							unelevated
							label="Confirmar cancelación"
							color="negative"
							icon="event_busy"
							:loading="cancelling"
							@click="confirmCancellation"
						/>
					</q-card-actions>
				</q-card>
			</q-dialog>

			<!-- CONSULTAR CITA POR FOLIO (modal, acceso desde header/drawer) -->

			<q-dialog v-model="showFolioEntryModal">
				<q-card
					class="reservation-modal"
					style="min-width: 320px; max-width: 420px; width: 100%"
				>
					<q-card-section class="row items-center q-pb-none">
						<div class="text-h6 text-gold">Consultar cita</div>

						<q-space />

						<q-btn icon="close" flat round dense v-close-popup />
					</q-card-section>

					<q-card-section>
						<q-input
							outlined
							dark
							color="pink"
							v-model="folioEntryInput"
							label="Folio"
							placeholder="AG-20260831-000123"
							:error="!!folioEntryError"
							:error-message="folioEntryError"
							@keyup.enter="submitFolioEntry"
						>
							<template v-slot:prepend>
								<q-icon name="confirmation_number" />
							</template>
						</q-input>
					</q-card-section>

					<q-card-actions align="right">
						<q-btn
							unelevated
							color="pink-6"
							label="Buscar"
							icon="search"
							:loading="searchingFolioEntry"
							@click="submitFolioEntry"
						/>
					</q-card-actions>
				</q-card>
			</q-dialog>

			<q-page class="bg-dark-page">
				<!-- HERO -->

				<section id="inicio" class="hero-section">
					<div class="hero-overlay"></div>

					<div class="hero-content">
						<img src="~/src/assets/The_planet/The_planert_logo.png" class="hero-logo" />

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
							@click="openReservationModal"
						/>
					</div>
				</section>

				<!-- SERVICIOS -->

				<div id="servicios-anchor">
					<ServicesSection />
				</div>

				<!-- PRODUCTOS -->

				<div id="productos-anchor">
					<ProductsSection />
				</div>

				<!-- CALENDARIO -->

				<section id="agenda" class="q-pa-md q-pa-md-xl calendar-section">
					<div class="text-center q-mb-xl">
						<div class="text-weight-bold text-gold section-title">Agenda Tu Cita</div>

						<div class="text-grey-5 q-mt-sm section-subtitle">
							Consulta horarios disponibles.
						</div>
					</div>

					<ThePlanetCalendar
						:events="calendarEvents"
						:business-hours="calendarBounds.businessHours"
						:slot-min-time="calendarBounds.slotMinTime"
						:slot-max-time="calendarBounds.slotMaxTime"
						:closed-days-of-week="calendarBounds.closedDaysOfWeek"
						:blocks="scheduleBlocks"
						@date-click="handleCalendarDateClick"
						@event-click="handleCalendarEventClick"
						@event-drop="handleCalendarEventDrop"
						@event-resize="handleCalendarEventResize"
						@select="handleCalendarSelect"
					/>

					<!-- CONSULTAR CITA -->

					<div class="text-center q-mt-xl folio-inline-search">
						<div class="text-subtitle1 text-pink-2 q-mb-sm">Consultar cita</div>

						<div class="row justify-center items-start q-gutter-sm">
							<q-input
								outlined
								dark
								dense
								color="pink"
								v-model="folioInlineInput"
								placeholder="Folio"
								style="max-width: 280px; width: 100%"
								:error="!!folioInlineError"
								:error-message="folioInlineError"
								@keyup.enter="submitFolioInline"
							>
								<template v-slot:prepend>
									<q-icon name="confirmation_number" />
								</template>
							</q-input>

							<q-btn
								round
								unelevated
								color="pink-6"
								icon="search"
								:loading="searchingFolioInline"
								@click="submitFolioInline"
							/>
						</div>
					</div>
				</section>

				<!-- FOOTER -->

				<footer id="contacto" class="footer-section">
					<div class="footer-grid">
						<div>
							<div class="text-h5 text-gold text-weight-bold">THE PLANET STUDIO</div>

							<div class="text-grey-5 q-mt-sm">Estética y peluquería premium.</div>
						</div>

						<div>
							<div class="text-h6 text-pink-3">Contacto</div>

							<div class="text-grey-5 q-mt-md">📍 Sahuayo 76, Janitzio</div>

							<div class="text-grey-5">📧 ricknatureye@yahoo.com</div>
						</div>
					</div>
				</footer>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Notify } from 'quasar'
import ServicesSection from 'src/components/the_planet/ServicesSection.vue'
import ProductsSection from 'src/components/the_planet/ProductsSection.vue'
import ThePlanetCalendar from 'src/components/the_planet/ThePlanetCalendar.vue'
import StatusChip from 'src/components/the_planet/StatusChip.vue'
import AgendaApi from 'src/services/the_planet/agenda.api'
import { buildCalendarBounds } from 'src/utils/agendaSchedule'
import ServiceApi from 'src/services/service.api'
import type { AppointmentSummary, PublicAppointmentDetail } from 'src/interfaces/agenda'
import type { ServiceCategory } from 'src/interfaces/service'

const planetLogo = new URL('../assets/The_planet/Th3eplanet.png', import.meta.url).href

const showReservationModal = ref(false)
const drawerOpen = ref(false)
const activeSection = ref('inicio')

// Reserva pública real (Agenda). Flujo: categoría → servicio → día →
// barbero → horario → datos del cliente → confirmar → folio (ver
// .claude/skills/agenda/ — barbero reintroducido como decisión de producto
// nueva). service_category_id no viaja al backend (es un filtro de UI: el
// appointment_service_id elegido ya implica su categoría vía
// AppointmentService.service_category_id) — solo appointment_service_id y
// barbero_user_id viajan como hash_id (patrón del proyecto).
const defaultReservationForm = () => ({
	service_category_id: null,
	appointment_service_id: null,
	date: '',
	barbero_user_id: null,
	start_time: null,
	customer_name: '',
	customer_phone: '',
	customer_email: '',
	customer_comments: '',
})

const reservationForm = ref(defaultReservationForm())
// true cuando fecha/hora vienen precargadas de un clic en un horario del
// calendario público (ver handleCalendarDateClick) — mientras esté activo,
// elegir Servicio/Servicio agendable NO debe limpiar fecha/hora ya elegidas.
const slotPrefilled = ref(false)
const bookingFormRef = ref(null)
// Catálogo real del módulo "Servicios" (ServiceCategory, GET /services,
// mismo endpoint que ya usa ServicesSection.vue — sin duplicar) — es la
// ÚNICA fuente del campo "Servicio". Peluquería/Belleza/Terapias/Energy
// Drinks vienen de aquí, no de los servicios agendables ya cargados: una
// categoría sin servicios agendables activos igual debe listarse si está
// activa (spec: "el catálogo padre").
const serviceCategories = ref<ServiceCategory[]>([])
// Registros de AppointmentService (con category anidada, incluye su "id"
// crudo) — es la ÚNICA fuente del campo "Servicio agendable", filtrado por
// el id de categoría elegido en el campo "Servicio" (no por hash_id: cada
// respuesta re-encripta con IV distinto, comparar hash_id entre dos
// llamadas HTTP distintas nunca coincide — el id entero sí es estable).
const rawServices = ref([])
const availableDays = ref(new Set())
const loadingDays = ref(false)
const barberoOptions = ref([])
const loadingBarberos = ref(false)
const availableSlots = ref([])
const loadingSlots = ref(false)
const confirmingBooking = ref(false)
const showConfirmStepModal = ref(false)
const showConfirmationModal = ref(false)
const confirmation = ref(null)

// --- Consulta pública por folio (detalle de cita, entrada por header/drawer
// y por el buscador inline debajo del calendario) ---
const showCitaDetailModal = ref(false)
const citaDetail = ref(null)
const showFolioEntryModal = ref(false)
const folioEntryInput = ref('')
const folioEntryError = ref('')
const searchingFolioEntry = ref(false)
const folioInlineInput = ref('')
const folioInlineError = ref('')
const searchingFolioInline = ref(false)

// Cancelación por el CLIENTE — motivo obligatorio, distinto del mensaje del
// administrador (citaDetail.message). Ver AgendaApi.cancelAppointment.
const showCancelReasonModal = ref(false)
const cancelReasonInput = ref('')
const cancelReasonError = ref('')
const cancelling = ref(false)

// Vista pública limitada al mes actual (ver .claude/skills/agenda/) — usa
// la fecha real del sistema, nunca hardcodeada. Formato 'YYYY/MM' esperado
// por navigation-min-year-month/navigation-max-year-month de q-date, que
// oculta de forma nativa la navegación a meses adyacentes.
const currentYearMonth = computed(() => {
	const today = new Date()
	return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}`
})

// Catálogo padre real (módulo "Servicios", GET /services) — activas ya
// filtradas en backend (ServiceCategory::where('active', true)), no se
// vuelve a filtrar aquí. "value" es el id entero (nunca viaja al backend:
// service_category_id es filtro de UI, ver comentario junto a
// defaultReservationForm) — no se usa hash_id porque cada respuesta HTTP
// re-encripta con un IV distinto y nunca coincidiría entre /services y
// /agenda/servicios.
const categoryOptions = computed(() =>
	serviceCategories.value.map((c) => ({ label: c.title, value: c.id })),
)

// Servicios agendables (AppointmentService, GET /agenda/servicios, ya
// activos) filtrados por el id de categoría elegido en "Servicio" — nunca
// al revés. Un Servicio sin servicios agendables activos simplemente
// produce una lista vacía aquí (ver no-option del q-select).
const filteredServiceOptions = computed(() => {
	if (!reservationForm.value.service_category_id) return []

	return rawServices.value
		.filter((s) => s.category?.id === reservationForm.value.service_category_id)
		.map((s) => ({
			label: s.name,
			value: s.hash_id,
			duration_minutes: s.duration_minutes,
			price: s.price,
		}))
})

// Registro completo (nombre/precio/duración) del servicio agendable
// seleccionado — usado en el paso de confirmación para mostrar precio y
// duración reales (nunca ficticios), ver spec §2.
const selectedAppointmentService = computed(
	() =>
		filteredServiceOptions.value.find(
			(s) => s.value === reservationForm.value.appointment_service_id,
		) || null,
)

// Formatea el precio real configurado en el módulo de Servicios agendables
// (decimal:2 en backend, puede llegar como string) — null si no hay precio.
function formatPrice(price) {
	if (price === null || price === undefined || price === '') return null
	const num = Number(price)
	if (Number.isNaN(num)) return null
	return `$${num.toFixed(2)}`
}

// Horario disponible: depende de servicio + servicio agendable + día
// (disponibilidad AGREGADA entre todos los barberos — el barbero se elige
// después, ya con el horario fijo).
const canQueryAvailability = computed(
	() => !!(reservationForm.value.appointment_service_id && reservationForm.value.date),
)

// Barbero: depende de que ya haya un horario elegido (filtra a los
// barberos libres exactamente en ese slot).
const canQueryBarberos = computed(
	() => !!(reservationForm.value.appointment_service_id && reservationForm.value.start_time),
)

const dayHint = computed(() => {
	// Fecha precargada desde un clic en el calendario: ya no aplica la
	// instrucción de "elige un servicio primero" para este campo.
	if (slotPrefilled.value) return ''
	if (!reservationForm.value.appointment_service_id) return 'Elige un servicio agendable primero'
	if (loadingDays.value) return 'Consultando días disponibles...'
	return ''
})

const availabilityHint = computed(() => {
	if (!canQueryAvailability.value) return 'Elige servicio y día primero'
	if (loadingSlots.value) return 'Consultando disponibilidad...'
	if (availableSlots.value.length === 0) return 'No hay horarios disponibles para esta fecha.'
	return ''
})

const barberoHint = computed(() => {
	if (!canQueryBarberos.value) return 'Elige un horario primero'
	if (loadingBarberos.value) return 'Consultando barberos disponibles...'
	if (barberoOptions.value.length === 0) return 'No hay barberos disponibles para ese horario'
	return ''
})

const canSubmitBooking = computed(
	() =>
		!!(
			reservationForm.value.service_category_id &&
			reservationForm.value.appointment_service_id &&
			reservationForm.value.date &&
			reservationForm.value.barbero_user_id &&
			reservationForm.value.start_time &&
			reservationForm.value.customer_name &&
			reservationForm.value.customer_phone
		),
)

const confirmPreview = computed(() => ({
	categoryLabel:
		categoryOptions.value.find((c) => c.value === reservationForm.value.service_category_id)
			?.label || '',
	serviceLabel:
		filteredServiceOptions.value.find(
			(s) => s.value === reservationForm.value.appointment_service_id,
		)?.label || '',
	barberoLabel:
		barberoOptions.value.find((b) => b.value === reservationForm.value.barbero_user_id)
			?.label || '',
}))

// Nombre: solo letras (con acentos/ñ), números y espacios — máximo 100
// caracteres (validado también en backend, ver PublicAppointmentRequest).
const customerNameRules = [
	(val) => !!val || 'El nombre es obligatorio.',
	(val) => (val && val.length <= 100) || 'Máximo 100 caracteres.',
	(val) =>
		/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 ]+$/.test(val || '') ||
		'Solo se permiten letras, números y espacios.',
]

// Teléfono: exactamente 10 dígitos (validado también en backend).
const customerPhoneRules = [
	(val) => !!val || 'El teléfono es obligatorio.',
	(val) => /^[0-9]{10}$/.test(val || '') || 'Debe contener exactamente 10 números.',
]

const customerEmailRules = [
	(val) => !val || /.+@.+\..+/.test(val) || 'Formato de correo electrónico inválido.',
]

function onlyDigitsKeypress(evt) {
	if (!/[0-9]/.test(evt.key)) {
		evt.preventDefault()
	}
}

// dd-mm-aaaa (formato del q-date existente) -> aaaa-mm-dd (formato que espera el backend)
function toIsoDate(displayDate) {
	const [day, month, year] = displayDate.split('-')
	return `${year}-${month}-${day}`
}

// q-date entrega el candidato en formato 'YYYY/MM/DD' a la función options().
function slashToIsoDate(slashDate) {
	return slashDate.replaceAll('/', '-')
}

// Un día solo es seleccionable si el backend lo marcó con disponibilidad
// real (mes actual, no pasado, día configurado, con posibilidad de horario
// — ver AgendaController::availableDays()). Nunca se calcula esto en el
// frontend a partir de reglas propias.
function isDaySelectable(slashDate) {
	return availableDays.value.has(slashToIsoDate(slashDate))
}

async function loadServices() {
	try {
		const servicesResponse = await AgendaApi.getServices()

		if (servicesResponse.success) {
			rawServices.value = servicesResponse.data
		}
	} catch {
		Notify.create({
			type: 'negative',
			message: 'No se pudo cargar la agenda. Intenta de nuevo más tarde.',
		})
	}
}

// Catálogo padre real (módulo "Servicios") — reutiliza ServiceApi.getServices()
// (mismo servicio HTTP que ya usa ServicesSection.vue), sin pedir un
// endpoint nuevo. Independiente de loadServices(): un Servicio sin
// servicios agendables activos aún debe listarse aquí.
async function loadServiceCategories() {
	try {
		const response = await ServiceApi.getServices()

		if (response.success) {
			serviceCategories.value = response.data
		}
	} catch {
		Notify.create({
			type: 'negative',
			message: 'No se pudieron cargar los servicios. Intenta de nuevo más tarde.',
		})
	}
}

// Calendario público: mismo rango que el límite de reservación (hoy → fin
// de mes actual, ver .claude/skills/agenda/). Se recarga tras cada
// reservación exitosa (spec §18/§36) — nunca requiere recargar la página.
function currentMonthRange() {
	const today = new Date()
	const start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
	const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
	const end = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`
	return { start, end }
}

async function loadCalendarEvents() {
	const { start, end } = currentMonthRange()

	try {
		const response = await AgendaApi.getPublicCalendar(start, end)
		calendarEvents.value = response.success ? response.data : []
	} catch {
		calendarEvents.value = []
	}
}

// Horario real de atención (WorkingHour) — reemplaza el rango fijo que
// tenía el calendario (antes hardcodeado a 11:00-19:00, ver
// .claude/skills/agenda/ §13.5). Se consulta una sola vez (el horario
// configurado no cambia durante la sesión del visitante).
async function loadWorkingHours() {
	try {
		const response = await AgendaApi.getWorkingHours()
		workingHours.value = response.success ? response.data : []
	} catch {
		workingHours.value = []
	}
}

// Bloqueos activos del mes visible — se pintan como franjas "CERRADO" en
// el calendario (ver ThePlanetCalendar.vue). Mismo rango que
// loadCalendarEvents(), se recarga junto con él.
async function loadScheduleBlocks() {
	const { start, end } = currentMonthRange()

	try {
		const response = await AgendaApi.getBlocks(start, end)
		scheduleBlocks.value = response.success ? response.data : []
	} catch {
		scheduleBlocks.value = []
	}
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (formato de visualización usado en el resto
// del flujo de reserva).
function formatDisplayDate(isoDate) {
	const [year, month, day] = isoDate.split('-')
	return `${day}/${month}/${year}`
}

// Clic sobre una cita del calendario público: NUNCA lleva folio ni datos
// de cliente (el backend ni siquiera lo envía, ver PublicAppointmentCalendarResource
// y spec §16/§34) — folio/message quedan undefined, el modal de detalle ya
// los oculta condicionalmente.
function citaDetailFromCalendarEvent(event) {
	const start = event.start
	const end = event.end
	const pad = (n) => String(n).padStart(2, '0')

	// Sin "message"/motivo aquí a propósito: el detalle por clic en el
	// calendario público solo debe mostrar Servicio, Servicio agendable,
	// Barbero, Día, Horario y Estatus — nada de motivo/mensaje interno (spec
	// de la tarea de corrección de la vista pública). La consulta por folio
	// (citaDetailFromFolioLookup) sí conserva "message": es información que
	// el propio cliente ya puede ver de su cita, caso distinto.
	return {
		status: event.extendedProps.status,
		category: event.extendedProps.category,
		service: event.extendedProps.service,
		barbero: event.extendedProps.barbero,
		day: `${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`,
		time: `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`,
	}
}

// Consulta por folio: el cliente SÍ ve su propio folio y el mensaje del
// administrador (si existe) — a diferencia del clic sobre el calendario.
function citaDetailFromFolioLookup(detail: PublicAppointmentDetail) {
	return {
		folio: detail.folio,
		status: detail.status,
		cancellable: detail.cancellable,
		category: detail.category,
		service: detail.service,
		barbero: detail.barbero,
		day: formatDisplayDate(detail.appointment_date),
		time: `${detail.start_time} - ${detail.end_time}`,
		message: detail.message,
	}
}

// Compartida por el buscador inline (bajo el calendario) y el modal de
// folio (header/drawer) — mismo formato visual de resultado en ambos casos
// (reutiliza el modal de detalle de cita).
async function lookupFolio(folioRaw, onError) {
	const folio = (folioRaw || '').trim().toUpperCase()

	if (!folio) {
		onError('Ingresa un folio.')
		return false
	}

	try {
		const response = await AgendaApi.getAppointmentByFolio(folio)
		citaDetail.value = citaDetailFromFolioLookup(response.data.data)
		showCitaDetailModal.value = true
		return true
	} catch (error) {
		const status = error?.response?.status
		const backendMessage = error?.response?.data?.message

		if (status === 404) {
			onError(backendMessage || 'No encontramos una reservación con el folio proporcionado.')
		} else if (status === 422) {
			onError(backendMessage || 'El folio proporcionado no tiene un formato válido.')
		} else {
			onError('Ocurrió un problema al consultar el folio. Intenta de nuevo.')
		}
		return false
	}
}

async function submitFolioInline() {
	folioInlineError.value = ''
	searchingFolioInline.value = true

	const ok = await lookupFolio(folioInlineInput.value, (message) => {
		folioInlineError.value = message
	})

	searchingFolioInline.value = false
	if (ok) folioInlineInput.value = ''
}

function openFolioEntryModal() {
	folioEntryInput.value = ''
	folioEntryError.value = ''
	showFolioEntryModal.value = true
}

// Función nombrada (no handler inline multi-sentencia): Prettier ha
// demostrado reformatear repetidamente @click="a; b" quitando el ';' y
// rompiendo el build (ver feedback enviado esta sesión) — se evita el
// patrón por completo en vez de corregirlo cada vez que se formatea.
function openFolioEntryModalFromDrawer() {
	drawerOpen.value = false
	openFolioEntryModal()
}

async function submitFolioEntry() {
	folioEntryError.value = ''
	searchingFolioEntry.value = true

	const ok = await lookupFolio(folioEntryInput.value, (message) => {
		folioEntryError.value = message
	})

	searchingFolioEntry.value = false
	if (ok) {
		showFolioEntryModal.value = false
		folioEntryInput.value = ''
	}
}

// Flujo de cancelación del cliente:
// Buscar folio -> cita encontrada -> "Cancelar cita" -> motivo -> "Confirmar
// cancelación" -> backend valida y cancela -> se refleja en citaDetail.
// "Cancelar cita" NO cancela nada por sí sola, solo abre este formulario.
function openCancelReasonModal() {
	cancelReasonInput.value = ''
	cancelReasonError.value = ''
	showCancelReasonModal.value = true
}

// "Volver / No cancelar": cierra el formulario sin tocar la cita — no se
// llama a ningún endpoint.
function closeCancelReasonModal() {
	showCancelReasonModal.value = false
	cancelReasonInput.value = ''
	cancelReasonError.value = ''
}

async function confirmCancellation() {
	cancelReasonError.value = ''

	// Validación local (UX inmediata) — el backend siempre revalida
	// (PublicCancelAppointmentRequest: required + no solo espacios), esto no
	// es la única barrera.
	if (!cancelReasonInput.value.trim()) {
		cancelReasonError.value = 'Escribe el motivo de la cancelación.'
		return
	}

	if (!citaDetail.value?.folio) return

	cancelling.value = true
	try {
		const response = await AgendaApi.cancelAppointment(citaDetail.value.folio, {
			client_cancellation_reason: cancelReasonInput.value.trim(),
		})

		// Se refleja el estado real que devolvió el backend (no se asume
		// CANCELADA a ciegas) — así "Cancelar cita" desaparece de inmediato
		// (cancellable pasa a false) y no puede volver a presionarse.
		citaDetail.value = citaDetailFromFolioLookup(response.data.data)
		showCancelReasonModal.value = false
		cancelReasonInput.value = ''

		// El horario que ocupaba esta cita queda libre — el calendario
		// público (mismo componente/fuente de disponibilidad que el admin,
		// ver AvailabilityService/Appointment::scopeActive()) debe dejar de
		// pintarlo como ocupado sin que el visitante tenga que recargar la
		// página (mismo refresco que ya se hace tras una reservación exitosa).
		loadCalendarEvents()

		Notify.create({ type: 'positive', message: 'Cita cancelada correctamente.' })
	} catch (error) {
		const status = error?.response?.status
		const backendMessage = error?.response?.data?.message

		if (status === 422) {
			const fieldError = error?.response?.data?.errors?.client_cancellation_reason?.[0]
			cancelReasonError.value = fieldError || backendMessage || 'Motivo inválido.'
		} else if (status === 409) {
			// Ya se canceló (p. ej. doble clic, u otra pestaña) o cambió de
			// estado — se cierra el formulario y se refresca el detalle real
			// en vez de dejar visible un botón que ya no aplica.
			showCancelReasonModal.value = false
			Notify.create({
				type: 'negative',
				message: backendMessage || 'Esta cita ya no puede cancelarse.',
			})
			await lookupFolio(citaDetail.value.folio, () => {})
			loadCalendarEvents()
		} else if (status === 404) {
			showCancelReasonModal.value = false
			Notify.create({ type: 'negative', message: backendMessage || 'Cita no encontrada.' })
		} else {
			Notify.create({
				type: 'negative',
				message: 'Ocurrió un problema al cancelar la cita. Intenta de nuevo.',
			})
		}
	} finally {
		cancelling.value = false
	}
}

async function loadAvailableDays() {
	availableDays.value = new Set()

	if (!reservationForm.value.appointment_service_id) return

	loadingDays.value = true

	try {
		const response = await AgendaApi.getAvailableDays(
			reservationForm.value.appointment_service_id,
		)
		availableDays.value = new Set(response.success ? response.data : [])
	} catch {
		availableDays.value = new Set()
	} finally {
		loadingDays.value = false
	}
}

// Horario disponible: disponibilidad AGREGADA (sin barbero_user_id) — unión
// de todos los barberos válidos para ese servicio+día (ver
// AvailabilityService::getFreeSlotsAggregate() en backend). El barbero se
// elige después, ya con el horario fijo.
async function loadAvailability() {
	if (!canQueryAvailability.value) {
		availableSlots.value = []
		return
	}

	loadingSlots.value = true

	try {
		const response = await AgendaApi.getAvailability(
			reservationForm.value.appointment_service_id,
			toIsoDate(reservationForm.value.date),
		)

		availableSlots.value = response.success ? response.data : []
	} catch {
		availableSlots.value = []
	} finally {
		loadingSlots.value = false
	}
}

// Barbero: filtrado por el horario exacto ya elegido (ver
// AvailabilityService::availableBarberosForSlot() en backend) — solo
// barberos realmente libres para ese servicio+día+hora.
async function loadBarberos() {
	barberoOptions.value = []

	if (!canQueryBarberos.value) return

	loadingBarberos.value = true

	try {
		const response = await AgendaApi.getBarberos(
			reservationForm.value.appointment_service_id,
			toIsoDate(reservationForm.value.date),
			reservationForm.value.start_time,
		)

		barberoOptions.value = response.success
			? response.data.map((b) => ({ label: b.name, value: b.hash_id }))
			: []
	} catch {
		barberoOptions.value = []
	} finally {
		loadingBarberos.value = false
	}
}

// Al cambiar el servicio (categoría), el servicio agendable elegido se
// limpia SOLO si ya no pertenece al nuevo servicio (spec §2) — si sigue
// perteneciendo, se conserva.
watch(
	() => reservationForm.value.service_category_id,
	() => {
		const stillValid = filteredServiceOptions.value.some(
			(s) => s.value === reservationForm.value.appointment_service_id,
		)

		if (!stillValid) {
			reservationForm.value.appointment_service_id = null
		}
	},
)

// Cambiar una selección limpia las selecciones dependientes que dejan de
// ser válidas (nunca se conserva un horario/barbero que ya no aplica).
// Orden de dependencia actual: servicio agendable → día → horario → barbero.
// EXCEPCIÓN: si fecha/hora vienen precargadas de un clic en el calendario
// (slotPrefilled), elegir el servicio agendable NO debe limpiarlas —
// solo se revalida disponibilidad/barbero para ese mismo slot.
watch(
	() => reservationForm.value.appointment_service_id,
	() => {
		if (slotPrefilled.value) {
			reservationForm.value.barbero_user_id = null
			barberoOptions.value = []
			loadAvailableDays()
			loadAvailability()
			loadBarberos()
			return
		}

		reservationForm.value.date = ''
		reservationForm.value.start_time = null
		reservationForm.value.barbero_user_id = null
		barberoOptions.value = []
		availableSlots.value = []
		loadAvailableDays()
	},
)

watch(
	() => reservationForm.value.date,
	() => {
		if (!slotPrefilled.value) {
			reservationForm.value.start_time = null
		}
		reservationForm.value.barbero_user_id = null
		barberoOptions.value = []
		loadAvailability()
	},
)

watch(
	() => reservationForm.value.start_time,
	() => {
		reservationForm.value.barbero_user_id = null
		loadBarberos()
	},
)

async function openConfirmStep() {
	const valid = await bookingFormRef.value?.validate()

	if (!valid) return

	showConfirmStepModal.value = true
}

const menuItems = [
	{ id: 'inicio', label: 'Inicio', icon: 'home' },
	{ id: 'servicios', label: 'Servicios', icon: 'spa' },
	{ id: 'productos', label: 'Productos', icon: 'shopping_bag' },
	{ id: 'agenda', label: 'Agenda', icon: 'event' },
	{ id: 'contacto', label: 'Contacto', icon: 'mail' },
]

// Solo se llama tras el paso de confirmación previa (spec: "Confirmar
// cita" abre un segundo modal de confirmación; el guardado real solo
// ocurre al presionar "Confirmar reservación" ahí). El backend revalida
// todo de nuevo — la disponibilidad pudo cambiar mientras se llenaba el
// formulario.
async function saveReservation() {
	confirmingBooking.value = true

	try {
		const response = await AgendaApi.bookAppointment({
			appointment_service_id: reservationForm.value.appointment_service_id,
			barbero_user_id: reservationForm.value.barbero_user_id,
			appointment_date: toIsoDate(reservationForm.value.date),
			start_time: reservationForm.value.start_time,
			customer_name: reservationForm.value.customer_name,
			customer_phone: reservationForm.value.customer_phone,
			customer_email: reservationForm.value.customer_email || null,
			customer_comments: reservationForm.value.customer_comments || null,
		})

		const booked: AppointmentSummary = response.data.data

		confirmation.value = {
			folio: booked.folio,
			status: booked.status,
			service: booked.service,
			category: booked.category,
			barbero: booked.barbero,
			appointment_date: booked.appointment_date,
			start_time: booked.start_time,
			end_time: booked.end_time,
			customer_name: booked.customer_name,
		}

		showConfirmStepModal.value = false
		showReservationModal.value = false
		showConfirmationModal.value = true
		reservationForm.value = defaultReservationForm()
		slotPrefilled.value = false
		barberoOptions.value = []
		availableSlots.value = []
		// Actualiza el calendario público al instante — sin recargar la
		// página (spec §18/§36): el horario recién reservado deja de
		// aparecer libre para el resto de los clientes.
		loadCalendarEvents()
	} catch (error) {
		const status = error?.response?.status
		const backendMessage = error?.response?.data?.message
		const validationErrors = error?.response?.data?.errors

		if (status === 409) {
			// Mensaje exacto de negocio esperado por el flujo: el horario dejó de
			// estar disponible entre la consulta y la confirmación.
			Notify.create({
				type: 'warning',
				message:
					backendMessage ||
					'El horario seleccionado ya no está disponible. Selecciona otro horario.',
			})
			showConfirmStepModal.value = false
			loadAvailability()
		} else if (status === 422 && validationErrors) {
			const firstError = Object.values(validationErrors)[0]
			Notify.create({
				type: 'negative',
				message: Array.isArray(firstError) ? firstError[0] : backendMessage,
			})
			showConfirmStepModal.value = false
		} else if (status === 422 || status === 404) {
			Notify.create({
				type: 'negative',
				message: backendMessage || 'No se pudo completar la reserva. Verifica los datos.',
			})
			showConfirmStepModal.value = false
		} else {
			// Nunca mostrar el error técnico crudo al cliente.
			Notify.create({
				type: 'negative',
				message: 'Ocurrió un problema al reservar tu cita. Intenta de nuevo.',
			})
		}
	} finally {
		confirmingBooking.value = false
	}
}

const HEADER_OFFSET = 96

// "servicios"/"productos" cargan su contenido async (ver ServicesSection.vue/
// ProductsSection.vue) y reemplazan su nodo raíz al terminar; el div
// "*-anchor" que los envuelve en este archivo nunca se reemplaza, así que
// sirve como blanco estable de scroll/observer.
const SECTION_ANCHORS = {
	servicios: 'servicios-anchor',
	productos: 'productos-anchor',
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
		behavior: 'smooth',
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

// Punto único de apertura del modal de reserva SIN precarga (botones
// "Agendar Cita" del header/hero/drawer) — siempre arranca de un formulario
// limpio, nunca conserva fecha/hora de una selección de calendario anterior
// (spec §5: revisar que no queden estados previos con fecha/hora incorrecta).
function openReservationModal() {
	reservationForm.value = defaultReservationForm()
	slotPrefilled.value = false
	showReservationModal.value = true
}

function openReservationFromDrawer() {
	drawerOpen.value = false

	openReservationModal()
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
	const atBottom =
		window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

	if (atBottom) {
		const lastItem = menuItems[menuItems.length - 1]
		const lastEl = getSectionElement(lastItem.id)

		if (lastEl) {
			const rect = lastEl.getBoundingClientRect()
			const visibleHeight =
				Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, HEADER_OFFSET)
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

	loadServices()
	loadServiceCategories()
	loadCalendarEvents()
	loadWorkingHours()
	loadScheduleBlocks()
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
| Pinta las citas PENDIENTE/CONFIRMADA reales del negocio (GET agenda/citas,
| público, sin datos de cliente — ver PublicAppointmentCalendarResource).
| Se recarga tras cada reservación exitosa (loadCalendarEvents() en
| saveReservation) para reflejar la disponibilidad al instante, sin recargar
| la página.
*/
const calendarEvents = ref([])

// Horario real (WorkingHour) + bloqueos activos (ScheduleBlock) del mes
// visible — alimentan los límites/franjas "CERRADO" del calendario (ver
// calendarBounds y :blocks en el template). Nunca un rango fijo asumido.
const workingHours = ref([])
const scheduleBlocks = ref([])
const calendarBounds = computed(() => buildCalendarBounds(workingHours.value))

// Clic sobre un horario del calendario público: abre el modal de reserva
// con fecha (y hora, si el clic trae una hora exacta — Vista Día/Semana)
// ya precargadas, sin que el usuario tenga que volver a seleccionarlas
// (spec §4/§5). arg.allDay=true en Vista Mes (clic sobre un día completo,
// sin hora) — ahí solo se precarga la fecha, la hora se sigue eligiendo
// normalmente en "Horario disponible". La disponibilidad real del slot
// SIEMPRE se revalida contra AvailabilityService (aquí solo se refleja lo
// que el usuario ya vio pintado en el calendario, nunca se calcula aquí).
const clickPad = (n) => String(n).padStart(2, '0')
const clickIsoDate = (d) =>
	`${d.getFullYear()}-${clickPad(d.getMonth() + 1)}-${clickPad(d.getDate())}`

// Horario activo (WorkingHour) configurado para ese día de la semana — misma
// fuente ya cargada por loadWorkingHours() (calendarBounds la usa para
// pintar, esto la usa para el gate real del clic).
function findWorkingHourForDay(dayOfWeek) {
	return workingHours.value.find((d) => d.day_of_week === dayOfWeek && d.active) || null
}

// Bloqueo activo que cubre el instante clickeado (mismo criterio de
// traslape que AvailabilityService en backend: bloqueo de día completo por
// fecha, o rango específico por fecha+hora) — null si no hay ninguno.
// Devuelve el registro completo (no solo boolean) para poder mostrar su
// motivo real en el mensaje al usuario (spec §3/§4).
function findActiveBlockAt(dateObj) {
	const iso = clickIsoDate(dateObj)
	const hm = `${clickPad(dateObj.getHours())}:${clickPad(dateObj.getMinutes())}`
	const key = `${iso} ${hm}`

	return (
		scheduleBlocks.value.find((block) => {
			if (block.all_day) return block.starts_at.slice(0, 10) === iso
			return key >= block.starts_at && key < block.ends_at
		}) || null
	)
}

function blockedMessage(block) {
	return block?.reason
		? `Este horario se encuentra cerrado. Motivo: ${block.reason}.`
		: 'Este horario se encuentra cerrado.'
}

function handleCalendarDateClick(arg) {
	const clicked = arg.date
	const now = new Date()

	if (!arg.allDay && clicked < now) {
		Notify.create({
			type: 'warning',
			message: 'Ese horario ya pasó. Elige un horario disponible.',
		})
		return
	}

	// Fuera del horario de atención configurado en Agenda/Horario (o dentro
	// de un bloqueo activo) — no se abre el modal, se avisa por qué (gate
	// real del clic, no solo visual, ver spec §3). El backend siempre
	// revalida de nuevo al confirmar (AvailabilityService).
	if (arg.allDay) {
		const iso = clickIsoDate(clicked)
		const fullDayBlock = scheduleBlocks.value.find(
			(block) => block.all_day && block.starts_at.slice(0, 10) === iso,
		)

		if (fullDayBlock) {
			Notify.create({ type: 'warning', message: blockedMessage(fullDayBlock) })
			return
		}

		if (!findWorkingHourForDay(clicked.getDay())) {
			Notify.create({
				type: 'warning',
				message: 'Ese día no tiene horario de atención disponible.',
			})
			return
		}
	} else {
		const schedule = findWorkingHourForDay(clicked.getDay())
		const hm = `${clickPad(clicked.getHours())}:${clickPad(clicked.getMinutes())}`
		const withinSchedule = schedule && hm >= schedule.start_time && hm < schedule.end_time

		if (!withinSchedule) {
			Notify.create({
				type: 'warning',
				message: 'Ese horario está fuera del horario de atención configurado.',
			})
			return
		}

		const block = findActiveBlockAt(clicked)
		if (block) {
			Notify.create({ type: 'warning', message: blockedMessage(block) })
			return
		}
	}

	const displayDate = `${clickPad(clicked.getDate())}-${clickPad(clicked.getMonth() + 1)}-${clicked.getFullYear()}`

	reservationForm.value = defaultReservationForm()
	reservationForm.value.date = displayDate
	slotPrefilled.value = true

	if (!arg.allDay) {
		reservationForm.value.start_time = `${clickPad(clicked.getHours())}:${clickPad(clicked.getMinutes())}`
	}

	showReservationModal.value = true
}

function handleCalendarEventClick(arg) {
	citaDetail.value = citaDetailFromCalendarEvent(arg.event)
	showCitaDetailModal.value = true
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
	background: radial-gradient(circle at top, rgba(255, 105, 180, 0.12), #060606 45%);
	overflow-x: hidden;
}

/* HEADER */

.header-glass {
	background: rgba(0, 0, 0, 0.75);
	backdrop-filter: blur(12px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;
}

.cta-header-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 18px rgba(233, 30, 99, 0.35);
}

.mobile-menu-btn {
	display: none;
}

.mobile-drawer :deep(.q-drawer__content) {
	background: linear-gradient(160deg, rgba(15, 15, 15, 0.98), rgba(35, 10, 20, 0.97)) !important;
	color: #fff;
}

.drawer-inner {
	min-height: 100%;
}

.drawer-header {
	background: rgba(255, 255, 255, 0.04);
	border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}

.drawer-logo {
	box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.35);
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
	transition:
		transform 0.25s ease,
		background 0.25s ease;
}

.drawer-close-btn:hover,
.drawer-close-btn:active {
	transform: rotate(90deg);
	background: rgba(255, 255, 255, 0.1);
}

.drawer-separator {
	background: rgba(255, 255, 255, 0.08);
}

.drawer-list {
	flex: 1 1 auto;
}

.drawer-item {
	color: #fff !important;
	border-radius: 12px;
	margin: 4px 10px;
	transition:
		background 0.2s ease,
		transform 0.2s ease;
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
	background: rgba(233, 30, 99, 0.15);
	transform: translateX(4px);
}

.drawer-item-active {
	background: rgba(233, 30, 99, 0.22);
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
	background: rgba(255, 255, 255, 0.03);
}

.drawer-cta-btn {
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;
}

.drawer-cta-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 18px rgba(233, 30, 99, 0.4);
}

/* HERO */

.hero-section {
	position: relative;
	min-height: 100vh;
	width: 100%;

	background-image: url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop');

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

	background: linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(91, 22, 45, 0.5));
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
	filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.45));
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
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;
}

.hero-cta:hover {
	transform: translateY(-3px) scale(1.03);
	box-shadow: 0 8px 24px rgba(233, 30, 99, 0.4);
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

/* SERVICES (legado, mantenido por compatibilidad visual) */

.services-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20px;
}

.service-card {
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 24px;
	backdrop-filter: blur(10px);
	color: white;
	height: 100%;
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;
}

.service-card:hover {
	transform: translateY(-6px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
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
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
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
	background: rgba(0, 0, 0, 0.85);
}

.footer-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

/* ANIMATIONS */

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
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
		0 0 40px rgba(0, 0, 0, 0.45),
		0 0 20px rgba(212, 175, 55, 0.12);
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
	background: linear-gradient(145deg, rgba(20, 20, 20, 0.98), rgba(40, 40, 40, 0.95));

	color: white;

	border-radius: 24px;

	border: 1px solid rgba(255, 255, 255, 0.08);

	backdrop-filter: blur(18px);

	box-shadow:
		0 0 40px rgba(0, 0, 0, 0.45),
		0 0 20px rgba(212, 175, 55, 0.15);
}

.folio-highlight {
	background: rgba(212, 175, 55, 0.1);
	border: 1px dashed rgba(212, 175, 55, 0.5);
	border-radius: 12px;
	padding: 10px 16px;
	text-align: center;
}

.folio-search-btn {
	transition: transform 0.2s ease;
}

.folio-search-btn:hover {
	transform: scale(1.1);
}

.folio-inline-search {
	max-width: 420px;
	margin-left: auto;
	margin-right: auto;
}

.carousel-overlay {
	position: absolute;
	inset: 0;

	background: linear-gradient(135deg, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.25));
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

<template>
	<header-section title="Inicio" :icon-image="iconModule"></header-section>

	<div class="q-pa-md">
		<!-- Filtro: día único o rango, solo por calendario (spec §15) -->
		<div class="row items-end q-col-gutter-sm q-mb-md">
			<div class="col-12 col-sm-5 col-md-3">
				<q-input outlined dense readonly v-model="dateDisplay" label="Fecha">
					<template v-slot:append>
						<q-icon name="event" class="cursor-pointer">
							<q-popup-proxy cover transition-show="scale" transition-hide="scale">
								<q-date v-model="dateRange" mask="DD-MM-YYYY" range />
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>
			</div>
			<div class="col-auto q-gutter-sm">
				<q-btn color="primary" label="Buscar" @click="applyFilter" />
				<q-btn flat label="Limpiar" @click="clearFilter" />
			</div>
		</div>

		<!-- Sin permiso de Agenda: Inicio sigue siendo accesible (spec §14, es
		     el módulo inicial de CUALQUIER admin), pero los datos son de Agenda
		     y su endpoint exige permission:agenda en backend — se evita pedirlos
		     y mostrar un 403 en consola. -->
		<q-banner v-if="!hasAgendaPermission" class="bg-grey-3 text-grey-9" rounded>
			No tienes permiso para ver las estadísticas de Agenda.
		</q-banner>

		<template v-else>
			<q-banner v-if="loadError" class="bg-negative text-white q-mb-md" rounded>
				No se pudieron cargar las estadísticas. Intenta de nuevo.
			</q-banner>

			<!-- Tarjetas de estatus (spec §16/§17) — datos reales, colores
			     tomados de STATUS_META (misma fuente que StatusChip.vue/Agenda). -->
			<div class="row q-col-gutter-md q-mb-md">
				<div class="col-6 col-md-4 col-lg-2" v-for="card in cards" :key="card.key">
					<q-card :class="`bg-${card.color} text-${card.textColor}`" flat>
						<q-card-section class="text-center">
							<q-icon :name="card.icon" size="28px" class="q-mb-xs" />
							<div class="text-caption text-weight-medium">{{ card.label }}</div>
							<div class="text-h4 text-weight-bold">{{ card.count }}</div>
						</q-card-section>
					</q-card>
				</div>
			</div>

			<!-- Gráfica de barras (spec §18) — oculta en móvil para priorizar
			     tarjetas/legibilidad, sin sacrificar información (las tarjetas de
			     arriba ya muestran todos los datos en cualquier tamaño). -->
			<q-card v-if="!$q.screen.lt.md" flat bordered>
				<q-card-section>
					<div class="text-subtitle1 q-mb-md">Citas por estatus</div>
					<div class="dashboard-chart">
						<div v-for="card in statusCards" :key="card.key" class="dashboard-chart-col">
							<div class="dashboard-chart-track">
								<div
									:class="`bg-${card.color} dashboard-chart-bar`"
									:style="{ height: barHeight(card.count) }"
								/>
							</div>
							<div class="text-caption text-center q-mt-xs">{{ card.count }}</div>
							<div class="text-caption text-center text-grey-7">{{ card.label }}</div>
						</div>
					</div>
				</q-card-section>
			</q-card>
		</template>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import HeaderSection from 'components/HeaderSection.vue'
import iconModule from 'src/assets/icons/Home/reportes.png'
import { useAuthUserStore } from 'src/stores/AuthUser'
import { DashboardApi } from 'src/services/administration/agenda/AgendaAdminServices'
import { STATUS_META } from 'src/utils/agendaStatus'

const $q = useQuasar()
const authStore = useAuthUserStore()
const hasAgendaPermission = computed(() => authStore.hasPermission('agenda'))

// Etiquetas en plural para el dashboard (STATUS_META trae el singular usado
// por StatusChip.vue en una sola cita) — mismo color/ícono, reutilizado sin
// duplicar la fuente de verdad.
const CARD_LABELS = {
	PENDIENTE: 'Pendientes',
	CONFIRMADA: 'Confirmadas',
	CANCELADA: 'Canceladas',
	COMPLETADA: 'Completadas',
	NO_SHOW: 'No show',
}

const pad = (n) => String(n).padStart(2, '0')
const todayDMY = () => {
	const d = new Date()
	return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}
const toIsoDate = (displayDate) => {
	const [day, month, year] = displayDate.split('-')
	return `${year}-${month}-${day}`
}

// Por defecto: día actual (spec §15).
const dateRange = ref({ from: todayDMY(), to: todayDMY() })
const appliedRange = ref({ start: toIsoDate(todayDMY()), end: toIsoDate(todayDMY()) })

const dateDisplay = computed(() => {
	const range = dateRange.value
	if (!range) return ''
	if (typeof range === 'string') return range
	if (!range.from) return ''
	return range.from === range.to ? range.from : `${range.from} - ${range.to}`
})

const loadError = ref(false)
const counts = ref({})

const load = async () => {
	if (!hasAgendaPermission.value) return
	loadError.value = false
	try {
		const response = await DashboardApi.summary(appliedRange.value.start, appliedRange.value.end)
		counts.value = response.data.success ? response.data.data.by_status : {}
	} catch {
		loadError.value = true
		counts.value = {}
	}
}

const applyFilter = () => {
	const range = dateRange.value
	if (range && typeof range === 'object' && range.from) {
		appliedRange.value = { start: toIsoDate(range.from), end: toIsoDate(range.to || range.from) }
	} else if (typeof range === 'string' && range) {
		appliedRange.value = { start: toIsoDate(range), end: toIsoDate(range) }
	}
	load()
}

// Limpiar regresa al día actual (spec §10, mismo criterio aplicado aquí) —
// nunca deja el dashboard sin datos.
const clearFilter = () => {
	dateRange.value = { from: todayDMY(), to: todayDMY() }
	appliedRange.value = { start: toIsoDate(todayDMY()), end: toIsoDate(todayDMY()) }
	load()
}

// "Citas hoy" cuando el filtro es exactamente hoy; "Citas en el rango"
// cuando el admin eligió otro día u otro rango — mismo dato (total), solo
// cambia la etiqueta para no decir "hoy" de una fecha que no es hoy.
const isToday = computed(
	() => appliedRange.value.start === toIsoDate(todayDMY()) && appliedRange.value.end === toIsoDate(todayDMY()),
)

const totalCount = computed(() => Object.values(counts.value).reduce((sum, n) => sum + (n || 0), 0))

const statusCards = computed(() =>
	Object.entries(STATUS_META).map(([status, meta]) => ({
		key: status,
		label: CARD_LABELS[status] || meta.label,
		color: meta.color,
		textColor: meta.textColor || 'white',
		icon: meta.icon,
		count: counts.value[status] || 0,
	})),
)

const cards = computed(() => [
	{
		key: 'total',
		label: isToday.value ? 'Citas hoy' : 'Citas en el rango',
		color: 'dark',
		textColor: 'white',
		icon: 'event_note',
		count: totalCount.value,
	},
	...statusCards.value,
])

const maxCount = computed(() => Math.max(1, ...statusCards.value.map((c) => c.count)))
const barHeight = (count) => `${Math.max(4, (count / maxCount.value) * 100)}%`

onMounted(load)
</script>

<style scoped>
.dashboard-chart {
	display: flex;
	align-items: flex-end;
	gap: 24px;
	height: 180px;
	padding: 8px 0;
}

.dashboard-chart-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
}

.dashboard-chart-track {
	flex: 1;
	display: flex;
	align-items: flex-end;
	width: 100%;
}

.dashboard-chart-bar {
	width: 100%;
	border-radius: 4px 4px 0 0;
	transition: height 0.2s ease;
}
</style>

<template>
	<div class="q-pa-md">
		<div class="row justify-between items-center q-mb-md bloqueos-toolbar">
			<q-btn
				outline
				color="primary"
				icon="filter_alt"
				label="Filtros"
				class="bloqueos-toolbar-btn"
				@click="filterDialogOpen = true"
			/>
			<q-btn
				color="primary"
				icon="add"
				label="Nuevo bloqueo"
				class="bloqueos-toolbar-btn"
				@click="formOpen = true"
			/>
		</div>

		<q-table
			:rows="rows"
			:columns="columns"
			row-key="hash_id"
			flat
			bordered
			:loading="loading"
			:class="{ 'compact-table': isCompact }"
		>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td>{{ formatRange(props.row) }}</q-td>
					<q-td v-if="!isCompact">{{
						props.row.all_day ? 'Todo el día' : 'Horario específico'
					}}</q-td>
					<q-td>{{ props.row.reason || '—' }}</q-td>
					<q-td align="center">
						<q-chip
							:color="props.row.active ? 'positive' : 'grey-6'"
							text-color="white"
							dense
							square
						>
							{{ props.row.active ? 'Activo' : 'Inactivo' }}
						</q-chip>
					</q-td>
					<q-td align="center">
						<q-btn
							size="sm"
							:color="props.row.active ? 'grey-6' : 'positive'"
							:icon="props.row.active ? 'toggle_off' : 'toggle_on'"
							flat
							round
							dense
							@click="confirmToggle(props.row)"
						>
							<q-tooltip>{{ props.row.active ? 'Desactivar' : 'Activar' }}</q-tooltip>
						</q-btn>
					</q-td>
				</q-tr>
			</template>
			<template v-slot:no-data>
				<div class="full-width row flex-center text-grey-7 q-pa-md">
					No hay bloqueos registrados.
				</div>
			</template>
		</q-table>

		<BlockManagerDialog v-model="formOpen" @created="onCreated" />

		<!-- Filtros (spec §12): fecha (día/rango, solo por calendario) + estado.
		     "Tipo" no se agregó: ScheduleBlock no tiene ningún campo de tipo en
		     backend hoy (verificado en el modelo) — se reporta, no se inventa
		     una taxonomía sin que se pida explícitamente. -->
		<Modal v-model="filterDialogOpen" title="Filtros" header-color="#691c32">
			<div class="q-pa-md q-gutter-md">
				<q-input
					outlined
					dense
					readonly
					clearable
					v-model="filterDateDisplay"
					label="Fecha"
					placeholder="Todas"
					@clear="filterDateRange = null"
				>
					<template v-slot:append>
						<q-icon name="event" class="cursor-pointer">
							<q-popup-proxy cover transition-show="scale" transition-hide="scale">
								<q-date v-model="filterDateRange" mask="DD-MM-YYYY" range />
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>

				<q-select
					outlined
					dense
					clearable
					emit-value
					map-options
					v-model="filterActive"
					:options="statusOptions"
					label="Estado"
				/>

				<div class="row justify-end q-gutter-sm">
					<q-btn flat label="Limpiar" @click="clearFilters" />
					<q-btn color="primary" label="Buscar" @click="applyFilters" />
				</div>
			</div>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Dialog, Notify, useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import DeleteAlert from 'components/DeleteAlert.vue'
import Modal from 'components/Modal.vue'
import BlockManagerDialog from './BlockManagerDialog.vue'
import { ScheduleBlockApi } from 'src/services/administration/agenda/AgendaAdminServices'
import type { ScheduleBlockRecord } from 'src/interfaces/agenda'
import { formatIsoDateDMY } from 'src/utils/date'

// Listado principal de bloqueos — antes vivía solo dentro de un modal
// (BlockManagerDialog), ahora es el contenido del tab "Bloqueos" de Agenda.
// Reutiliza ScheduleBlockApi (index/store/remove) y BlockManagerDialog
// (reducido a solo el formulario de alta) sin duplicar su lógica.
const emit = defineEmits(['changed'])
const $q = useQuasar()

const rows = ref<ScheduleBlockRecord[]>([])
const loading = ref(false)
const formOpen = ref(false)

// Filtros (spec §12) — fecha (día/rango, solo por calendario, sin captura
// manual) + estado. Reutiliza el filtro `active` ya soportado por
// ScheduleBlockCatalogService::getAll() y agrega start/end ahí mismo.
const filterDialogOpen = ref(false)
const filterDateRange = ref<{ from: string; to: string } | string | null>(null)
const filterActive = ref<boolean | ''>('')
const activeFilters = ref<{ start: string | null; end: string | null; active: boolean | '' }>({
	start: null,
	end: null,
	active: '',
})

const statusOptions = [
	{ label: 'Activo', value: true },
	{ label: 'Inactivo', value: false },
]

const filterDateDisplay = computed(() => {
	const range = filterDateRange.value
	if (!range) return ''
	if (typeof range === 'string') return range
	if (!range.from) return ''
	return range.from === range.to ? range.from : `${range.from} - ${range.to}`
})

// 'DD-MM-YYYY' (q-date) -> 'YYYY-MM-DD' (lo que espera el backend), mismo
// criterio que BlockManagerDialog.vue::toIsoDate().
const toIsoDate = (displayDate: string) => {
	const [day, month, year] = displayDate.split('-')
	return `${year}-${month}-${day}`
}

// Mismo criterio que views/administration/servicios/Index.vue (referencia
// responsive del proyecto): xs/sm (< 1024px) = tabla compacta, oculta solo
// la columna menos esencial ("Tipo", inferible de "Fecha/horario"); "Motivo"
// y "Acciones" nunca se ocultan.
const isCompact = computed(() => $q.screen.lt.md)

const columns = computed<QTableColumn<ScheduleBlockRecord>[]>(() => {
	const cols: QTableColumn<ScheduleBlockRecord>[] = [
		{ name: 'range', label: 'Fecha / horario', field: 'starts_at', align: 'left' },
	]

	if (!isCompact.value) {
		cols.push({ name: 'type', label: 'Tipo', field: 'all_day', align: 'left' })
	}

	cols.push(
		{ name: 'reason', label: 'Motivo', field: 'reason', align: 'left' },
		{ name: 'active', label: 'Estado', field: 'active', align: 'center' },
		{ name: 'actions', label: 'Acciones', field: () => '', align: 'center' },
	)

	return cols
})

const formatRange = (row: ScheduleBlockRecord) => {
	// DD-MM-YYYY (spec §8) — starts_at/ends_at siguen llegando en formato ISO.
	const date = formatIsoDateDMY(row.starts_at.slice(0, 10))
	if (row.all_day) return date
	return `${date} ${row.starts_at.slice(11, 16)} - ${row.ends_at.slice(11, 16)}`
}

const load = async () => {
	loading.value = true
	try {
		const response = await ScheduleBlockApi.index(activeFilters.value)
		if (response.data.success) rows.value = response.data.data
	} finally {
		loading.value = false
	}
}

const applyFilters = () => {
	const range = filterDateRange.value
	let start: string | null = null
	let end: string | null = null

	if (range && typeof range === 'object' && range.from) {
		start = toIsoDate(range.from)
		end = toIsoDate(range.to || range.from)
	} else if (typeof range === 'string' && range) {
		start = toIsoDate(range)
		end = start
	}

	activeFilters.value = { start, end, active: filterActive.value }
	filterDialogOpen.value = false
	load()
}

// Spec §10 (mismo criterio aplicado aquí para Bloqueos): Limpiar regresa al
// estado sin filtros (todas las fechas, todos los estados), no deja la tabla
// vacía.
const clearFilters = () => {
	filterDateRange.value = null
	filterActive.value = ''
	activeFilters.value = { start: null, end: null, active: '' }
	filterDialogOpen.value = false
	load()
}

const onCreated = () => {
	load()
	// El calendario (tab Calendario) pinta franjas "CERRADO" con estos mismos
	// bloqueos y puede haber cancelado citas por el traslape (ver
	// ScheduleBlockCatalogService::cancelOverlappingAppointments) — se
	// notifica al padre (Index.vue) para que refresque ese tab también.
	emit('changed')
}

// Activar/Desactivar (spec §13) — reemplaza el antiguo "Eliminar" (borrado
// físico). Reutiliza el mismo campo `active` que ya trae cada bloqueo, sin
// una segunda lógica de estados. Mismo color de cabecera que el header
// administrativo en la confirmación (spec §4).
const confirmToggle = (row: ScheduleBlockRecord) => {
	const activating = !row.active

	Dialog.create({
		component: DeleteAlert,
		componentProps: {
			icon: activating ? 'toggle_on' : 'toggle_off',
			title: activating ? 'Activar bloqueo' : 'Desactivar bloqueo',
			subtitle: formatRange(row),
			question: activating ? '¿Deseas activar este bloqueo?' : '¿Deseas desactivar este bloqueo?',
			button: activating ? 'Activar' : 'Desactivar',
			avatarStyle: 'background-color:#691c32',
		},
	}).onOk(async () => {
		try {
			await ScheduleBlockApi.toggleActive(row.hash_id)
			Notify.create({
				type: 'positive',
				message: activating ? 'Bloqueo activado.' : 'Bloqueo desactivado.',
			})
			load()
			emit('changed')
		} catch {
			Notify.create({ type: 'negative', message: 'No se pudo actualizar el estado.' })
		}
	})
}

onMounted(load)
</script>

<style scoped>
/* Mismo patrón que views/administration/servicios/Index.vue: table-layout
   fixed en compacto evita que "Motivo" (texto libre, puede ser largo)
   empuje la columna "Acciones" fuera de la vista — se trunca con ellipsis
   en vez de eso. */
.compact-table :deep(table) {
	table-layout: fixed;
	width: 100%;
}

.compact-table :deep(th),
.compact-table :deep(td) {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.bloqueos-toolbar {
	flex-wrap: wrap;
	gap: 8px;
}

@media (max-width: 599px) {
	.bloqueos-toolbar-btn {
		width: 100%;
	}
}
</style>

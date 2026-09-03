<template>
	<div class="q-pa-md">
		<div class="row justify-end q-mb-md">
			<q-btn color="primary" icon="add" label="Nuevo bloqueo" @click="formOpen = true" />
		</div>

		<q-table :rows="rows" :columns="columns" row-key="hash_id" flat bordered :loading="loading">
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td>{{ formatRange(props.row) }}</q-td>
					<q-td>{{ props.row.all_day ? 'Todo el día' : 'Horario específico' }}</q-td>
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
							color="negative"
							icon="delete"
							flat
							round
							dense
							@click="confirmRemove(props.row)"
						>
							<q-tooltip>Eliminar</q-tooltip>
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
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dialog, Notify } from 'quasar'
import type { QTableColumn } from 'quasar'
import DeleteAlert from 'components/DeleteAlert.vue'
import BlockManagerDialog from './BlockManagerDialog.vue'
import { ScheduleBlockApi } from 'src/services/administration/agenda/AgendaAdminServices'
import type { ScheduleBlockRecord } from 'src/interfaces/agenda'

// Listado principal de bloqueos — antes vivía solo dentro de un modal
// (BlockManagerDialog), ahora es el contenido del tab "Bloqueos" de Agenda.
// Reutiliza ScheduleBlockApi (index/store/remove) y BlockManagerDialog
// (reducido a solo el formulario de alta) sin duplicar su lógica.
const emit = defineEmits(['changed'])

const rows = ref<ScheduleBlockRecord[]>([])
const loading = ref(false)
const formOpen = ref(false)

const columns: QTableColumn<ScheduleBlockRecord>[] = [
	{ name: 'range', label: 'Fecha / horario', field: 'starts_at', align: 'left' },
	{ name: 'type', label: 'Tipo', field: 'all_day', align: 'left' },
	{ name: 'reason', label: 'Motivo', field: 'reason', align: 'left' },
	{ name: 'active', label: 'Estado', field: 'active', align: 'center' },
	{ name: 'actions', label: 'Acciones', field: () => '', align: 'center' },
]

const formatRange = (row: ScheduleBlockRecord) => {
	const date = row.starts_at.slice(0, 10)
	if (row.all_day) return date
	return `${date} ${row.starts_at.slice(11, 16)} - ${row.ends_at.slice(11, 16)}`
}

const load = async () => {
	loading.value = true
	try {
		const response = await ScheduleBlockApi.index()
		if (response.data.success) rows.value = response.data.data
	} finally {
		loading.value = false
	}
}

const onCreated = () => {
	load()
	// El calendario (tab Calendario) pinta franjas "CERRADO" con estos mismos
	// bloqueos y puede haber cancelado citas por el traslape (ver
	// ScheduleBlockCatalogService::cancelOverlappingAppointments) — se
	// notifica al padre (Index.vue) para que refresque ese tab también.
	emit('changed')
}

const confirmRemove = (row: ScheduleBlockRecord) => {
	Dialog.create({
		component: DeleteAlert,
		componentProps: {
			icon: 'delete',
			title: 'Eliminar bloqueo',
			subtitle: 'Esta acción no se puede deshacer',
			question: '¿Eliminar este bloqueo?',
			button: 'Eliminar',
		},
	}).onOk(async () => {
		try {
			await ScheduleBlockApi.remove(row.hash_id)
			Notify.create({ type: 'positive', message: 'Eliminado.' })
			load()
			emit('changed')
		} catch {
			Notify.create({ type: 'negative', message: 'No se pudo eliminar.' })
		}
	})
}

onMounted(load)
</script>

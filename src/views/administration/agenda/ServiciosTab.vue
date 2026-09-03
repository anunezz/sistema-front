<template>
	<div class="q-pa-md">
		<div class="row justify-end q-mb-md">
			<q-btn color="primary" icon="add" label="Nuevo servicio agendable" @click="openNew" />
		</div>

		<q-table
			:rows="rows"
			:columns="columns"
			row-key="hash_id"
			flat
			bordered
			dense
			:loading="loading"
		>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td>{{ props.row.name }}</q-td>
					<q-td>{{ props.row.category?.title || '—' }}</q-td>
					<q-td>{{ props.row.duration_minutes }} min</q-td>
					<q-td>{{ props.row.price ?? '—' }}</q-td>
					<q-td>
						<q-chip
							square
							dense
							:color="props.row.active ? 'positive' : 'grey-6'"
							text-color="white"
						>
							{{ props.row.active ? 'Activo' : 'Inactivo' }}
						</q-chip>
					</q-td>
					<q-td align="center">
						<q-btn-group>
							<q-btn
								size="sm"
								color="positive"
								icon="edit"
								@click="openEdit(props.row)"
							>
								<q-tooltip>Editar</q-tooltip>
							</q-btn>
							<q-btn
								size="sm"
								color="negative"
								icon="delete"
								@click="confirmRemove(props.row)"
							>
								<q-tooltip>Eliminar</q-tooltip>
							</q-btn>
						</q-btn-group>
					</q-td>
				</q-tr>
			</template>
		</q-table>

		<q-dialog v-model="dialog" persistent>
			<q-card style="min-width: 380px">
				<q-card-section class="text-h6">
					{{ form.hash_id ? 'Editar servicio agendable' : 'Nuevo servicio agendable' }}
				</q-card-section>
				<q-form @submit.prevent="save">
					<q-card-section class="q-gutter-md">
						<q-select
							v-model="form.service_category_id"
							:options="categoryOptions"
							option-value="value"
							option-label="label"
							emit-value
							map-options
							label="Categoría (Servicios)"
							outlined
							dense
							:rules="[isRequired]"
						/>
						<q-input
							v-model="form.name"
							label="Nombre del servicio"
							:rules="[isRequired]"
							outlined
							dense
						/>
						<q-input
							v-model.number="form.duration_minutes"
							type="number"
							label="Duración (minutos)"
							:rules="[isRequired]"
							outlined
							dense
						/>
						<q-input
							v-model.number="form.price"
							type="number"
							step="0.01"
							label="Precio"
							outlined
							dense
						/>
						<q-toggle v-model="form.active" label="Activo" />
					</q-card-section>
					<q-card-actions align="right">
						<q-btn flat label="Cancelar" @click="dialog = false" />
						<q-btn type="submit" color="primary" label="Guardar" />
					</q-card-actions>
				</q-form>
			</q-card>
		</q-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dialog, Notify } from 'quasar'
import type { QTableColumn } from 'quasar'
import DeleteAlert from 'components/DeleteAlert.vue'
import CatServiciosServices from 'src/services/administration/catalogs/CatServiciosServices'
import { AppointmentServiceApi } from 'src/services/administration/agenda/AgendaAdminServices'
import type { AppointmentServiceRecord } from 'src/interfaces/agenda'

const isRequired = (val: unknown) =>
	(val !== null && val !== '' && val !== undefined) || 'Campo obligatorio'

const rows = ref<AppointmentServiceRecord[]>([])
const loading = ref(false)
const categoryOptions = ref<{ label: string; value: number }[]>([])

const columns: QTableColumn<AppointmentServiceRecord>[] = [
	{ name: 'name', label: 'Servicio', field: 'name', align: 'left' },
	{ name: 'category', label: 'Categoría', field: (row) => row.category?.title, align: 'left' },
	{ name: 'duration', label: 'Duración', field: 'duration_minutes', align: 'left' },
	{ name: 'price', label: 'Precio', field: 'price', align: 'left' },
	{ name: 'active', label: 'Estado', field: 'active', align: 'left' },
	{ name: 'actions', label: 'Acciones', field: () => '', align: 'center' },
]

const loadCategories = async () => {
	// Reutiliza el catálogo administrativo de ServiceCategory ya existente
	// (módulo Servicios) — no se duplica la fuente de categorías.
	const response = await CatServiciosServices.index({
		params: {
			page: 1,
			rowsPerPage: 100,
			filters: { title: null, module_id: null, active: null },
		},
	})
	if (response.data.success) {
		categoryOptions.value = response.data.data.data.map((c) => ({
			label: c.title,
			value: c.id,
		}))
	}
}

const load = async () => {
	loading.value = true
	try {
		const response = await AppointmentServiceApi.index()
		if (response.data.success) rows.value = response.data.data
	} finally {
		loading.value = false
	}
}

const dialog = ref(false)
const defaultForm = (): Partial<AppointmentServiceRecord> => ({
	service_category_id: undefined,
	name: '',
	duration_minutes: 30,
	price: null,
	active: true,
})
const form = ref<Partial<AppointmentServiceRecord>>(defaultForm())

const openNew = () => {
	form.value = defaultForm()
	dialog.value = true
}

const openEdit = (row: AppointmentServiceRecord) => {
	form.value = { ...row }
	dialog.value = true
}

const save = async () => {
	try {
		if (form.value.hash_id) {
			await AppointmentServiceApi.update(form.value.hash_id, form.value)
		} else {
			await AppointmentServiceApi.store(form.value)
		}
		Notify.create({ type: 'positive', message: 'Guardado correctamente.' })
		dialog.value = false
		load()
	} catch {
		Notify.create({ type: 'negative', message: 'No se pudo guardar.' })
	}
}

const confirmRemove = (row: AppointmentServiceRecord) => {
	Dialog.create({
		component: DeleteAlert,
		componentProps: {
			icon: 'delete',
			title: 'Eliminar servicio agendable',
			subtitle: 'Esta acción no se puede deshacer',
			question: `¿Eliminar "${row.name}"?`,
			button: 'Eliminar',
		},
	}).onOk(async () => {
		try {
			await AppointmentServiceApi.remove(row.hash_id)
			Notify.create({ type: 'positive', message: 'Eliminado.' })
			load()
		} catch {
			Notify.create({ type: 'negative', message: 'No se pudo eliminar.' })
		}
	})
}

onMounted(() => {
	loadCategories()
	load()
})
</script>

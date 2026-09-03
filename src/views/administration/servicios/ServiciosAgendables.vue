<template>
	<header-section :title="pageTitle" url-redirect="IndexServicios" :icon-image="iconModule" />
	<br />

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
			no-data-label="No hay servicios agendables para este Servicio"
		>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td>{{ props.row.name }}</q-td>
					<q-td>{{ props.row.duration_minutes }} min</q-td>
					<q-td>{{ formatPrice(props.row.price) }}</q-td>
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
								:color="props.row.active ? 'warning' : 'primary'"
								:icon="props.row.active ? 'block' : 'check_circle'"
								@click="toggleActive(props.row)"
							>
								<q-tooltip>{{
									props.row.active ? 'Desactivar' : 'Activar'
								}}</q-tooltip>
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
				<q-card-section class="servicio-modal-header text-white">
					<div class="text-h6">
						{{
							form.hash_id ? 'Editar servicio agendable' : 'Nuevo servicio agendable'
						}}
					</div>
					<div class="text-caption">{{ categoryTitle }}</div>
				</q-card-section>
				<q-form ref="formRef" @submit.prevent="save">
					<q-card-section class="q-gutter-md">
						<!-- El Servicio padre NO se selecciona aquí: viene fijo de la
						     pantalla desde la que se abrió (spec §7 — "el usuario no
						     debería tener que seleccionar manualmente otro Servicio
						     padre"). -->
						<q-input
							outlined
							dense
							readonly
							:model-value="categoryTitle"
							label="Servicio (padre)"
						/>
						<q-input
							v-model="form.name"
							label="Nombre del servicio agendable"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Dialog, Notify } from 'quasar'
import type { QForm, QTableColumn } from 'quasar'
import HeaderSection from 'components/HeaderSection.vue'
import DeleteAlert from 'components/DeleteAlert.vue'
import { useCatServiciosStore } from 'src/stores/CatServicios'
import { AppointmentServiceApi } from 'src/services/administration/agenda/AgendaAdminServices'
import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png'
import type { AppointmentServiceRecord } from 'src/interfaces/agenda'

const iconModule = ref(imageRoute)
const router = useRouter()
const route = useRoute()
const store = useCatServiciosStore()

const isRequired = (val: unknown) =>
	(val !== null && val !== '' && val !== undefined) || 'Campo obligatorio'

// Fuente de verdad: el hash_id en la URL (no solo Pinia) — mismo criterio
// que Contenido.vue, así F5 / abrir el link directo reconstruye el
// contexto consultando la API en vez de depender de navegación previa.
const serviceHashId = computed(() => (route.params.hash_id as string) || null)
const categoryTitle = computed(() => store.selectedService?.title ?? '')
const categoryId = computed(() => store.selectedService?.id ?? null)
const pageTitle = computed(() => `SERVICIOS / SERVICIOS AGENDABLES / ${categoryTitle.value}`)

const rows = ref<AppointmentServiceRecord[]>([])
const loading = ref(false)

const columns: QTableColumn<AppointmentServiceRecord>[] = [
	{ name: 'name', label: 'Servicio agendable', field: 'name', align: 'left' },
	{ name: 'duration', label: 'Duración', field: 'duration_minutes', align: 'left' },
	{ name: 'price', label: 'Precio', field: 'price', align: 'left' },
	{ name: 'active', label: 'Estado', field: 'active', align: 'left' },
	{ name: 'actions', label: 'Acciones', field: () => '', align: 'center' },
]

const formatPrice = (price: string | number | null) => {
	if (price === null || price === undefined || price === '') return '—'
	const num = Number(price)
	return Number.isNaN(num) ? '—' : `$${num.toFixed(2)}`
}

// Solo los servicios agendables del Servicio padre actual — nunca de otro
// (spec §6: "NO permitir que aparezcan registros de otros Servicios").
// Reutiliza AppointmentService::scopeSearch() ya existente vía el filtro
// service_category_id, sin endpoint nuevo.
const load = async () => {
	if (categoryId.value === null) return

	loading.value = true
	try {
		const response = await AppointmentServiceApi.index({
			service_category_id: categoryId.value,
		})
		if (response.data.success) rows.value = response.data.data
	} finally {
		loading.value = false
	}
}

const dialog = ref(false)
const formRef = ref<QForm | null>(null)
const defaultForm = (): Partial<AppointmentServiceRecord> => ({
	service_category_id: categoryId.value ?? undefined,
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
	const valid = await formRef.value?.validate()
	if (!valid) return

	// El Servicio padre siempre es el de esta pantalla — nunca el que traiga
	// el registro editado, por si en algún momento se editó desde otro sitio.
	const payload = { ...form.value, service_category_id: categoryId.value ?? undefined }

	try {
		if (payload.hash_id) {
			await AppointmentServiceApi.update(payload.hash_id, payload)
		} else {
			await AppointmentServiceApi.store(payload)
		}
		Notify.create({ type: 'positive', message: 'Guardado correctamente.' })
		dialog.value = false
		load()
	} catch {
		Notify.create({ type: 'negative', message: 'No se pudo guardar.' })
	}
}

const toggleActive = async (row: AppointmentServiceRecord) => {
	try {
		await AppointmentServiceApi.update(row.hash_id, { ...row, active: !row.active })
		Notify.create({ type: 'positive', message: 'Estado actualizado.' })
		load()
	} catch {
		Notify.create({ type: 'negative', message: 'No se pudo actualizar el estado.' })
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

onMounted(async () => {
	if (serviceHashId.value === null) {
		router.push({ name: 'IndexServicios' })
		return
	}

	const currentMatches =
		store.selectedService?.hash_id === serviceHashId.value ||
		String(store.selectedService?.id) === serviceHashId.value

	if (!currentMatches) {
		const loaded = await store.loadServiceByHashId(serviceHashId.value)
		if (!loaded) {
			router.push({ name: 'IndexServicios' })
			return
		}
	}

	load()
})
</script>

<style scoped>
.servicio-modal-header {
	background: linear-gradient(to bottom, #611232, #9b2247);
	padding: 16px 20px;
}
</style>

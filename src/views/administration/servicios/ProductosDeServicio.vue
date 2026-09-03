<template>
	<header-section :title="pageTitle" url-redirect="IndexServicios" :icon-image="iconModule" />
	<br />

	<div class="q-pa-md">
		<div class="row justify-end q-mb-md">
			<q-btn
				unelevated
				size="16px"
				color="pink-6"
				text-color="white"
				icon="add_shopping_cart"
				label="Agregar producto"
				class="add-product-btn"
				@click="openNew"
			/>
		</div>

		<q-table
			:rows="rows"
			:columns="columns"
			row-key="hash_id"
			flat
			bordered
			:loading="loading"
			no-data-label="No hay productos para este Servicio"
			rows-per-page-label="Registros por página"
			v-model:pagination="pagination"
			:rows-per-page-options="[5, 10, 20, 50]"
			@request="onRequest"
		>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td style="text-align: center">
						<q-img
							v-if="props.row.image?.path"
							:src="mediaUrl(props.row.image.path)"
							style="width: 60px; height: 45px; border-radius: 4px"
							fit="cover"
						/>
						<span v-else class="text-grey">Sin imagen</span>
					</q-td>
					<q-td>{{ props.row.title }}</q-td>
					<q-td>{{ props.row.subtitle || '—' }}</q-td>
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
								@click="confirmToggleActive(props.row)"
							>
								<q-tooltip>{{
									props.row.active ? 'Desactivar' : 'Activar'
								}}</q-tooltip>
							</q-btn>
						</q-btn-group>
					</q-td>
				</q-tr>
			</template>
		</q-table>

		<!-- ALTA / EDICIÓN -->
		<q-dialog v-model="dialog" persistent transition-show="scale" :maximized="$q.screen.xs">
			<q-card
				class="product-form-card"
				style="min-width: 380px; max-width: 520px; width: 100%"
			>
				<q-card-section class="servicio-modal-header text-white">
					<div class="text-h6">
						{{ form.hash_id ? 'Editar producto' : 'Nuevo producto' }}
					</div>
					<div class="text-caption">{{ categoryTitle }}</div>
				</q-card-section>

				<q-form ref="formRef" @submit.prevent="save">
					<q-card-section class="q-gutter-md">
						<q-input
							v-model="form.title"
							label="Título"
							:rules="[isRequired]"
							outlined
							dense
							v-max="150"
						/>
						<q-input
							v-model="form.subtitle"
							label="Subtítulo"
							outlined
							dense
							v-max="255"
						/>
						<q-input
							v-model="form.description"
							type="textarea"
							label="Descripción"
							outlined
							dense
							autogrow
						/>
						<q-input
							v-model.number="form.price"
							type="number"
							step="0.01"
							prefix="$"
							label="Costo"
							:rules="[isRequired, isNonNegative]"
							outlined
							dense
						/>
						<q-input
							v-model.number="form.sort_order"
							type="number"
							label="Orden / prioridad"
							hint="Determina el orden en la tabla y cuáles son los 'productos destacados' de la Vista Pública (menor número = mayor prioridad)."
							:rules="[isRequired, isIntegerOrder]"
							outlined
							dense
						/>
						<q-toggle v-model="form.active" label="Activo" />

						<div>
							<label class="text-weight-bold"
								>Imagen {{ form.hash_id ? '' : '*' }}</label
							>

							<div class="product-image-preview q-my-sm">
								<q-img
									v-if="imagePreview"
									:src="imagePreview"
									fit="contain"
									style="width: 100%; height: 100%"
								/>
								<div v-else class="product-image-placeholder">
									<q-icon name="image" size="48px" color="grey-6" />
									<div class="text-caption text-grey-7 q-mt-xs">Sin imagen</div>
								</div>
							</div>

							<div class="text-center q-mb-sm">
								<div v-if="form.image" class="text-caption text-positive">
									Nueva imagen lista para guardar: {{ form.image.fileName }}
								</div>
								<div
									v-else-if="currentImage?.path"
									class="text-caption text-grey-7"
								>
									Imagen actual — selecciona un archivo para reemplazarla
								</div>
								<div v-else-if="imageError" class="text-caption text-negative">
									{{ imageError }}
								</div>
							</div>

							<UploadFileChuncks
								@success-file="onImageUploaded"
								:max_allowed_size_mb="3"
								:size_chunks_mb="2"
								type_file_front=".png, .jpg, .jpeg, .webp, .PNG, .JPG, .JPEG, .WEBP"
								:type_file_back_system="13"
								save_storage_folder="servicios/productos"
								save_storage_cunks_folder="servicios/productosChunks"
								url="upload/file-chunks"
							/>
						</div>
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
import { useQuasar, Dialog, Notify } from 'quasar'
import type { QForm, QTableColumn, QTableProps } from 'quasar'
import HeaderSection from 'components/HeaderSection.vue'
import DeleteAlert from 'components/DeleteAlert.vue'
import UploadFileChuncks from 'src/components/UploadFileChuncks.vue'
import { useCatServiciosStore } from 'src/stores/CatServicios'
import { ProductApi } from 'src/services/administration/catalogs/ProductServices'
import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png'
import type { ProductRecord, ProductUploadImage, ProductImage } from 'src/interfaces/product'

const iconModule = ref(imageRoute)
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const store = useCatServiciosStore()

const isRequired = (val: unknown) =>
	(val !== null && val !== '' && val !== undefined) || 'Campo obligatorio'
const isNonNegative = (val: number) =>
	(val !== null && val >= 0) || 'El costo no puede ser negativo'
const isIntegerOrder = (val: number) => Number.isInteger(val) || 'Debe ser un número entero'

// Fuente de verdad: el hash_id en la URL (no solo Pinia) — mismo criterio
// que Contenido.vue/ServiciosAgendables.vue, así F5 / abrir el link directo
// reconstruye el contexto consultando la API.
const serviceHashId = computed(() => (route.params.hash_id as string) || null)
const categoryTitle = computed(() => store.selectedService?.title ?? '')
const categoryId = computed(() => store.selectedService?.id ?? null)
const pageTitle = computed(() => `SERVICIOS / PRODUCTOS / ${categoryTitle.value}`)

const mediaUrl = (path: string) => `${process.env.API_URL}${path}`

const formatPrice = (price: string | number | null) => {
	if (price === null || price === undefined || price === '') return '—'
	const num = Number(price)
	return Number.isNaN(num) ? '—' : `$${num.toFixed(2)}`
}

const rows = ref<ProductRecord[]>([])
const loading = ref(false)

const pagination = ref({
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0,
	sortBy: 'sort_order',
	descending: false,
})

const columns: QTableColumn<ProductRecord>[] = [
	{
		name: 'image',
		label: 'Imagen',
		field: () => '',
		align: 'center',
		headerStyle: 'width: 90px',
	},
	{ name: 'title', label: 'Título', field: 'title', align: 'left' },
	{ name: 'subtitle', label: 'Subtítulo', field: 'subtitle', align: 'left' },
	{ name: 'price', label: 'Costo', field: 'price', align: 'left' },
	{ name: 'active', label: 'Estado', field: 'active', align: 'left' },
	{ name: 'actions', label: 'Acciones', field: () => '', align: 'center' },
]

// Solo los productos del Servicio padre actual — nunca de otro (mismo
// criterio que ServiciosAgendables.vue: filtro service_category_id vía
// Product::scopeSearch(), sin endpoint nuevo). rowsPerPage siempre
// presente -> el backend devuelve el paginador real (spec: "la tabla debe
// tener paginación").
const load = async () => {
	if (categoryId.value === null) return

	loading.value = true
	try {
		const response = await ProductApi.index({
			filters: { service_category_id: categoryId.value },
			page: pagination.value.page,
			rowsPerPage: pagination.value.rowsPerPage,
		})
		if (response.data.success) {
			const data = response.data.data as { data: ProductRecord[]; total: number }
			rows.value = data.data
			pagination.value.rowsNumber = data.total
		}
	} finally {
		loading.value = false
	}
}

const onRequest: QTableProps['onRequest'] = (requestProp) => {
	pagination.value.page = requestProp.pagination.page
	pagination.value.rowsPerPage = requestProp.pagination.rowsPerPage
	load()
}

const dialog = ref(false)
const formRef = ref<QForm | null>(null)
const currentImage = ref<ProductImage | null>(null)

interface ProductForm {
	hash_id?: string
	service_category_id?: number
	title: string
	subtitle: string
	description: string
	price: number | null
	active: boolean
	sort_order?: number
	image: ProductUploadImage | null
}

const defaultForm = (): ProductForm => ({
	service_category_id: categoryId.value ?? undefined,
	title: '',
	subtitle: '',
	description: '',
	price: null,
	active: true,
	sort_order: 1,
	image: null,
})
const form = ref<ProductForm>(defaultForm())
const imageError = ref('')

const imagePreview = computed(() => {
	if (form.value.image?.path) return mediaUrl(form.value.image.path)
	if (currentImage.value?.path) return mediaUrl(currentImage.value.path)
	return null
})

const onImageUploaded = (data: ProductUploadImage) => {
	form.value.image = data
	imageError.value = ''
}

const openNew = () => {
	form.value = defaultForm()
	currentImage.value = null
	imageError.value = ''
	dialog.value = true
}

const openEdit = (row: ProductRecord) => {
	form.value = {
		hash_id: row.hash_id,
		service_category_id: categoryId.value ?? undefined,
		title: row.title,
		subtitle: row.subtitle ?? '',
		description: row.description ?? '',
		price: Number(row.price),
		active: row.active,
		sort_order: row.sort_order,
		image: null,
	}
	currentImage.value = row.image ?? null
	imageError.value = ''
	dialog.value = true
}

const save = async () => {
	const valid = await formRef.value?.validate()
	if (!valid) return

	// Imagen obligatoria solo al CREAR (spec §7/§8) — al editar, sin imagen
	// nueva se conserva la actual (ver ProductService::update en backend).
	if (!form.value.hash_id && !form.value.image) {
		imageError.value = 'La imagen del producto es obligatoria.'
		return
	}

	// El Servicio padre siempre es el de esta pantalla, nunca el que traiga
	// el registro editado (mismo criterio que ServiciosAgendables.vue).
	const payload = { ...form.value, service_category_id: categoryId.value ?? undefined }
	if (!payload.image) delete (payload as { image?: unknown }).image

	try {
		if (payload.hash_id) {
			await ProductApi.update(payload.hash_id, payload)
		} else {
			await ProductApi.store(payload)
		}
		Notify.create({ type: 'positive', message: 'Guardado correctamente.' })
		dialog.value = false
		load()
	} catch (error) {
		const backendMessage = error?.response?.data?.errors
			? Object.values(error.response.data.errors)[0]?.[0]
			: error?.response?.data?.message
		Notify.create({ type: 'negative', message: backendMessage || 'No se pudo guardar.' })
	}
}

const confirmToggleActive = (row: ProductRecord) => {
	const action = row.active ? 'Desactivar' : 'Activar'

	Dialog.create({
		component: DeleteAlert,
		componentProps: {
			icon: row.active ? 'block' : 'check_circle',
			title: `${action} producto`,
			subtitle: row.active
				? 'El producto dejará de mostrarse en la Vista Pública'
				: 'El producto volverá a mostrarse en la Vista Pública',
			question: `¿${action} "${row.title}"?`,
			button: action,
		},
	}).onOk(async () => {
		try {
			// Solo se envían los campos propios del producto — NUNCA la
			// relación `image` ya cargada (ver ProductPayload): el backend
			// interpretaría un objeto ahí como intento de reemplazo de imagen
			// y, al no traer `file_location`, terminaría limpiando image_id.
			await ProductApi.update(row.hash_id, {
				service_category_id: categoryId.value ?? undefined,
				title: row.title,
				subtitle: row.subtitle,
				description: row.description,
				price: row.price,
				active: !row.active,
				sort_order: row.sort_order,
			})
			Notify.create({ type: 'positive', message: 'Estado actualizado.' })
			load()
		} catch {
			Notify.create({ type: 'negative', message: 'No se pudo actualizar el estado.' })
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

.add-product-btn {
	border-radius: 24px;
	font-weight: 600;
}

.product-image-preview {
	width: 100%;
	height: 160px;
	border: 1px dashed #ccc;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background: #fafafa;
}

.product-image-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

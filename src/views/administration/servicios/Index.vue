<template>
	<header-section title="Servicios" :icon-image="iconModule"></header-section>

	<q-dialog v-model="dialog" transition-show="scale" :maximized="$q.screen.xs">
		<q-card class="servicio-modal-card responsive-modal-card">
			<q-card-section
				class="servicio-modal-header text-white row items-center justify-between"
			>
				<div class="text-h6">Filtros Avanzados</div>
				<q-btn flat round dense icon="close" text-color="white" v-close-popup />
			</q-card-section>

			<q-form class="responsive-modal-form" @submit.prevent="attemptSearch">
				<q-card-section class="q-pa-lg responsive-modal-body">
					<div class="row q-col-gutter-md">
						<div class="col-12 col-sm-6">
							<q-input
								outlined
								clearable
								style="width: 100%"
								dense
								label="Título"
								placeholder="Título"
								v-model="store.filters.title"
								v-max="100"
							/>
						</div>

						<div class="col-12 col-sm-6">
							<q-input
								outlined
								clearable
								style="width: 100%"
								dense
								label="ID de Módulo"
								placeholder="ID de Módulo"
								type="number"
								v-model.number="store.filters.module_id"
							/>
						</div>

						<div class="col-12">
							<q-select
								dense
								outlined
								emit-value
								map-options
								v-model="store.filters.active"
								:options="statusFilterOptions"
								option-value="value"
								option-label="label"
								label="Estado"
								clearable
							/>
						</div>
					</div>
				</q-card-section>

				<q-separator />

				<q-card-actions class="responsive-modal-actions">
					<q-btn-group spread class="full-width">
						<q-btn
							outline
							color="grey-8"
							icon="fas fa-eraser"
							label="Limpiar"
							@click="store.clearFilters()"
						/>
						<q-btn
							type="submit"
							outline
							icon="fas fa-filter"
							color="primary"
							label="Buscar"
						/>
					</q-btn-group>
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>

	<div class="q-pa-md">
		<div class="servicios-toolbar">
			<q-btn
				outline
				size="12px"
				color="primary"
				label="Nuevo servicio"
				icon="fa-solid fa-plus"
				class="servicios-toolbar-btn"
				@click="openNewRegister()"
			/>
			<q-btn
				outline
				size="12px"
				color="primary"
				icon="fa-solid fa-magnifying-glass"
				label="Filtros avanzados"
				class="servicios-toolbar-btn"
				@click="dialog = true"
			/>
		</div>
	</div>

	<q-table
		:rows="store.registers"
		:columns="columns"
		:class="{ 'compact-table': isCompact }"
		separator="cell"
		no-data-label="No hay datos"
		dense
		rows-per-page-label="Registros por página"
		:pagination-label="
			(firstRowIndex, endRowIndex, totalRowsNumber) => {
				return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
			}
		"
		flat
		bordered
		v-model:pagination="store.pagination"
		:rows-per-page-options="[5, 10, 20, 50, 100]"
		@request="store.getRegisters"
		row-key="id"
	>
		<template v-slot:header="props">
			<q-tr :props="props">
				<q-th v-for="col in props.cols" :key="col.name" :props="props">
					<b>{{ col.label }}</b>
				</q-th>
			</q-tr>
		</template>
		<template v-slot:body="props">
			<q-tr :props="props">
				<q-td>
					<q-icon :name="props.row.icon" size="24px" />
				</q-td>
				<q-td>{{ props.row.title }}</q-td>
				<q-td v-if="!isCompact">{{ props.row.subtitle }}</q-td>
				<q-td>{{ props.row.sort_order }}</q-td>
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
				<q-td v-if="!isCompact">{{
					date.formatDate(props.row.created_at, 'DD-MM-YYYY HH:mm:ss')
				}}</q-td>
				<q-td v-if="!isCompact">{{
					date.formatDate(props.row.updated_at, 'DD-MM-YYYY HH:mm:ss')
				}}</q-td>
				<q-td>
					<!-- Desktop/tablet grande: mismos botones de siempre.
               Mobile/tablet chico: mismas acciones, agrupadas en un menú
               "⋮" para que ninguna quede oculta ni fuerce overflow. -->
					<div class="flex justify-center">
						<q-btn-group v-if="!isCompact">
							<q-btn
								color="positive"
								size="sm"
								@click="openEditRegister(props.row)"
								icon="edit"
							>
								<q-tooltip anchor="top middle" self="center middle"
									>Editar</q-tooltip
								>
							</q-btn>
							<q-btn
								:color="props.row.active ? 'warning' : 'primary'"
								size="sm"
								@click="store.confirmStatusChange(props.row)"
								:icon="props.row.active ? 'block' : 'check_circle'"
							>
								<q-tooltip anchor="top middle" self="center middle">
									{{ props.row.active ? 'Desactivar' : 'Activar' }}
								</q-tooltip>
							</q-btn>
							<q-btn
								color="negative"
								size="sm"
								@click="store.confirmRemove(props.row)"
								icon="delete"
							>
								<q-tooltip anchor="top middle" self="center middle"
									>Eliminar</q-tooltip
								>
							</q-btn>
							<q-btn
								color="info"
								size="sm"
								@click="openContentManager(props.row)"
								icon="article"
							>
								<q-tooltip anchor="top middle" self="center middle"
									>Administrar contenido</q-tooltip
								>
							</q-btn>
							<q-btn
								color="teal"
								size="sm"
								@click="openAppointmentServices(props.row)"
								icon="design_services"
							>
								<q-tooltip anchor="top middle" self="center middle"
									>Servicios agendables</q-tooltip
								>
							</q-btn>
							<q-btn
								color="deep-purple"
								size="sm"
								@click="openProducts(props.row)"
								icon="shopping_bag"
							>
								<q-tooltip anchor="top middle" self="center middle"
									>Productos</q-tooltip
								>
							</q-btn>
						</q-btn-group>

						<q-btn
							v-else
							round
							flat
							color="grey-8"
							icon="more_vert"
							size="md"
							class="actions-menu-btn"
						>
							<q-menu anchor="bottom right" self="top right">
								<q-list style="min-width: 200px">
									<q-item
										clickable
										v-close-popup
										@click="openEditRegister(props.row)"
									>
										<q-item-section avatar
											><q-icon color="positive" name="edit"
										/></q-item-section>
										<q-item-section>Editar</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="store.confirmStatusChange(props.row)"
									>
										<q-item-section avatar>
											<q-icon
												:color="props.row.active ? 'warning' : 'primary'"
												:name="props.row.active ? 'block' : 'check_circle'"
											/>
										</q-item-section>
										<q-item-section>{{
											props.row.active ? 'Desactivar' : 'Activar'
										}}</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="store.confirmRemove(props.row)"
									>
										<q-item-section avatar
											><q-icon color="negative" name="delete"
										/></q-item-section>
										<q-item-section>Eliminar</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="openContentManager(props.row)"
									>
										<q-item-section avatar
											><q-icon color="info" name="article"
										/></q-item-section>
										<q-item-section>Administrar contenido</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="openAppointmentServices(props.row)"
									>
										<q-item-section avatar>
											<q-icon color="teal" name="design_services" />
										</q-item-section>
										<q-item-section>Servicios agendables</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="openProducts(props.row)"
									>
										<q-item-section avatar>
											<q-icon color="deep-purple" name="shopping_bag" />
										</q-item-section>
										<q-item-section>Productos</q-item-section>
									</q-item>
								</q-list>
							</q-menu>
						</q-btn>
					</div>
				</q-td>
			</q-tr>
		</template>
	</q-table>

	<q-dialog
		v-model="store.showModal"
		persistent
		transition-show="scale"
		:maximized="$q.screen.xs"
	>
		<q-card class="servicio-modal-card responsive-modal-card">
			<q-card-section
				class="servicio-modal-header text-white row items-center justify-between"
			>
				<div class="row items-center">
					<q-icon name="miscellaneous_services" size="28px" class="q-mr-sm" />
					<div class="text-h6">{{ store.title }}</div>
				</div>
				<q-btn
					flat
					round
					dense
					icon="close"
					text-color="white"
					@click="store.showModal = false"
				/>
			</q-card-section>

			<q-form class="responsive-modal-form" @submit="confirmSubmit()">
				<q-card-section class="q-pa-lg responsive-modal-body">
					<div class="row q-col-gutter-lg">
						<div class="col-12 col-md-6">
							<q-field
								outlined
								readonly
								label="Icono"
								stack-label
								:model-value="store.form.icon"
								:rules="[isRequired]"
								class="icon-preview-field"
							>
								<template v-slot:control>
									<div
										class="row items-center no-wrap full-width cursor-pointer"
										@click="openIconPicker()"
									>
										<q-icon
											:name="store.form.icon || 'help_outline'"
											size="26px"
											class="q-mr-sm"
										/>
										<div class="ellipsis">{{ selectedIconLabel }}</div>
									</div>
								</template>
								<template v-slot:append>
									<q-icon
										name="expand_more"
										class="cursor-pointer"
										@click="openIconPicker()"
									/>
								</template>
							</q-field>
						</div>
						<div class="col-12 col-md-6">
							<q-select
								v-model.number="store.form.sort_order"
								:options="orderSelectOptions"
								option-value="value"
								option-label="label"
								emit-value
								map-options
								label="Orden"
								hint="Si eliges una posición ocupada, los demás servicios se recorren automáticamente"
								:rules="[isRequired]"
								outlined
								clearable
							/>
						</div>
						<div class="col-12 col-md-6">
							<q-toggle v-model="store.form.active" label="Activo" />
						</div>
						<div class="col-12">
							<q-input
								v-model="store.form.title"
								label="Título"
								:rules="[isRequired]"
								v-max="100"
								clearable
								outlined
							/>
						</div>
						<div class="col-12">
							<q-input
								v-model="store.form.subtitle"
								label="Subtítulo"
								:rules="[isRequired]"
								v-max1000
								type="textarea"
								clearable
								outlined
							/>
						</div>
					</div>
				</q-card-section>

				<q-separator />

				<q-card-actions class="responsive-modal-actions">
					<q-btn-group spread class="full-width">
						<q-btn
							icon="close"
							@click="store.showModal = false"
							text-color="white"
							style="background-color: #9f2241"
							label="Cancelar"
						/>
						<q-btn
							v-if="store.form.action === 1"
							type="submit"
							icon="save"
							text-color="white"
							style="background-color: #00a982"
							label="Guardar"
						/>
						<q-btn
							v-else
							type="submit"
							icon="edit"
							label="Actualizar"
							text-color="white"
							style="background-color: #00a982"
						/>
					</q-btn-group>
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>

	<q-dialog
		v-model="iconPickerOpen"
		transition-show="scale"
		transition-hide="scale"
		:maximized="$q.screen.xs"
	>
		<q-card class="servicio-modal-card icon-picker-card responsive-modal-card">
			<q-card-section class="servicio-modal-header text-white">
				<q-icon name="apps" size="28px" class="q-mr-sm" />
				<div class="text-h6">Seleccionar icono</div>
			</q-card-section>

			<q-card-section class="q-pb-none">
				<q-input
					v-model="iconSearch"
					outlined
					dense
					clearable
					placeholder="Buscar icono..."
				>
					<template v-slot:prepend>
						<q-icon name="search" />
					</template>
				</q-input>
			</q-card-section>

			<q-card-section v-if="!iconSearch" class="q-pt-sm q-pb-none">
				<q-tabs
					v-model="iconCategory"
					dense
					outside-arrows
					mobile-arrows
					align="left"
					active-color="white"
					indicator-color="white"
					class="icon-picker-tabs"
				>
					<q-tab
						v-for="cat in iconCategories"
						:key="cat.name"
						:name="cat.name"
						:label="cat.name"
					/>
				</q-tabs>
				<q-separator />
			</q-card-section>

			<q-card-section class="icon-picker-grid">
				<div class="row q-col-gutter-sm">
					<div
						v-for="icon in visibleIcons"
						:key="icon.value + icon.label"
						class="col-4 col-sm-3 col-md-2"
					>
						<q-card
							flat
							bordered
							class="icon-picker-item"
							:class="{ 'icon-picker-item--selected': pendingIcon === icon.value }"
							@click="pendingIcon = icon.value"
							@dblclick="selectIcon(icon.value)"
						>
							<q-icon
								v-if="pendingIcon === icon.value"
								name="check_circle"
								color="positive"
								size="18px"
								class="icon-picker-item__check"
							/>
							<q-card-section class="column items-center q-gutter-xs">
								<q-icon :name="icon.value" size="32px" />
								<div class="text-caption text-center ellipsis full-width">
									{{ icon.label }}
								</div>
							</q-card-section>
						</q-card>
					</div>
					<div
						v-if="visibleIcons.length === 0"
						class="col-12 text-center text-grey q-pa-lg"
					>
						No se encontraron iconos.
					</div>
				</div>
			</q-card-section>

			<q-separator />
			<q-card-actions align="right" class="q-pa-md">
				<q-btn flat label="Cancelar" text-color="grey-8" @click="iconPickerOpen = false" />
				<q-btn
					unelevated
					label="Seleccionar"
					text-color="white"
					style="background-color: #9f2241"
					:disable="!pendingIcon"
					@click="selectIcon(pendingIcon)"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { date, useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import { useRouter } from 'vue-router'
import HeaderSection from 'components/HeaderSection.vue'
import DeleteAlert from 'components/DeleteAlert.vue'
import { useCatServiciosStore } from 'src/stores/CatServicios'
import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png'
import type { ServiceCategoryRecord } from 'src/interfaces/serviceCategory'

const iconModule = ref(imageRoute)
const dialog = ref(false)
const store = useCatServiciosStore()
const $q = useQuasar()
const router = useRouter()

// El formulario pertenece únicamente al módulo Servicios
const SERVICE_MODULE_ID = 2

const statusFilterOptions = [
	{ label: 'Activo', value: true },
	{ label: 'Inactivo', value: false },
]

// xs/sm (mobile + tablet chico, < 1024px): tabla y acciones compactas.
// md/lg/xl (>= 1024px): presentación actual sin cambios.
const isCompact = computed(() => $q.screen.lt.md)

// Subtítulo y fechas se ocultan en compact para que la tabla no dependa de
// scroll horizontal; "Acciones" nunca se oculta (solo cambia su contenido,
// ver el body slot de la tabla).
const columns = computed<QTableColumn<ServiceCategoryRecord>[]>(() => {
	const cols: QTableColumn<ServiceCategoryRecord>[] = [
		{
			name: 'icon',
			align: 'center',
			label: isCompact.value ? '' : 'Icono',
			field: (row) => row.icon,
			headerStyle: isCompact.value ? 'width: 44px' : 'width: 70px',
		},
		{
			name: 'title',
			align: 'left',
			label: 'Título',
			field: (row) => row.title,
			headerStyle: isCompact.value ? '' : 'width: 150px',
		},
	]

	if (!isCompact.value) {
		cols.push({
			name: 'subtitle',
			align: 'left',
			label: 'Subtítulo',
			field: (row) => row.subtitle,
			headerStyle: 'width: 200px',
		})
	}

	cols.push(
		{
			name: 'sort_order',
			align: 'left',
			label: isCompact.value ? 'Ord.' : 'Orden',
			field: (row) => row.sort_order,
			sortable: true,
			headerStyle: isCompact.value ? 'width: 50px' : 'width: 80px',
		},
		{
			name: 'active',
			align: 'left',
			label: 'Estado',
			field: (row) => row.active,
			headerStyle: isCompact.value ? 'width: 78px' : 'width: 90px',
		},
	)

	if (!isCompact.value) {
		cols.push(
			{
				name: 'created_at',
				align: 'left',
				label: 'Fecha creación',
				field: (row) => row.created_at,
				headerStyle: 'width: 130px',
			},
			{
				name: 'updated_at',
				align: 'left',
				label: 'Fecha actualización',
				field: (row) => row.updated_at,
				headerStyle: 'width: 130px',
			},
		)
	}

	cols.push({
		name: 'actions',
		align: 'center',
		label: isCompact.value ? '' : 'Acciones',
		field: () => '',
		headerStyle: isCompact.value ? 'width: 52px' : 'width: 120px',
	})

	return cols
})

// --- Explorador visual de iconos, agrupado por categorías de negocio ---
const iconCategories = [
	{
		name: 'Belleza',
		icons: [
			{ label: 'Salón de belleza', value: 'face_retouching_natural' },
			{ label: 'Maquillaje', value: 'brush' },
			{ label: 'Estética', value: 'auto_awesome' },
			{ label: 'Spa', value: 'spa' },
			{ label: 'Paleta', value: 'palette' },
		],
	},
	{
		name: 'Barbería',
		icons: [
			{ label: 'Barbería', value: 'content_cut' },
			{ label: 'Afeitado', value: 'face' },
			{ label: 'Peluquería', value: 'content_cut' },
		],
	},
	{
		name: 'Cabello',
		icons: [
			{ label: 'Corte de cabello', value: 'content_cut' },
			{ label: 'Peinado', value: 'brush' },
			{ label: 'Tratamiento capilar', value: 'face_retouching_natural' },
		],
	},
	{
		name: 'Uñas',
		icons: [
			{ label: 'Manicure', value: 'back_hand' },
			{ label: 'Pedicure', value: 'front_hand' },
			{ label: 'Esmaltado', value: 'colorize' },
		],
	},
	{
		name: 'Spa',
		icons: [
			{ label: 'Spa', value: 'spa' },
			{ label: 'Jacuzzi', value: 'hot_tub' },
			{ label: 'Relajación', value: 'self_improvement' },
			{ label: 'Baño', value: 'bathtub' },
		],
	},
	{
		name: 'Masajes',
		icons: [
			{ label: 'Masajes', value: 'self_improvement' },
			{ label: 'Terapia corporal', value: 'accessibility_new' },
			{ label: 'Relajación', value: 'spa' },
		],
	},
	{
		name: 'Maquillaje',
		icons: [
			{ label: 'Maquillaje', value: 'brush' },
			{ label: 'Paleta de colores', value: 'palette' },
			{ label: 'Retoque facial', value: 'face_retouching_natural' },
		],
	},
	{
		name: 'Estética',
		icons: [
			{ label: 'Tratamiento facial', value: 'face_retouching_natural' },
			{ label: 'Estética', value: 'auto_awesome' },
			{ label: 'Destacado', value: 'star' },
		],
	},
	{
		name: 'Tatuajes',
		icons: [
			{ label: 'Tatuajes', value: 'gesture' },
			{ label: 'Diseño corporal', value: 'brush' },
			{ label: 'Arte', value: 'format_paint' },
		],
	},
	{
		name: 'Tarot',
		icons: [
			{ label: 'Tarot', value: 'auto_awesome' },
			{ label: 'Astrología', value: 'nights_stay' },
			{ label: 'Lectura espiritual', value: 'stars' },
		],
	},
	{
		name: 'Limpias',
		icons: [
			{ label: 'Limpia energética', value: 'cleaning_services' },
			{ label: 'Sanación', value: 'auto_fix_high' },
			{ label: 'Reiki', value: 'self_improvement' },
		],
	},
	{
		name: 'Energéticas',
		icons: [
			{ label: 'Energía', value: 'bolt' },
			{ label: 'Sanación energética', value: 'auto_fix_high' },
			{ label: 'Bienestar', value: 'self_improvement' },
		],
	},
	{
		name: 'Bebidas',
		icons: [
			{ label: 'Bar', value: 'local_bar' },
			{ label: 'Licores', value: 'liquor' },
			{ label: 'Cervezas', value: 'sports_bar' },
			{ label: 'Bebidas energizantes', value: 'local_cafe' },
		],
	},
	{
		name: 'Café',
		icons: [
			{ label: 'Café', value: 'local_cafe' },
			{ label: 'Cafetería', value: 'coffee_maker' },
		],
	},
	{
		name: 'Comida',
		icons: [
			{ label: 'Restaurante', value: 'restaurant' },
			{ label: 'Comida rápida', value: 'fastfood' },
			{ label: 'Almuerzo', value: 'lunch_dining' },
			{ label: 'Pizza', value: 'local_pizza' },
			{ label: 'Panadería', value: 'bakery_dining' },
		],
	},
	{
		name: 'Salud',
		icons: [
			{ label: 'Salud', value: 'health_and_safety' },
			{ label: 'Bienestar', value: 'favorite' },
			{ label: 'Curación', value: 'healing' },
			{ label: 'Psicología', value: 'self_improvement' },
		],
	},
	{
		name: 'Medicina',
		icons: [
			{ label: 'Medicina', value: 'medication' },
			{ label: 'Consultorio', value: 'local_hospital' },
			{ label: 'Servicios médicos', value: 'medical_services' },
			{ label: 'Vacunas', value: 'vaccines' },
			{ label: 'Nutrición', value: 'health_and_safety' },
			{ label: 'Dentista', value: 'medical_services' },
		],
	},
	{
		name: 'Mascotas',
		icons: [
			{ label: 'Mascotas', value: 'pets' },
			{ label: 'Veterinaria', value: 'pets' },
		],
	},
	{
		name: 'Fitness',
		icons: [
			{ label: 'Gimnasio', value: 'fitness_center' },
			{ label: 'Entrenador personal', value: 'directions_run' },
			{ label: 'Bienestar físico', value: 'self_improvement' },
		],
	},
	{
		name: 'Tecnología',
		icons: [
			{ label: 'Tecnología', value: 'computer' },
			{ label: 'Dispositivos', value: 'devices' },
			{ label: 'Componentes', value: 'memory' },
			{ label: 'Celular', value: 'smartphone' },
			{ label: 'Internet', value: 'wifi' },
		],
	},
	{
		name: 'Hogar',
		icons: [
			{ label: 'Hogar', value: 'home' },
			{ label: 'Reparaciones del hogar', value: 'home_repair_service' },
			{ label: 'Mobiliario', value: 'weekend' },
			{ label: 'Limpieza', value: 'cleaning_services' },
			{ label: 'Lavandería', value: 'local_laundry_service' },
		],
	},
	{
		name: 'Vehículos',
		icons: [
			{ label: 'Vehículos', value: 'directions_car' },
			{ label: 'Mecánico', value: 'build' },
			{ label: 'Lavado de auto', value: 'local_car_wash' },
			{ label: 'Motocicletas', value: 'two_wheeler' },
		],
	},
	{
		name: 'Educación',
		icons: [
			{ label: 'Educación', value: 'school' },
			{ label: 'Cursos', value: 'menu_book' },
			{ label: 'Enseñanza', value: 'cast_for_education' },
		],
	},
	{
		name: 'Música',
		icons: [
			{ label: 'Música', value: 'music_note' },
			{ label: 'Audio', value: 'headphones' },
			{ label: 'Piano', value: 'piano' },
			{ label: 'Micrófono', value: 'mic' },
		],
	},
	{
		name: 'Entretenimiento',
		icons: [
			{ label: 'Teatro', value: 'theaters' },
			{ label: 'Videojuegos', value: 'sports_esports' },
			{ label: 'Cine', value: 'movie' },
			{ label: 'Eventos', value: 'celebration' },
		],
	},
	{
		name: 'Compras',
		icons: [
			{ label: 'Compras', value: 'shopping_cart' },
			{ label: 'Bolsa de compras', value: 'shopping_bag' },
			{ label: 'Tienda', value: 'storefront' },
			{ label: 'Centro comercial', value: 'local_mall' },
		],
	},
	{
		name: 'Servicios Generales',
		icons: [
			{ label: 'Servicios generales', value: 'miscellaneous_services' },
			{ label: 'Mantenimiento', value: 'handyman' },
			{ label: 'Ingeniería', value: 'engineering' },
			{ label: 'Plomería', value: 'plumbing' },
			{ label: 'Electricidad', value: 'electrical_services' },
			{ label: 'Construcción', value: 'construction' },
			{ label: 'Diseño', value: 'design_services' },
			{ label: 'Marketing', value: 'campaign' },
			{ label: 'Fotografía', value: 'photo_camera' },
		],
	},
]

const allIconsFlat = computed(() => {
	const seen = new Map<string, { label: string; value: string }>()
	iconCategories.forEach((cat) => {
		cat.icons.forEach((icon) => {
			if (!seen.has(icon.value)) seen.set(icon.value, icon)
		})
	})
	return Array.from(seen.values())
})

const selectedIconLabel = computed(() => {
	if (!store.form.icon) return 'Selecciona un icono'
	const found = allIconsFlat.value.find((icon) => icon.value === store.form.icon)
	return found ? found.label : store.form.icon
})

const iconPickerOpen = ref(false)
const iconSearch = ref('')
const iconCategory = ref(iconCategories[0].name)
const pendingIcon = ref<string | null>(null)

const visibleIcons = computed(() => {
	if (iconSearch.value.trim() !== '') {
		const needle = iconSearch.value.trim().toLowerCase()
		return allIconsFlat.value.filter(
			(icon) =>
				icon.label.toLowerCase().indexOf(needle) > -1 ||
				icon.value.toLowerCase().indexOf(needle) > -1,
		)
	}
	const category = iconCategories.find((cat) => cat.name === iconCategory.value)
	return category ? category.icons : []
})

const openIconPicker = () => {
	pendingIcon.value = store.form.icon || null
	iconSearch.value = ''
	const currentCategory = iconCategories.find((cat) =>
		cat.icons.some((icon) => icon.value === store.form.icon),
	)
	iconCategory.value = currentCategory ? currentCategory.name : iconCategories[0].name
	iconPickerOpen.value = true
}

const selectIcon = (value: string | null) => {
	if (!value) return
	store.form.icon = value
	iconPickerOpen.value = false
}

// --- Orden: seleccionar una posición ocupada recorre automáticamente a los demás servicios ---
const takenOrders = computed(() => {
	const taken = new Set<number>()
	store.registers.forEach((row) => {
		if (typeof row.sort_order === 'number') taken.add(row.sort_order)
	})
	return taken
})

const orderSelectOptions = computed(() => {
	const totalCount = store.pagination.rowsNumber || store.registers.length
	const isNewRegister = store.form.action === 1
	const maxOrder = isNewRegister ? totalCount + 1 : Math.max(totalCount, 1)
	return Array.from({ length: maxOrder }, (_, index) => index + 1).map((n) => ({
		label:
			takenOrders.value.has(n) && n !== store.editingOriginalOrder
				? `${n} (ocupado)`
				: `${n}`,
		value: n,
	}))
})

const openNewRegister = () => {
	store.newRegister()
	store.form.module_id = SERVICE_MODULE_ID
}

const openEditRegister = (row: ServiceCategoryRecord) => {
	store.editRegister(row)
	store.form.module_id = SERVICE_MODULE_ID
}

const openContentManager = (row: ServiceCategoryRecord) => {
	store.selectService(row)
	router.push({ name: 'ServiciosContenido', params: { hash_id: String(row.hash_id ?? row.id) } })
}

// Servicios agendables (AppointmentService) del Servicio seleccionado —
// mismo patrón que openContentManager (store.selectService + hash_id en la
// URL, ver ServiciosAgendables.vue).
const openAppointmentServices = (row: ServiceCategoryRecord) => {
	store.selectService(row)
	router.push({
		name: 'ServiciosAgendablesDeServicio',
		params: { hash_id: String(row.hash_id ?? row.id) },
	})
}

// Productos del Servicio — mismo patrón que openContentManager/
// openAppointmentServices (store.selectService + hash_id en la URL, ver
// ProductosDeServicio.vue).
const openProducts = (row: ServiceCategoryRecord) => {
	store.selectService(row)
	router.push({ name: 'ProductosDeServicio', params: { hash_id: String(row.hash_id ?? row.id) } })
}

const confirmSubmit = () => {
	$q.dialog({
		component: DeleteAlert,
		componentProps: {
			icon: 'save',
			title: store.form.action === 1 ? 'Guardar Servicio' : 'Actualizar Servicio',
			subtitle: 'Confirma tu acción',
			question: '¿Deseas guardar los cambios del servicio?',
			button: 'Guardar',
		},
	}).onOk(() => {
		store.submitWithReorder()
	})
}

// El modal de filtros solo se cierra si la búsqueda realmente tuvo éxito;
// si falla, store.search() ya notificó el error y el usuario puede corregir
// los filtros sin perder lo que capturó.
const attemptSearch = async () => {
	const ok = await store.search()
	if (ok) dialog.value = false
}

onMounted(() => {
	store.getRegisters()
})
</script>

<style scoped>
thead tr:first-child th {
	background-color: #6f7271;
	color: white;
}

.servicio-modal-card {
	border-radius: 8px;
	overflow: hidden;
	width: 700px;
	max-width: 90vw;
}

.servicio-modal-header {
	background: linear-gradient(to bottom, #611232, #9b2247);
	display: flex;
	align-items: center;
	padding: 16px 20px;
}

.icon-preview-field :deep(.q-field__control) {
	cursor: pointer;
}

.icon-picker-card {
	width: 720px;
	max-width: 95vw;
}

.icon-picker-tabs {
	background: #9f2241;
	border-radius: 6px;
}

.icon-picker-grid {
	max-height: 45vh;
	overflow-y: auto;
}

.icon-picker-item {
	position: relative;
	cursor: pointer;
	border-radius: 8px;
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease,
		border-color 0.15s ease;
}

.icon-picker-item:hover {
	border-color: #9f2241;
	transform: translateY(-2px);
	box-shadow: 0 4px 10px rgba(159, 34, 65, 0.25);
}

.icon-picker-item--selected {
	border-color: #9f2241;
	border-width: 2px;
	background: rgba(159, 34, 65, 0.08);
}

.icon-picker-item__check {
	position: absolute;
	top: 4px;
	right: 4px;
	background: white;
	border-radius: 50%;
}

.cell {
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	word-break: break-all;
	line-height: 23px;
	padding-right: 10px;
}

.title {
	font-weight: bold;
	background: #10312b;
	color: white;
	padding: 5px;
	font-size: 20px;
}

/* ===== Responsive ===== */

.servicios-toolbar {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	justify-content: flex-end;
}

.servicios-toolbar-btn {
	min-height: 40px;
}

.actions-menu-btn {
	min-width: 40px;
	min-height: 40px;
}

/* En compacto, table-layout:auto ignora los headerStyle angostos y deja que
   el contenido (chips, botones) estire las columnas hasta forzar overflow.
   Con fixed, el ancho de <th> manda de verdad y el texto sobrante se
   trunca con ellipsis en vez de empujar "Acciones" fuera de la vista. */
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

.responsive-modal-card {
	display: flex;
	flex-direction: column;
	max-height: 90vh;
}

.responsive-modal-form {
	display: flex;
	flex-direction: column;
	min-height: 0;
	flex: 1 1 auto;
}

.responsive-modal-body {
	overflow-y: auto;
	flex: 1 1 auto;
	min-height: 0;
}

.responsive-modal-actions {
	flex-shrink: 0;
	padding: 12px 16px;
}

@media (max-width: 599px) {
	.servicios-toolbar {
		flex-direction: column;
	}

	.servicios-toolbar-btn {
		width: 100%;
	}

	/* :maximized fuerza width/height:100% en la tarjeta; sin este reset el
     max-width/max-height pensado para desktop (90vh, 90vw, 95vw) le sigue
     ganando y deja márgenes en blanco alrededor del modal maximizado. */
	.responsive-modal-card {
		max-width: 100vw;
		max-height: 100vh;
	}
}
</style>

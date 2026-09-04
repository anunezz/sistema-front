<template>
	<header-section
		title="Administración de Usuarios"
		subtitle="Búsqueda, alta, edición y permisos de usuarios"
		:icon-image="iconModule"
	/>
	<br />
	<div class="q-pa-md">
		<div class="row items-center users-toolbar">
			<div class="col-12 col-sm-9 users-toolbar-search">
				<q-input
					dense
					outlined
					clearable
					size="12px"
					clear-icon="fas fa-eraser"
					class="full-width"
					placeholder="Ingrese un dato para iniciar una búsqueda:"
					v-model="search"
					v-max="100"
					@keyup.enter="getRegisters({ pagination: pagination })"
					@clear="getRegisters({ pagination: pagination })"
				>
					<template v-slot:append>
						<i
							class="fa-solid fa-magnifying-glass cursor-pointer"
							@click="getRegisters({ pagination: pagination })"
						/>
					</template>
				</q-input>
			</div>
			<div class="col-12 col-sm-3 users-toolbar-btn-wrap">
				<q-btn
					color="primary"
					outline
					size="12px"
					label="Nuevo Usuario"
					icon="fas fa-plus-circle"
					class="full-width users-toolbar-btn new-user-btn"
					@click="openNewUserDialog"
				/>
			</div>
		</div>
		<br />
		<q-table
			:rows="registers"
			:columns="columns"
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
			:class="{ 'compact-table': isCompact }"
			v-model:pagination="pagination"
			:rows-per-page-options="[5, 10, 20, 50, 100]"
			@request="getRegisters"
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
				<q-tr :props="props" :class="[props.pageIndex % 2 != 0 ? 'bg-grey-3' : '', '']">
					<q-td>
						{{ props.row.id }}
					</q-td>
					<q-td>
						{{ props.row.username }}
					</q-td>
					<q-td>
						{{ props.row.full_name }}
					</q-td>

					<q-td v-if="!isCompact">
						{{
							props.row.usuario_perfil ? props.row.usuario_perfil.perfil.perfil : null
						}}
					</q-td>
					<q-td v-if="!isCompact" style="text-align: center">
						{{ props.row.is_barbero ? 'Sí' : 'No' }}
					</q-td>
					<q-td align="center">
						<!-- Desktop/tablet grande: 3 botones inline, como siempre.
						     Compacto (< 1024px): mismas 3 acciones agrupadas en un menú
						     "⋮" (mismo patrón que views/administration/servicios/Index.vue)
						     — ninguna acción se elimina, table-layout:fixed (ver
						     .compact-table) evita que esta columna quede fuera de la
						     vista o que los botones se encimen. -->
						<q-btn-group v-if="!isCompact">
							<q-btn color="positive" size="sm" @click="editUser(props.row.hash_id)">
								<i class="far fa-edit" style="font-size: 15px" />
								<q-tooltip anchor="top middle" self="center middle">
									Editar
								</q-tooltip>
							</q-btn>
							<q-btn
								style="background: #1976d2; color: white"
								size="sm"
								@click="showUser(props.row.hash_id)"
							>
								<q-icon name="fas fa-eye" style="font-size: 15px"></q-icon>
								<q-tooltip anchor="top middle" self="center middle">
									Ver
								</q-tooltip>
							</q-btn>
							<q-btn
								:color="props.row.bol_eliminado ? 'positive' : 'red'"
								size="sm"
								@click="
									disableOrEnableUserDialog(
										props.row.hash_id,
										props.row.bol_eliminado,
										props.row.username,
									)
								"
							>
								<q-icon
									:name="
										props.row.bol_eliminado
											? 'fa-solid fa-user-check'
											: 'fa-solid fa-user-slash'
									"
									style="font-size: 15px"
								/>
								<q-tooltip anchor="top middle" self="center middle">
									{{ props.row.bol_eliminado ? 'Activar' : 'Desactivar' }}
								</q-tooltip>
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
								<q-list style="min-width: 180px">
									<q-item
										clickable
										v-close-popup
										@click="editUser(props.row.hash_id)"
									>
										<q-item-section avatar>
											<q-icon color="positive" name="far fa-edit" />
										</q-item-section>
										<q-item-section>Editar</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="showUser(props.row.hash_id)"
									>
										<q-item-section avatar>
											<q-icon color="primary" name="fas fa-eye" />
										</q-item-section>
										<q-item-section>Ver</q-item-section>
									</q-item>
									<q-item
										clickable
										v-close-popup
										@click="
											disableOrEnableUserDialog(
												props.row.hash_id,
												props.row.bol_eliminado,
												props.row.username,
											)
										"
									>
										<q-item-section avatar>
											<q-icon
												:color="
													props.row.bol_eliminado
														? 'positive'
														: 'negative'
												"
												:name="
													props.row.bol_eliminado
														? 'fa-solid fa-user-check'
														: 'fa-solid fa-user-slash'
												"
											/>
										</q-item-section>
										<q-item-section>{{
											props.row.bol_eliminado ? 'Activar' : 'Desactivar'
										}}</q-item-section>
									</q-item>
								</q-list>
							</q-menu>
						</q-btn>
					</q-td>
				</q-tr>
			</template>
		</q-table>
		<q-dialog
			v-model="showDialogToCreateEditUser"
			persistent
			transition-show="scale"
			:maximized="$q.screen.xs"
		>
			<q-card class="user-modal-card" style="min-height: 400px">
				<q-form @submit="onSubmit" @reset="onReset">
					<q-card-section style="background-color: #c39326" class="text-white">
						<div class="text-h6">
							<i
								:class="
									onlyRead == true
										? 'fa-solid fa-user'
										: formUser.id != undefined
											? 'fa-solid fa-user-pen'
											: 'fas fa-user-plus'
								"
							></i>
							{{
								onlyRead == true
									? 'Ver Usuario'
									: formUser.id != undefined
										? 'Editar Usuario'
										: 'Nuevo Usuario'
							}}
						</div>
					</q-card-section>

					<q-card-section>
						<div class="q-pa-md">
							<div class="row">
								<div class="col-12 col-sm-6 q-pa-md">
									<q-input
										dense
										:readonly="onlyRead"
										outlined
										v-model="formUser.name"
										label="Nombre (s) *"
										counter
										maxlength="30"
										v-max="30"
										:rules="nombreUsuarioRules"
									/>
								</div>
								<div class="col-12 col-sm-6 q-pa-md">
									<q-input
										dense
										:readonly="onlyRead"
										outlined
										v-model="formUser.first_name"
										label="Apellido paterno *"
										counter
										maxlength="30"
										v-max="30"
										:rules="primerApellidoUsuarioRules"
									/>
								</div>
								<div class="col-12 col-sm-6 q-pa-md">
									<q-input
										dense
										:readonly="onlyRead"
										outlined
										v-model="formUser.second_name"
										label="Apellido materno"
										counter
										maxlength="30"
										v-max="30"
										:rules="segundoApellidoUsuarioRules"
									/>
								</div>
								<div class="col-12 col-sm-6 q-pa-md">
									<q-input
										dense
										:readonly="onlyRead"
										outlined
										v-model="formUser.email"
										label="Correo Electrónico *"
										counter
										maxlength="70"
										:rules="correoElectronicoUsuarioRules"
									/>
								</div>
								<div class="col-12 col-sm-6 q-pa-md">
									<q-select
										clearable
										dense
										:readonly="onlyRead"
										outlined
										v-model="formUser.id_perfil"
										:options="catalogs.cat_perfil"
										emit-value
										map-options
										label="Tipo de perfil *"
										:rules="perfilUsuarioRules"
										@update:model-value="updatePermisions"
										option-value="id_perfil"
										option-label="perfil"
										@clear="clearProfile"
									/>
								</div>
								<div class="col-12 col-sm-6 q-pa-md flex items-center">
									<q-checkbox
										:disable="onlyRead"
										v-model="formUser.is_barbero"
										label="Es barbero"
									/>
								</div>
							</div>
							<div class="row">
								<div class="col-12 col-sm-3 q-pa-md">
									<p class="text-weight-bold">Permisos:</p>
								</div>
								<div class="col-12 col-sm-8 q-pa-md">
									<q-tree
										dense
										:nodes="permissionTree"
										node-key="id"
										label-key="display_name"
										tick-strategy="strict"
										v-model:ticked="formUser.permissions"
										default-expand-all
									>
										<template v-slot:default-header="prop">
											<div class="row items-center">
												<div class="text-caption">
													{{ prop.node.display_name }}
												</div>
											</div>
										</template>
									</q-tree>
								</div>
							</div>
						</div>
					</q-card-section>

					<q-card-actions>
						<div class="q-pa-md" style="width: 100%">
							<div class="row">
								<div v-if="onlyRead" class="col-12 q-pa-md">
									<q-btn
										size="md"
										label="Cerrar"
										class="full-width"
										@click="closeDialogToShowUser"
									/>
								</div>
								<div v-if="!onlyRead" class="col-6 q-pa-md">
									<q-btn
										size="md"
										label="Cancelar"
										class="full-width"
										@click="closeDialogToCreateEditUser"
									/>
								</div>
								<div v-if="!onlyRead" class="col-6 q-pa-md">
									<q-btn
										size="md"
										type="submit"
										label="Guardar"
										class="full-width"
										icon="fas fa-save"
										style="background: #00a982; color: white"
									/>
								</div>
							</div>
						</div>
					</q-card-actions>
				</q-form>
			</q-card>
		</q-dialog>

		<q-dialog v-model="showDialogToDisableEnableUser">
			<q-card style="min-width: 800px; min-height: 400px">
				<q-card-section style="background-color: #c39326" class="text-white">
				</q-card-section>
				<q-card-section style="background: #9f2241" class="text-white">
					<div class="text-h6"><i class="fas fa-user-times"></i>¿Desea continuar?</div>
				</q-card-section>

				<q-card-section class="text-center">
					<div class="q-pa-md">
						<q-avatar
							size="150px"
							font-size="90px"
							style="color: #db5761"
							icon="fa-solid fa-user-xmark"
						/>
						<h6>¿Estás seguro que quieres desactivar el usuario?</h6>
					</div>
				</q-card-section>

				<q-card-actions>
					<div class="q-pa-md" style="width: 100%">
						<div class="row">
							<div class="col-6">
								<q-btn
									size="md"
									label="Cancelar"
									class="full-width"
									@click="showDialogToDisableEnableUser"
									style="background: #9f2241; color: white"
									v-close-popup
								/>
							</div>
							<div class="col-6">
								<q-btn
									size="md"
									label="Confirmar"
									class="full-width"
									icon="fas fa-save"
									@click="disableOrEnableUSer"
									style="background: #00a982; color: white"
								/>
							</div>
						</div>
					</div>
				</q-card-actions>
			</q-card>
		</q-dialog>
		<!-- <FormDialog :is-visible-form="showDialogToCreateEditUser"></FormDialog> -->
	</div>
</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

import useNotify from 'src/composables/useNotify'
//import DeleteAlert from "components/DeleteAlert.vue";
import DisableUserDialog from 'components/DisableUserDialog.vue'
import UserServices from 'src/services/administration/UserServices'
import CatalogServices from 'src/services/administration/CatalogServices'

import imageRoute from 'src/assets/icons/Home/admin_usuarios.png'
import { useAuthUserStore } from 'src/stores/AuthUser'
const iconModule = ref(imageRoute)

const $q = useQuasar()
const { showError, showSuccess } = useNotify()
const store = useAuthUserStore()

const search = ref('')

const showDialogToCreateEditUser = ref(false)
const showDialogToDisableEnableUser = ref(false)
const registers = ref([])
const pagination = ref({
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0,
})
// Mismo criterio que views/administration/servicios/Index.vue (referencia
// responsive del proyecto) y agenda/BloqueosTab.vue: < 1024px = tabla
// compacta. Se ocultan solo "Perfil" y "Barbero" (secundarias); ID, Usuario,
// Nombre y Acciones siempre visibles — ninguna acción se elimina, ver el
// body slot (q-btn-group en desktop, menú "⋮" en compacto).
const isCompact = computed(() => $q.screen.lt.md)

const columns = computed(() => {
	const cols = [
		{ name: 'id_usuario', align: 'left', label: 'ID' },
		{ name: 'username', align: 'left', label: 'usuario', field: (row) => row.usuario },
		{ name: 'full_name', align: 'left', label: 'Nombre de usuario' },
	]

	if (!isCompact.value) {
		cols.push(
			{ name: 'profile', align: 'left', label: 'Perfil', field: (row) => row.correo },
			{ name: 'is_barbero', align: 'center', label: 'Barbero' },
		)
	}

	cols.push({
		name: 'actions',
		align: 'center',
		label: 'Acciones',
		headerStyle: isCompact.value ? 'width: 60px' : 'width: 300px',
	})

	return cols
})

const catalogs = ref({
	catPerfil: [],
})

const permissionTree = ref([])
const permissionOriginal = ref([])

const buildTree = (permissions, parentId = null) => {
	return permissions
		.filter((permission) => permission.parent_id === parentId)
		.filter(
			// Spec §19: 'catalog_management' (Administración de Catálogos) ya
			// no se puede asignar — se oculta del árbol, salvo que el usuario
			// en edición ya lo tenga (no se le revoca un permiso de un módulo
			// que sigue activo, mismo criterio que
			// Permission::filterAssignable() en backend).
			(permission) =>
				!permission.unassignable || (formUser.value.permissions || []).includes(permission.id),
		)
		.map((permission) => ({
			id: permission.id,
			display_name: permission.display_name,
			children: buildTree(permissions, permission.id),

			// ✅ Si el perfil es 1 → checkboxes habilitados
			//    Si no → deshabilitados (solo lectura)
			// unassignable: aunque ya se le muestre a quien ya lo tenía, no se
			// puede (des)marcar desde aquí (spec §19).
			tickable: formUser.value.id_perfil === 4 && !permission.unassignable,
			disabled: formUser.value.id_perfil !== 4 || permission.unassignable,
		}))
}

const getCatalog = () => {
	const data = {
		params: {
			catPerfil: true,
			permission: true,
		},
	}
	CatalogServices.index(data)
		.then((response) => {
			const { data } = response.data

			catalogs.value = data
			permissionTree.value = buildTree(data.permission)
			permissionOriginal.value = data.permission
		})
		.catch((e) => console.log(e))
		.finally(() => {})
}

getCatalog()

const getRegisters = (props) => {
	if (props !== undefined) {
		pagination.value = props.pagination
	}
	const data = {
		params: {
			page: pagination.value.page,
			rowsPerPage: pagination.value.rowsPerPage,
			search: search.value ? search.value : '',
		},
	}

	$q.loading.show()
	UserServices.index(data)
		.then((response) => {
			$q.loading.hide()
			registers.value = response.data.data
			pagination.value = {
				page: response.data.current_page,
				rowsPerPage: response.data.per_page,
				rowsNumber: response.data.total,
			}
		})
		.catch((e) => {
			console.log('error', e)
			$q.loading.hide()

			showError('Error', 'No se puede completar la acción')
		})
}
const modelUser = ref({
	name: null,
	first_name: null,
	second_name: null,
	email: null,
	usuario_directorio_activo: true,
	id_perfil: null,
	is_barbero: false,
	permissions: [],
})

const formUser = modelUser
watch(
	() => formUser.value.id_perfil,
	() => {
		permissionTree.value = buildTree(permissionOriginal.value)
	},
	{ immediate: true },
)

watch(
	() => formUser.value.permissions,
	() => {
		permissionTree.value = buildTree(permissionOriginal.value)
	},
	{ immediate: true, deep: true },
)

// const updateUsuarioDirectorioActivo = () =>{

//     searchLdapUser.value        = null;
//     formUser.value.name         = null;
//     formUser.value.first_name   = null;
//     formUser.value.second_name  = null;
//     formUser.value.email        = null;

// }

const searchLdapUser = ref('')

const nombreUsuarioRules = [
	(val) => !!val || 'El nombre de usuario es requerido.', // Campo requerido
	(val) => (val && val.length <= 30) || 'Máximo 30 caracteres.', // Límite de longitud
	(val) =>
		/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val) ||
		'Solo caracteres alfanuméricos (letras y números).', // Alfanumérico
]

const primerApellidoUsuarioRules = [
	(val) => !!val || 'El Primer Apellido es requerido.', // Campo requerido
	(val) => (val && val.length <= 30) || 'Máximo 30 caracteres.', // Límite de longitud
	(val) =>
		/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val) ||
		'Solo caracteres alfanuméricos (letras y números).', // Alfanumérico
]

const segundoApellidoUsuarioRules = [
	(val) => val === null || val === '' || val.length <= 30 || 'Máximo 30 caracteres',
	(val) =>
		val === null ||
		val === '' ||
		/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val) ||
		'Solo caracteres alfanuméricos',
]

const correoElectronicoUsuarioRules = [
	(val) => (val && val.length > 0) || 'El correo electrónico es obligatorio',
	(val) => /.+@.+\..+/.test(val) || 'Formato de correo electrónico inválido',
]

const perfilUsuarioRules = [
	(val) =>
		(val !== null && val !== undefined && val !== '') ||
		'La selección de perfil es obligatoria',
]

const clearPermissionsAndTree = () => {
	permissionTree.value = buildTree(permissionOriginal.value)
}

const clearProfile = () => {
	defaultPermissions.value = []
	clearPermissionsAndTree()
}

const defaultPermissions = ref([])

const updatePermisions = () => {
	if (typeof formUser.value.id_perfil !== 'number') return

	const profileSelected = catalogs.value.cat_perfil.find(
		(profile) => profile.id_perfil == formUser.value.id_perfil,
	)

	defaultPermissions.value = profileSelected.permissions
	clearPermissionsAndTree()
}

watch(
	() => defaultPermissions.value,
	(newVal) => {
		formUser.value.permissions = newVal.map((perm) => perm.id)
	},
	{ immediate: true },
)

const onSubmit = () => {
	typeof formUser.value.id === 'number' ? requestUserUpdate() : requestUserStore()
}

const showValidationError = (error) => {
	const validationErrors = error.response.data.errors

	let errorMessage = 'Por favor, corrige los siguientes errores:<br>'
	for (const field in validationErrors) {
		validationErrors[field].forEach((message) => {
			errorMessage += `- ${message}<br>`
		})
	}
	$q.notify({
		type: 'negative',
		message: errorMessage,
		html: true,
		position: 'top',
		timeout: 5000,
	})
}

const requestUserStore = () => {
	$q.loading.show()
	try {
		UserServices.store({
			name: formUser.value.name,
			first_name: formUser.value.first_name,
			second_name: formUser.value.second_name,
			email: formUser.value.email,
			id_perfil: formUser.value.id_perfil,
			usuario_directorio_activo: formUser.value.usuario_directorio_activo,
			is_barbero: formUser.value.is_barbero,
			permissions: formUser.value.permissions,
		})
			.then((response) => {
				const { data } = response
				if (data.status == 'saved') {
					showSuccess('Correcto', 'Se agregó correctamente al usuario')
					getRegisters()
					showDialogToCreateEditUser.value = false
					clearForm()
				}
			})
			.catch((error) => {
				console.error('Error:', error.response?.data || error.message)
				if (error.response?.status === 403) {
					showError('Acceso denegado', error.response.data.message || 'No autorizado')
				} else if (error.response && error.response.status === 422) {
					showError(
						'Usuario duplicado',
						error.response.data.message || 'El usuario ya está registrado',
					)
				} else {
					showError(
						'Error interno del servidor',
						'Ocurrió un error inesperado en el servidor, intenta más tarde',
					)
				}
			})
			.finally(() => $q.loading.hide())
	} catch (error) {
		console.error('Error:', error.response?.data || error.message)
	}
}

const requestUserUpdate = async () => {
	$q.loading.show()

	try {
		const response = await UserServices.update(formUser.value.hash_id, formUser.value)
		const { data } = response

		if (data.status === 'updated') {
			showSuccess('Correcto', 'Se actualizó correctamente al usuario')
			await getRegisters()
			formUser.value = modelUser
			showDialogToCreateEditUser.value = false

			await store.sessionInfo()
			console.log('🔁 Usuario actualizado:', store.user.permissions)
		}
	} catch (error) {
		console.error('Error submitting form:', error.response?.data || error.message)

		if (error.response?.status === 403) {
			showError('Acceso denegado', error.response.data.message || 'No autorizado')
		} else if (error.response && error.response.status === 422) {
			showValidationError(error)
		} else {
			showError(
				'Error interno del servidor',
				'Ocurrió un error inesperado en el servidor, intenta más tarde',
			)
		}
	} finally {
		$q.loading.hide()
	}
}

function onReset() {
	clearForm()
}

const clearForm = () => {
	Object.assign(formUser.value, modelUser)

	formUser.value.id = undefined
	formUser.value.name = null
	formUser.value.first_name = null
	formUser.value.second_name = null
	formUser.value.username = null
	formUser.value.email = null
	formUser.value.usuario_directorio_activo = true
	formUser.value.id_perfil = null
	formUser.value.is_barbero = false
	formUser.value.permissions = []
	searchLdapUser.value = ''

	clearPermissionsAndTree()
}

const closeDialogToCreateEditUser = () => {
	clearForm()
	showDialogToCreateEditUser.value = false
}

// Función nombrada (no handler inline multi-sentencia): Prettier reformatea
// @click="a; b" quitando el ';' y rompe el build del compilador de Vue
// (ya documentado en index_page_the_planet.vue) — se evita el patrón aquí
// también en vez de arriesgarse a que un futuro `npm run format` lo rompa.
const openNewUserDialog = () => {
	clearForm()
	showDialogToCreateEditUser.value = true
}

const closeDialogToShowUser = () => {
	onlyRead.value = false
	clearForm()
	showDialogToCreateEditUser.value = false
}

const editUser = (id) => {
	$q.loading.show()
	UserServices.edit(id)
		.then((response) => {
			const { data } = response.data

			formUser.value = data
			formUser.value.id_perfil = data.usuario_perfil.id_perfil

			showDialogToCreateEditUser.value = true

			permissionTree.value = buildTree(permissionOriginal.value)
		})
		.catch((error) => {
			if (error.response) {
				showError('Error', error.response.data.message || 'No autorizado')
			} else {
				showError('Error', 'Error de conexión con el servidor')
			}
		})
		.finally(() => $q.loading.hide())
}

const onlyRead = ref(false)

const showUser = (id) => {
	$q.loading.show()
	UserServices.show(id)
		.then((response) => {
			const { data } = response.data

			formUser.value = data
			formUser.value.id_perfil = data?.usuario_perfil?.id_perfil

			showDialogToCreateEditUser.value = true

			onlyRead.value = true

			permissionTree.value = buildTree(permissionOriginal.value)
		})
		.catch((error) => {
			console.log(error)
			if (error.response?.status === 403) {
				showError('Acceso denegado', error.response.data.message || 'No autorizado')
			}
		})
		.finally(() => $q.loading.hide())
}

const disableOrEnableUserDialog = (id, status, username) => {
	$q.dialog({
		component: DisableUserDialog,
		componentProps: {
			icon: status === false ? 'fa-solid fa-user-xmark' : 'fa-solid fa-user-check',
			title: status === false ? 'Baja de Usuario' : 'Activar Usuario',
			subtitle: '¿Desea continuar?',
			question:
				status === false
					? '¿Estás seguro que quieres desactivar el usuario?'
					: '¿Estás seguro que quieres activar el usuario?',
			button: 'Aceptar',
		},
	})
		.onOk(() => {
			changeStatus(id, username)
		})
		.onCancel(() => {
			showError('', 'Operación cancelada')
		})
}

const changeStatus = (id, username) => {
	$q.loading.show()
	UserServices.changeStatus(id)
		.then((response) => {
			const { data } = response
			showSuccess(
				'Éxito',
				data.status === 'disabled'
					? 'El usuario Se desactivó correctamente'
					: `El usuario ${username} se activó correctamente`,
			)
			getRegisters()
		})
		.catch((error) => {
			console.log(error)
			if (error.response) {
				showError('Error', error.response.data.message || 'No autorizado')
			} else {
				showError('Error', 'Error de conexión con el servidor')
			}
		})
		.finally(() => $q.loading.hide())
}

getRegisters()

onMounted(() => {
	//Transicion bitacora (moduleId, typeTransactionId)
})
</script>

<style scoped>
thead tr:first-child th {
	background-color: #6f7271;
	color: white;
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

/* ===== Responsive (mismo patrón que views/administration/servicios/Index.vue) ===== */

.users-toolbar {
	flex-wrap: wrap;
	gap: 8px;
}

.new-user-btn {
	background: #877350;
}

.actions-menu-btn {
	min-width: 40px;
	min-height: 40px;
}

/* En compacto, table-layout:auto deja que "Nombre de usuario" (texto libre)
   estire las columnas hasta forzar overflow y empujar "Acciones" fuera de
   la vista. Con fixed, el ancho manda de verdad y el texto sobrante se
   trunca con ellipsis en vez de eso (mismo fix ya aplicado en Servicios y
   en Agenda/BloqueosTab.vue). */
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

.user-modal-card {
	min-width: 800px;
	max-width: 95vw;
	display: flex;
	flex-direction: column;
	max-height: 90vh;
}

@media (max-width: 599px) {
	.users-toolbar-btn-wrap {
		order: -1;
	}

	/* :maximized fuerza width/height:100% en la tarjeta; sin este reset,
	   min-width:800px pensado para escritorio la seguiría forzando a
	   desbordar el viewport horizontalmente (bug real reportado: "elementos
	   se salen de la pantalla"). */
	.user-modal-card {
		min-width: auto;
		max-width: 100vw;
		max-height: 100vh;
	}
}
</style>

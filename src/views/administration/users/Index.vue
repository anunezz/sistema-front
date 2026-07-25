<template>
    <header-section title="Administración de Usuarios" subtitle="Búsqueda, alta, edición y permisos de usuarios" :icon-image="iconModule" />
    <br>
    <div class="q-pa-md">
        <div class="row">
            <div class="col-9">
                <q-input dense outlined clearable size="12px" clear-icon="fas fa-eraser"
                    :style="'width:' + ($q.screen.width <= 468 ? '100%' : '45%')"
                    placeholder="Ingrese un dato para iniciar una búsqueda:" v-model="search" v-max="100"
                    @keyup.enter="getRegisters({ pagination: pagination })"
                    @clear="getRegisters({ pagination: pagination })">
                    <template v-slot:append>
                        <i class="fa-solid fa-magnifying-glass cursor-pointer"
                            @click="getRegisters({ pagination: pagination })" />
                    </template>
                </q-input>
            </div>
            <div class="col-3">
                <q-btn color="primary" outline size="12px" label="Nuevo Usuario" icon="fas fa-plus-circle"
                    @click="clearForm(); showDialogToCreateEditUser = true"
                    :style="'background: #877350;float:right;width:' + ($q.screen.width <= 468 ? '100%' : '')" />
            </div>
        </div>
        <br>
        <q-table :rows="registers" :columns="columns" separator="cell" no-data-label="No hay datos" dense
            rows-per-page-label="Registros por página" :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
                return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
            }" flat bordered v-model:pagination="pagination" :rows-per-page-options="[5, 10, 20, 50, 100]"
            @request="getRegisters" row-key="id">
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

                    <q-td>
                        {{ props.row.usuario_perfil ? props.row.usuario_perfil.perfil.perfil : null }}
                    </q-td>
                    <q-td style="width: 10%;text-align: center">
                        <q-btn style="margin-right: 5px" color="positive" size="sm"
                            @click="editUser(props.row.hash_id)">
                            <i class="far fa-edit" style="font-size: 15px;" />
                            <q-tooltip anchor="top middle" self="center middle">
                                Editar
                            </q-tooltip>
                        </q-btn>
                        <q-btn style="margin-right: 5px;background:#1976D2;color:white" size="sm"
                            @click="showUser(props.row.hash_id)">
                            <q-icon name="fas fa-eye" style="font-size: 15px;"></q-icon>
                            <q-tooltip anchor="top middle" self="center middle">
                                Ver
                            </q-tooltip>
                        </q-btn>
                        <q-btn
                        :color="props.row.bol_eliminado ? 'positive' : 'red'"
                        size="sm"
                        @click="disableOrEnableUserDialog(
                            props.row.hash_id,
                            props.row.bol_eliminado,
                            props.row.username
                        )"
                        >
                        <q-icon
                            :name="props.row.bol_eliminado ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'"
                            style="font-size: 15px"
                        />
                        <q-tooltip anchor="top middle" self="center middle">
                            {{ props.row.bol_eliminado ? 'Activar' : 'Desactivar' }}
                        </q-tooltip>
                        </q-btn>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
        <q-dialog v-model="showDialogToCreateEditUser" persistent>
            <q-card style="min-width: 800px;min-height: 400px;">
                <q-form @submit="onSubmit" @reset="onReset">
                    <q-card-section style="background-color: #C39326;" class="text-white">
                        <div class="text-h6"><i :class="onlyRead == true ? 'fa-solid fa-user' : formUser.id != undefined ? 'fa-solid fa-user-pen' : 'fas fa-user-plus'"></i> {{onlyRead == true ? 'Ver Usuario' : formUser.id != undefined ? 'Editar Usuario' : 'Nuevo Usuario'}}</div>
                    </q-card-section>

                    <q-card-section>
                        <div class="q-pa-md">
                            <div class="row">
                                <div class="col-6 q-pa-md">
                                    <q-input dense :readonly="onlyRead"
                                        outlined v-model="formUser.name" label="Nombre (s) *" counter maxlength="30" v-max="30"
                                        :rules="nombreUsuarioRules" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input dense :readonly="onlyRead"
                                        outlined v-model="formUser.first_name" label="Apellido paterno *" counter
                                        maxlength="30" v-max="30" :rules="primerApellidoUsuarioRules" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input dense :readonly="onlyRead"
                                        outlined v-model="formUser.second_name" label="Apellido materno" counter
                                        maxlength="30" v-max="30" :rules="segundoApellidoUsuarioRules" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input dense :readonly="onlyRead"
                                        outlined v-model="formUser.email" label="Correo Electrónico *" counter
                                        maxlength="70" :rules="correoElectronicoUsuarioRules" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-select dense clearable :readonly="onlyRead" v-model="formUser.id_oficina"
                                        :options="catalogs.cat_oficina" use-input emit-value v-max="70" map-options
                                        label="Oficina *"   @filter="filterOffices" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-select clearable dense :readonly="onlyRead" outlined v-model="formUser.id_perfil"
                                        :options="catalogs.cat_perfil" emit-value map-options label="Tipo de perfil *"
                                        :rules="perfilUsuarioRules" @update:model-value="updatePermisions"
                                        option-value="id_perfil" option-label="perfil" @clear="clearProfile" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input dense :readonly="onlyRead"
                                        outlined v-model="formUser.puesto" label="Puesto *" counter
                                        v-max="30"/>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 q-pa-md">
                                    <p class="text-weight-bold">Permisos:</p>
                                </div>
                                <div class="col-8 q-pa-md">
                                    <q-tree dense :nodes="permissionTree" node-key="id" label-key="display_name"
                                        tick-strategy="strict" v-model:ticked="formUser.permissions" default-expand-all>
                                        <template v-slot:default-header="prop">
                                            <div class="row items-center">
                                                <div class="text-caption">{{ prop.node.display_name }}</div>
                                            </div>
                                        </template>
                                    </q-tree>
                                </div>

                            </div>
                        </div>
                    </q-card-section>

                    <q-card-actions>
                        <div class="q-pa-md" style="width: 100%;">
                            <div class="row">
                                <div v-if="onlyRead" class="col-12 q-pa-md">
                                    <q-btn size="md" label="Cerrar" class="full-width" @click="closeDialogToShowUser" />
                                </div>
                                <div v-if="!onlyRead" class="col-6 q-pa-md">
                                    <q-btn size="md" label="Cancelar" class="full-width"
                                        @click="closeDialogToCreateEditUser" />
                                </div>
                                <div v-if="!onlyRead" class="col-6 q-pa-md">
                                    <q-btn size="md" type="submit" label="Guardar" class="full-width" icon="fas fa-save"
                                        style="background: #00A982;color:white;" />
                                </div>
                            </div>
                        </div>
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="showDialogToDisableEnableUser">
            <q-card style="min-width: 800px;min-height: 400px;">
                <q-card-section style="background-color: #C39326;" class="text-white">
                </q-card-section>
                <q-card-section style="background: #9F2241;" class="text-white">
                    <div class="text-h6"><i class="fas fa-user-times"></i>¿Desea continuar?</div>
                </q-card-section>

                <q-card-section class="text-center">
                    <div class="q-pa-md">
                        <q-avatar size="150px" font-size="90px" style="color:#DB5761" icon="fa-solid fa-user-xmark" />
                        <h6>¿Estás seguro que quieres desactivar el usuario?</h6>
                    </div>
                </q-card-section>

                <q-card-actions>
                    <div class="q-pa-md" style="width: 100%;">
                        <div class="row">
                            <div class="col-6">
                                <q-btn size="md" label="Cancelar" class="full-width"
                                    @click="showDialogToDisableEnableUser" style="background: #9F2241;color:white;"
                                    v-close-popup />
                            </div>
                            <div class="col-6">
                                <q-btn size="md" label="Confirmar" class="full-width" icon="fas fa-save"
                                    @click="disableOrEnableUSer" style="background: #00A982;color:white;" />
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
import HeaderSection from 'components/HeaderSection.vue';
import {onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";

import useNotify from "src/composables/useNotify";
//import DeleteAlert from "components/DeleteAlert.vue";
import DisableUserDialog from 'components/DisableUserDialog.vue';
import UserServices from "src/services/administration/UserServices";
import CatalogServices from 'src/services/administration/CatalogServices';

import imageRoute from 'src/assets/icons/Home/admin_usuarios.png';
import { useAuthUserStore } from 'src/stores/AuthUser';
const iconModule = ref(imageRoute);

const $q = useQuasar();
const { showError, showSuccess } = useNotify()
const store = useAuthUserStore()

const search = ref('')

const showDialogToCreateEditUser = ref(false)
const showDialogToDisableEnableUser = ref(false)
const registers = ref([])
const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
})
const columns = ref([
    {
        name: 'id_usuario',
        align: 'left',
        label: 'ID',
    },
    {
        name: 'username',
        align: 'left',
        label: 'usuario',
        field: row => row.usuario,
    },
    {
        name: 'full_name',
        align: 'left',
        label: 'Nombre de usuario'
    },
    {
        name: 'profile',
        align: 'left',
        label: 'Perfil',
        field: row => row.correo,
    },
    {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        headerStyle: 'width: 300px'
    }
])

const catalogs = ref({
    catPerfil: [],
    catOficina: []
})

const permissionTree = ref([]);
const permissionOriginal = ref([]);




const buildTree = (permissions, parentId = null) => {
  return permissions
    .filter(permission => permission.parent_id === parentId)
    .map(permission => ({
      id: permission.id,
      display_name: permission.display_name,
      children: buildTree(permissions, permission.id),

      // ✅ Si el perfil es 1 → checkboxes habilitados
      //    Si no → deshabilitados (solo lectura)
      tickable: formUser.value.id_perfil === 4,
      disabled: formUser.value.id_perfil !== 4
    }));
};



const filterOptions = ref()

const getCatalog = () => {
    const data = {
        params: {
            catPerfil: true,
            catOficina: true,
            permission: true
        }
    }
    CatalogServices.index(data).then(response => {
      const {data} =response.data;

      catalogs.value = data
      permissionTree.value = buildTree(data.permission);
      permissionOriginal.value = data.permission
      filterOptions.value=catalogs.value.cat_oficina;
    }).catch(e => console.log(e)).finally(() => { })

}

getCatalog();

const getRegisters = (props) => {
    if (props !== undefined) {
        pagination.value = props.pagination
    }
    const data = {
        params: {
            page: pagination.value.page,
            rowsPerPage: pagination.value.rowsPerPage,
            search: search.value ? search.value : ''
        }
    };

    $q.loading.show()
    UserServices.index(data).then(response => {
        $q.loading.hide()
        registers.value = response.data.data
        pagination.value = {
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total
        }
    }).catch(e => {
        console.log('error', e)
        $q.loading.hide()

        showError(
            'Error',
            'No se puede completar la acción'
        )
    })
}
const modelUser = ref({
    name: null,
    first_name: null,
    second_name: null,
    email: null,
    usuario_directorio_activo: true,
    id_oficina: null,
    id_perfil: null,
    puesto: null,
    permissions: []
})

const formUser = modelUser;
watch(() => formUser.value.id_perfil, () => {

  permissionTree.value = buildTree(permissionOriginal.value);
}, { immediate: true });

watch(() => formUser.value.permissions, () => {

  permissionTree.value = buildTree(permissionOriginal.value);
}, { immediate: true, deep: true });

    // const updateUsuarioDirectorioActivo = () =>{

    //     searchLdapUser.value        = null;
    //     formUser.value.name         = null;
    //     formUser.value.first_name   = null;
    //     formUser.value.second_name  = null;
    //     formUser.value.email        = null;

    // }

const searchLdapUser = ref('');


const nombreUsuarioRules = [
    val => !!val || 'El nombre de usuario es requerido.', // Campo requerido
    val => (val && val.length <= 30) || 'Máximo 30 caracteres.', // Límite de longitud
    val => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val) || 'Solo caracteres alfanuméricos (letras y números).' // Alfanumérico
];

const primerApellidoUsuarioRules = [
    val => !!val || 'El Primer Apellido es requerido.', // Campo requerido
    val => (val && val.length <= 30) || 'Máximo 30 caracteres.', // Límite de longitud
    val => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val) || 'Solo caracteres alfanuméricos (letras y números).' // Alfanumérico
];

const segundoApellidoUsuarioRules = [
    val => (val === null || val === '' || val.length <= 30) || 'Máximo 30 caracteres',
    val => (val === null || val === '' || /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) || 'Solo caracteres alfanuméricos',
];

const correoElectronicoUsuarioRules = [
    val => (val && val.length > 0) || 'El correo electrónico es obligatorio',
    val => /.+@.+\..+/.test(val) || 'Formato de correo electrónico inválido'
];

const perfilUsuarioRules = [
    val => (val !== null && val !== undefined && val !== '') || 'La selección de perfil es obligatoria'
];

const filterOffices = (val, update) => {

        if (val === '' || val.length < 3) {
          update(()=>catalogs.value.cat_oficina=filterOptions.value)
          return
        }

         update(() => {
          const needle = val.toLowerCase()
          catalogs.value.cat_oficina = filterOptions.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
}

const clearPermissionsAndTree = () =>{
  permissionTree.value = buildTree(permissionOriginal.value);
}

const clearProfile = () =>{
  defaultPermissions.value = [];
  clearPermissionsAndTree();
}

const defaultPermissions = ref([]);

const updatePermisions = () => {
    if(typeof formUser.value.id_perfil !== 'number')return

    const profileSelected = catalogs.value.cat_perfil.find(profile => profile.id_perfil == formUser.value.id_perfil);

    defaultPermissions.value = profileSelected.permissions;
    clearPermissionsAndTree();
}

watch(() => defaultPermissions.value, (newVal) => {
    formUser.value.permissions = newVal.map(perm => perm.id);
}, { immediate: true });

const onSubmit = (() => {
    typeof formUser.value.id === 'number' ? requestUserUpdate() : requestUserStore()
})

const showValidationError = (error)=>{
  const validationErrors = error.response.data.errors

          let errorMessage = 'Por favor, corrige los siguientes errores:<br>'
          for (const field in validationErrors) {
            validationErrors[field].forEach(message => {
              errorMessage += `- ${message}<br>`
            })
          }
          $q.notify({
            type: 'negative',
            message: errorMessage,
            html: true,
            position: 'top',
            timeout: 5000
          });
}

const requestUserStore = () => {
    $q.loading.show();
    try {
        UserServices.store({ name: formUser.value.name, first_name: formUser.value.first_name, second_name: formUser.value.second_name, email: formUser.value.email, id_oficina: formUser.value.id_oficina, id_perfil: formUser.value.id_perfil, usuario_directorio_activo: formUser.value.usuario_directorio_activo, puesto: formUser.value.puesto, permissions: formUser.value.permissions }).then(response => {
            const { data } = response;
            if (data.status == 'saved') {
                showSuccess(
                    'Correcto',
                    'Se agregó correctamente al usuario'
                )
                getRegisters()
                showDialogToCreateEditUser.value = false;
                clearForm();
            }
        }).catch((error) => {
            console.error('Error:', error.response?.data || error.message);
            if (error.response?.status === 403) {
            showError(
                'Acceso denegado',
                error.response.data.message || 'No autorizado'
            );
        }
        else if (error.response && error.response.status === 422) {
        showError(
            'Usuario duplicado',
            error.response.data.message || 'El usuario ya está registrado'
        )
        } else {
        showError(
            'Error interno del servidor',
            'Ocurrió un error inesperado en el servidor, intenta más tarde'
        )
        }

        }).finally(() => $q.loading.hide())
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

const requestUserUpdate = async () => {
  $q.loading.show();

  try {
    const response = await UserServices.update(formUser.value.hash_id, formUser.value);
    const { data } = response;

    if (data.status === 'updated') {
      showSuccess('Correcto', 'Se actualizó correctamente al usuario');
      await getRegisters();
      formUser.value = modelUser;
      showDialogToCreateEditUser.value = false;


      await store.sessionInfo();
      console.log('🔁 Usuario actualizado:', store.user.permissions);
    }
  } catch (error) {
    console.error('Error submitting form:', error.response?.data || error.message);

     if (error.response?.status === 403) {
            showError(
                'Acceso denegado',
                error.response.data.message || 'No autorizado'
            );
        }
    else if (error.response && error.response.status === 422) {
      showValidationError(error);
    } else {
      showError('Error interno del servidor', 'Ocurrió un error inesperado en el servidor, intenta más tarde');
    }
  } finally {
    $q.loading.hide();
  }
};

function onReset() {
    clearForm();
}

const clearForm = () => {
    Object.assign(formUser.value, modelUser)

    formUser.value.id = undefined;
    formUser.value.name = null;
    formUser.value.first_name = null;
    formUser.value.second_name = null;
    formUser.value.username = null;
    formUser.value.email = null;
    formUser.value.id_oficina = null;
    formUser.value.usuario_directorio_activo = true;
    formUser.value.id_perfil = null;
    formUser.value.permissions = [];
    searchLdapUser.value = ''

    clearPermissionsAndTree();
}

const closeDialogToCreateEditUser = () => {
    clearForm();
    showDialogToCreateEditUser.value = false;
}

const closeDialogToShowUser = () => {
    onlyRead.value = false;
    clearForm();
    showDialogToCreateEditUser.value = false;
}

const editUser = (id) => {
    $q.loading.show()
    UserServices.edit(id).then(response => {
        const { data } = response.data;

        formUser.value = data;
        formUser.value.id_perfil = data.usuario_perfil.id_perfil

        showDialogToCreateEditUser.value = true;

       permissionTree.value = buildTree(permissionOriginal.value);
    }).catch(error=> {
        if (error.response) {
        showError(
            'Error',
            error.response.data.message || 'No autorizado'
        )
    } else {
        showError(
            'Error',
            'Error de conexión con el servidor'
        )
    }
    }).finally(()=>$q.loading.hide());
}

const onlyRead = ref(false);

const showUser = (id) => {
    $q.loading.show()
    UserServices.show(id).then(response => {
        const { data } = response.data;

        formUser.value = data
        formUser.value.id_perfil = data.usuario_perfil.id_perfil

        showDialogToCreateEditUser.value = true;

        onlyRead.value = true;

       permissionTree.value = buildTree(permissionOriginal.value);
    }).catch(error=>{
        console.log(error)
        if (error.response?.status === 403) {
            showError(
                'Acceso denegado',
                error.response.data.message || 'No autorizado'
            );
        }
    }).finally(()=>$q.loading.hide());
}

const disableOrEnableUserDialog = (id, status, username) => {
    $q.dialog({
        component: DisableUserDialog,
        componentProps: {
            icon: status === false ? 'fa-solid fa-user-xmark' : 'fa-solid fa-user-check',
            title: status === false ? 'Baja de Usuario' : 'Activar Usuario',
            subtitle: '¿Desea continuar?',
            question: status === false ? '¿Estás seguro que quieres desactivar el usuario?' : '¿Estás seguro que quieres activar el usuario?',
            button: 'Aceptar'
        }

    }).onOk(() => {
        changeStatus(id, username);
    }).onCancel(() => {
        showError('','Operación cancelada')
    })
}


const changeStatus = (id, username) => {
    $q.loading.show()
    UserServices.changeStatus(id).then(response => {
        const { data } = response;
        showSuccess(
            'Éxito',
            data.status === 'disabled' ? 'El usuario Se desactivó correctamente' : `El usuario ${username} se activó correctamente`
        )
        getRegisters()
    }).catch(error => {
        console.log(error)
        if (error.response) {
        showError(
            'Error',
            error.response.data.message || 'No autorizado'
        )
    } else {
        showError(
            'Error',
            'Error de conexión con el servidor'
        )
    }
    }).finally(()=>$q.loading.hide())
}

getRegisters()

onMounted(() => {
  //Transicion bitacora (moduleId, typeTransactionId)
})

</script>


<style scoped>
thead tr:first-child th {
    background-color: #6F7271;
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
</style>

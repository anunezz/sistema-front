<template>
  <header-section title="Administración de Bitácora de Impedimentos" :icon-image="iconModule">
    <template v-slot:buttons>
      <!-- <q-btn
            size="12px"
            color="green"

            @click="exportData">
            Descargar Excel
          </q-btn> -->
    </template>
  </header-section>
  <br>
  <div class="q-pa-md">
    <div class="row justify-end">
      <div class="col-12 col-md-12 col-sm-12 col-xs-12">
        <q-btn
              outline
              size="12px"
              color="withe"
              icon="fa-solid fa-magnifying-glass"
              label="Filtros avanzados"
              @click="advanced_filters = true" />
        <!-- <div class="row justify-end q-gutter-xs">
          <q-btn size="12px" color="green" text-color="white" label="Nuevo Usuario"
                @click="$router.push({name:'BinnacleCreate'})"
                :style="'width:' + ($q.screen.width <= 468 ? '100%' : '')"/>
          <q-input
            outlined
            clearable
            dense
            :style="'width:' + ($q.screen.width <= 468 ? '100%' : '45%')"
            placeholder="Buscar..."
            v-model="search"
            @keyup.enter="getRegisters({ pagination: pagination })"
            @clear="getRegisters({ pagination: pagination })">
            <template v-slot:append>
              <i class="fa-solid fa-magnifying-glass cursor-pointer"
                @click="getRegisters({ pagination: pagination })"/>
            </template>
          </q-input>
        </div> -->
      </div>
    </div>
    <br>
    <q-table
    :rows="registers"
    :columns="columns"
    separator="cell"
    no-data-label="No hay datos"
    dense
    rows-per-page-label="Registros por página"
    :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
      return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
    }"
    flat
    bordered
    v-model:pagination="pagination"
    :rows-per-page-options="[5, 10, 20, 50, 100]"
    @request="getRegisters"
    row-key="id"
  >

    <!-- Encabezado -->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <b>{{ col.label }}</b>
        </q-th>
        <!-- <q-th>
          <b>Acciones</b>
        </q-th> -->
      </q-tr>
    </template>

  <template v-slot:body="props">
  <q-tr :props="props" :class="[
    props.row.urgencia ? 'bg-red-3 text-black' : 'bg-white',
    props.pageIndex % 2 !== 0 ? 'bg-grey-3' : ''
  ]">
    <q-td>{{ props.row.numero_impedimento || '-' }}</q-td>
    <q-td>{{ props.row.full_name || '-' }}</q-td>
    <q-td>{{ props.row.curp || '-' }}</q-td>
    <q-td>{{ props.row?.cat_type?.tipo_solicitud || 'Actualización' }}</q-td>
    <q-td>{{ props.row.created_at_impedimento || '-' }}</q-td>
    <q-td>{{ props.row?.cat_office?.cad_oficina || '-' }}</q-td>
    <q-td style="min-width: 200px; width: 200px; word-break: break-word; white-space: normal;">
      {{ truncateText(props.row?.cat_causal?.causal_impedimento, 50) }}
    </q-td>
    <q-td>{{ props.row.cat_status.estatus_solicitud || '-' }}</q-td>
    <q-td style="width: 10%; text-align: center">
      <q-btn
        @click="viewDetails(props.row)"
        size="sm"
        color="primary"
        icon="visibility"
      >
        <q-tooltip>Ver detalles</q-tooltip>
      </q-btn>
    </q-td>
  </q-tr>
</template>

</q-table>

  </div>


<!-- filtros avanzados modal-->
<Modal v-model="advanced_filters"  @keyup.enter="getRegisters()" title="Filtros Avanzados">
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">

      <!-- <div class="col-md-12 q-pa-md">
        <label for='id_representations' style='font-weight: bold;'>ID de impedimento</label>
        <q-input outlined dense label="ID de impedimento"  hint="ID de impedimento" v-model="state.id_impedimento"/>
      </div> -->

      <div class="col-md-12 q-pa-md">
        <q-input outlined dense label="Número de impedimento"  v-model="state.form.numero_impedimento"/>
      </div>
      <div class="col-md-12 q-pa-md">
        <q-input outlined dense label="Nombre"  v-model="state.form.name">

        </q-input>
      </div>
      <div class="col-md-12 q-pa-md">
        <q-input outlined dense label="Curp" v-model="state.form.curp">

        </q-input>
      </div>


                <div class="col-md-12 q-pa-md">
                <q-select
                  @new-value="newValue"
                  dense
                  use-chips
                  outlined
                  use-input
                  emit-value
                  map-options
                  v-model='state.form.id_oficina'
                  :options='state.options_oficina'
                  option-value='id_oficina'
                  option-label='cad_oficina'
                  label='Oficina'
                  clearable/>
                </div>
              <div class="col-md-12 q-pa-md">
                <q-select
                  @new-value="newValue"
                  dense
                  use-chips
                  outlined
                  use-input
                  emit-value
                  map-options
                  v-model='state.form.id_type'
                  :options='state.options_tipo_solicitud'
                  option-value='id_tipo_solicitud'
                  option-label='tipo_solicitud'
                  label='Tipo de solicitud'
                  clearable/>
                </div>

          <div class="col-md-12 q-pa-md">
                <q-select
                  @new-value="newValue"
                  dense
                  use-chips
                  outlined
                  use-input
                  emit-value
                  map-options
                  v-model='state.form.id_estatus'
                  :options='state.options_estatus_solicitud'
                  option-value='id_estatus_solicitud'
                  option-label='estatus_solicitud'
                  label='Estatus'
                  clearable/>
                </div>

              <div class="col-md-12 q-pa-md">
                <q-select
                  @new-value="newValue"
                  dense
                  use-chips
                  outlined
                  use-input
                  emit-value
                  map-options
                  v-model='state.form.id_causal'
                  :options='state.options_causal'
                  option-value='id_causal_impedimento'
                  option-label='causal_impedimento'
                  label='Causal'
                  clearable/>
              </div>

              <div class="col-md-12 q-pa-md">
              <q-input outlined dense label="Fecha inicial y fecha final" v-model="state.form.date" mask="##-##-#### ##-##-####">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="state.date" mask="DD-MM-YYYY"  :locale="myLocale" minimal range>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
    </div>
              <br/>
          <div class="row justify-center q-gutter-xs">
            <q-btn
              outline
              size="12px"
              color="white"
              text-color="black"
              icon="fas fa-eraser"
              label="Limpiar"
              @click="clearForm"
            />
            <q-btn
              outline
              size="12px"
              icon="fas fa-filter"
              color="primary"
              @click="getRegisters(null,true)"
              label="Buscar"
            />
            </div>
  </div>
</Modal>

<!-- MODAL VER DETALLES -->
<q-dialog v-model="view_details">
  <q-card style="width: 100%; max-width: 900px; overflow-x: hidden">

    <!-- Encabezado -->
    <q-card-section style="background-color: #691C32;" class="text-white">
      <div class="text-h6">Detalle del Impedimento</div>
    </q-card-section>

    <!-- Sección 1: Datos generales -->
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round style="background-color: #691C32;" text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-lista.png">
              </q-avatar>
            </q-btn>
            Datos generales del impedimento
          </h5>
        </div>
      </div>

      <q-list bordered>
        <q-item>
          <q-item-section>Folio de impedimento:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.numero_impedimento || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Oficina:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.cat_office?.cad_oficina || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Correo electrónico:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.correo_electronico || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Dependencia:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.dependencia ? 'Sí' : 'No' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Fecha de registro:</q-item-section>
          <q-item-section class="break-text">
            {{
              register_detail?.created_at_impedimento
                ? date.formatDate(register_detail.created_at_impedimento, 'DD-MM-YYYY HH:mm:ss')
                : '-'
            }}
          </q-item-section>
        </q-item>

        <q-separator class="q-mx-md q-my-md"/>

        <q-item class="q-mt-lg">
  <q-item-section>
    <div class="row q-col-gutter-md">

	  <div class="col-6">
        <div class="text-subtitle2 text-grey-7">Usuario que elaboró</div>
        <div class="text-subtitle2 break-text">
          {{ register_detail?.usuario_elaboro?.full_name || '-' }}
        </div>
      </div>

	  <div class="col-6">
        <div class="text-subtitle2 text-grey-7">Usuario que revisó</div>
        <div class="text-subtitle2 break-text">
          {{ register_detail?.usuario_reviso?.full_name || '-' }}
        </div>
      </div>

	  <div class="col-6">
        <div class="text-subtitle2 text-grey-7">Usuario que autorizó</div>
        <div class="text-subtitle2 break-text">
          {{ register_detail?.usuario_autorizo?.full_name || '-' }}
        </div>
      </div>

      <div class="col-6" v-if="register_detail?.is_active" >
        <div class="text-subtitle2 text-grey-7">Baja</div>
		<div class="text-subtitle2 break-text">
          {{ ( register_detail.id_estatus_impedimento_baja == 150 ) ? register_detail?.usuario_alta_baja?.full_name : '-' }}
        </div>
      </div>
      <div class="col-6" v-else >
        <div class="text-subtitle2 text-grey-7">Alta</div>
        <div class="text-subtitle2 break-text">
          {{ register_detail?.usuario_altas?.full_name || '-' }}
        </div>
      </div>

    </div>
  </q-item-section>
</q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <!-- Sección 2: Datos personales -->
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round style="background-color: #691C32;" text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-user.png">
              </q-avatar>
            </q-btn>
            Datos personales
          </h5>
        </div>
      </div>

      <q-list bordered>
        <q-item>
          <q-item-section>CURP:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.curp || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Nombre(s):</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.nombres || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Primer apellido:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.primer_apellido || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Segundo apellido:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.segundo_apellido || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Correo electrónico:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.correo_electronico || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Fecha de nacimiento:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.fecha_nacimiento ? register_detail.fecha_nacimiento : '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Género:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.cat_genero?.genero || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Entidad federativa de nacimiento:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.entidad_federativa_nacimiento || '-' }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <!-- Datos padre -->
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round style="background-color: #691C32;" text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-fam.png" />
              </q-avatar>
            </q-btn>
            Datos personales del padre
          </h5>
        </div>
      </div>

      <q-list bordered class="bg-white q-mb-sm">
        <q-item>
          <q-item-section>Nombre(s):</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.nombres_padre || '-' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Primer apellido:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.primer_apellido_padre || '-' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Segundo apellido:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.segundo_apellido_padre || '-' }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Datos madre -->
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round style="background-color: #691C32;" text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-fam.png" />
              </q-avatar>
            </q-btn>
            Datos personales de la madre
          </h5>
        </div>
      </div>

      <q-list bordered class="bg-grey-2 q-mb-sm">
        <q-item>
          <q-item-section>Nombre(s):</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.nombres_madre || '-' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Primer apellido:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.primer_apellido_madre || '-' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Segundo apellido:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.segundo_apellido_madre || '-' }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator/>

    <!-- Sección 3: Motivación -->
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round style="background-color: #691C32;" text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-lista.png">
              </q-avatar>
            </q-btn>
            Motivación del acto jurídico
          </h5>
        </div>
      </div>

      <q-list bordered>
        <q-item>
          <q-item-section>Causal:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.cat_causal_impedimento?.causal_impedimento || '-' }}</q-item-section>
        </q-item>

        <q-item v-if="register_detail.id_causal_impedimento == 19">
          <q-item-section>Otra:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.causal_otro_descripcion || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Subcausal:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.cat_subcausal_impedimento?.subcausal_impedimento || '-' }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>Motivación:</q-item-section>
          <q-item-section class="break-text">
            <div v-html="register_detail?.motivacion_acto_juridico || '-'"></div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <!-- Sección 4: Documentos -->
    <!-- <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round style="background-color: #691C32;" text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-plus.png">
              </q-avatar>
            </q-btn>
            Documentos anexos
          </h5>
        </div>
      </div>

      <q-list bordered>
        <q-item v-if="register_detail?.anexo_expediente_integrado">
          <q-item-section>Anexo expediente integrado:</q-item-section>
          <q-item-section class="break-text">
            <a :href="`/storage/${register_detail.anexo_expediente_integrado}`" target="_blank">
              {{ register_detail.anexo_expediente_integrado }}
            </a>
          </q-item-section>
        </q-item>

        <q-item v-if="register_detail?.anexo_dictamen_verificacion">
          <q-item-section>Dictamen de verificación:</q-item-section>
          <q-item-section class="break-text">
            <a :href="`/storage/${register_detail.anexo_dictamen_verificacion}`" target="_blank">
              {{ register_detail.anexo_dictamen_verificacion }}
            </a>
          </q-item-section>
        </q-item>

        <q-item v-if="register_detail?.otro_documento_soporte">
          <q-item-section>Otro documento:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.otro_documento_soporte }}</q-item-section>
        </q-item>

        <q-item v-if="register_detail?.numero_pasaporte_cancelado">
          <q-item-section>Número de pasaporte cancelado:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.numero_pasaporte_cancelado }}</q-item-section>
        </q-item>

        <q-item v-if="register_detail?.observaciones">
          <q-item-section>Observaciones:</q-item-section>
          <q-item-section class="break-text">{{ register_detail?.observaciones }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section> -->

    <!-- Botón Cerrar -->
    <q-card-actions align="right">
      <q-btn flat label="Cerrar" style="background-color: #691C32;" class="text-white" v-close-popup />
    </q-card-actions>

  </q-card>
</q-dialog>



</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue';
import {reactive, ref, onMounted,watch} from "vue";
import {useQuasar} from "quasar";
// import useNotify from "src/composables/useNotify";
// import DeleteAlert from "components/DeleteAlert.vue";
import ImpedimentBinnacleService from "src/services/administration/ImpedimentBinnacleService";
 import { date } from 'quasar'
import Modal from 'src/components/Modal.vue';

import imageRoute from 'src/assets/icons/Home/bitacora.png';
import { useRoute } from 'vue-router';
import useImpedimentForm from 'src/composables/useImpedimentForm';
import { BinnacleTransaction } from "src/utils/binnacle"
const {truncateText} = useImpedimentForm();

const iconModule = ref(imageRoute);

const $q = useQuasar();
// const {showError} = useNotify()
const route = useRoute()
const advanced_filters = ref(false)
const view_details = ref(false)
const register_detail = ref(null);
const registers = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const state = reactive({
    options_tipo_solicitud: [],
    options_causal: [],
    options_estatus_solicitud: [],
    options_oficina: [],
    date: [],
    id_impedimento: null,
    form: {
    name: null,
    id_type: null,
    id_estatus: null,
    id_causal: null,
    id_oficina: null,
    numero_impedimento : null,
    curp: null,

  },
})
const columns = ref([
  {
    name: 'numero_impedimento',
    align: 'left',
    label: 'Número impedimento',
    field: row => row.numero_impedimento
  },
  {
    name: 'full_name',
    align: 'left',
    label: 'Nombre',
    field: row => row.usuario_alta
  },
  {
    name: 'curp',
    align: 'left',
    label: 'Curp',
    field: row => row.usuario_alta
  },
  {
    name: 'tipo_solicitud',
    align: 'left',
    label: 'Tipo de solicitud',
    field: row => row.cat_type?.tipo_solicitud
  },
  {
    name: 'created_at_impedimento',
    align: 'left',
    label: 'Fecha de solicitud',
    field: row => row.created_at_impedimento,
  },
  {
    name: 'office',
    align: 'left',
    label: 'Oficina',
    field: row => row.cad_oficina,
  },
  {
    name: 'cat_causal_impedimento',
    align: 'left',
    label: 'Causal',
    field: row => row.causal_impedimento,
  },
  {
    name: 'status',
    align: 'left',
    label: 'Estatus',
    field: '-',
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    headerStyle: 'width: 300px'
  }
])


// const customDelete = (id) => {
//   $q.dialog({
//     component: DeleteAlert,
//     componentProps: {
//       icon: 'delete',
//       title: 'Baja de Usuario',
//       subtitle: 'Esta acción no se puede deshacer',
//       question: '¿DESEA ELIMINAR EL REGISTRO DE USUARIO DE FORMA PERMANENTE?',
//       button: 'Eliminar'
//     }

//   }).onOk(() => {
//     deleteRegister(id);
//   }).onCancel(() => {
//     $q.notify({
//       type: '',
//       message: 'Eliminación cancelada.'
//     });
//   })
// }

// const deleteRegister = (id) => {

//   UserServices.remove(id).then(response => {
//     console.log(response)
//     $q.loading.hide()
//     showSuccess(
//       'Éxito',
//       'Se eliminó el registro.'
//     )
//     getRegisters()
//   }).catch(error => {
//     $q.loading.hide()
//     console.log(error)
//     showError(
//       'Error',
//       'Intente nuevamente.'
//     )
//   })
// }

const getRegisters = (props,filterRegisters) => {
  if (props?.pagination) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
}
  if(filterRegisters){
    BinnacleTransaction(17, 5, `Se realizo busqueda con filtros avanzados en el módulo Bitácora impedimentos`)
  }

  const data = {
      params: {
      page: pagination.value.page,
      rowsPerPage: pagination.value.rowsPerPage,
    },
    filters: {
      name: state.form.name,
      numero_impedimento: state.form.numero_impedimento,
      id_type: state.form.id_type,
      id_estatus: state.form.id_estatus,
      id_causal: state.form.id_causal,
      id_oficina: state.form.id_oficina,
      id_impedimento: state.id_impedimento,
      from: state.date?.from,
      to: state.date?.to,
      curp: state.form.curp
    }
  };

  $q.loading.show()
  ImpedimentBinnacleService.index(data).then(response => {
      registers.value = response.data.Results.ImSolicitud.data

    pagination.value = {
      page: response.data.Results.ImSolicitud.current_page,
      rowsPerPage: response.data.Results.ImSolicitud.per_page,
      rowsNumber: response.data.Results.ImSolicitud.total
    }
    $q.loading.hide()
    advanced_filters.value = false
    }).catch(() => {
    $q.loading.hide()

    // showError(
    //   'Error',
    //   'No se puede completar la acción'
    // )
    })
}


// const exportData = () => {
//   if( registers.value-length === 0) {
//     $q.notify({
//        type: '',
//        message: 'No hay datos para exportar.'
//      });

//     return
//   }
//   const data = {
//     id_user: state.form.id_user,
//     id_movement: state.form.id_movement,
//     id_module: state.form.id_module,
//     date: state.date
//   }

//   $q.loading.show()
//   ImpedimentBinnacleService.export_data(data)
//     .then(response => {
//       // Crear un blob del archivo recibido
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
//       const url = window.URL.createObjectURL(blob)

//       // Crear un enlace para forzar descarga
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', 'Transacciones.xlsx')
//       document.body.appendChild(link)
//       link.click()

//       // Limpiar
//       link.remove()
//       window.URL.revokeObjectURL(url)

//       $q.loading.hide()
//     })
//     .catch(() => {
//       $q.loading.hide()
//       showError('Error', 'No se puede completar la acción')
//     })
// }


const clearForm = () => {
  state.form.name= null
  state.form.id_type = null
  state.form.id_estatus = null
  state.form.id_causal= null
  state.form.id_oficina = null
  state.form.numero_impedimento = null
  state.date = null
  state.form.curp = null
  getRegisters();
  BinnacleTransaction(17, 5, `Se limpiaron los filtros avanzados en el módulo Bitácora impedimentos`)
}


const getCatsBinnacle = async () => {
  const data = ''
    ImpedimentBinnacleService.get_cats_binnacle(data).then((response) => {
    if(response.data.success) {
      state.options_tipo_solicitud = (response.data?.Results?.catType || []).filter(
        item => item.id_tipo_solicitud !== 3
      );
      state.options_tipo_solicitud.push({
        id_tipo_solicitud: 999,
        tipo_solicitud: "Actualización",
      });
      state.options_tipo_solicitud.sort((a, b) =>
        a.tipo_solicitud.localeCompare(b.tipo_solicitud)
      );
      state.options_estatus_solicitud = response.data.Results.catEstatus;
      state.options_oficina = response.data.Results.catOffice;
      state.options_causal = response.data.Results.catCausal;
    }
    }).catch(e => {
     console.error("error: ",e);
    })
  }

  const newValue = (val,done) => {
    done(val);
  };
  watch(state, async (newVal) => {
  if (!newVal.date) {
    state.form.date = null
    return
  }

  // Si viene como string (mismo día)
  if (typeof newVal.date === 'string') {
    state.date = {
      from: newVal.date,
      to: newVal.date
    }
  }

  state.form.date = `${state.date.from} ${state.date.to}`
})


  onMounted(() => {
    const idFiltro = route.query.id || null
   if(idFiltro){
    state.id_impedimento = idFiltro
    console.log('idfiltro', idFiltro);
   }
   getRegisters({ pagination: pagination.value })
   getCatsBinnacle()
  })


const viewDetails = (row) => {
  $q.loading.show()
  register_detail.value = row || null;
  view_details.value = true;
  $q.loading.hide()
}
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
.title{
  font-weight: bold;
  background: #691C32;
  color: white;
  padding: 5px;
  font-size: 20px;
}

.advanced_filters_modal {
  position: absolute;
  top: 0;
  background-color: white;
  border: 1px solid #232323;
}

.q-tr.bg-red-3 {
  background-color: #E79595 !important; /* rojo */
  color: black !important;
}

.break-text {
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>

<template>
  <header-section title="Administración de Bitácora" :icon-image="iconModule">
    <template v-slot:buttons>
       <q-btn
       v-if="registers.length"
            size="12px"
            color="green"

            @click="exportData">
            Descargar Excel
          </q-btn>
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

  <!-- Cuerpo -->
  <template v-slot:body="props">
    <q-tr :props="props" :class="[props.pageIndex % 2 !== 0 ? 'bg-grey-3' : '']">
      <q-td>{{ props.row.user?.full_name || '-' }}</q-td>
      <q-td>{{ props.row.cat_tipos_transaccion?.name || '-' }}</q-td>
      <q-td>{{ props.row.cat_modulo?.name || '-' }}</q-td>
      <q-td>{{ props.row.action }}</q-td>
      <q-td>{{ date.formatDate(props.row.created_at, 'DD-MM-YYYY HH:mm:ss') }}</q-td>

      <!-- Botones de acción
      <q-td style="width: 10%; text-align: center">
        <q-btn
          style="margin-right: 5px"
          color="positive"
          size="sm"
          @click="$router.push({ name: 'UserEdit', params: { id: props.row.hash_id } })"
        >
          <i class="far fa-edit" style="font-size: 15px" />
          <q-tooltip anchor="top middle" self="center middle">
            Editar
          </q-tooltip>
        </q-btn>
        <q-btn
          color="red"
          size="sm"
          @click="customDelete(props.row.hash_id)"
        >
          <i class="far fa-trash-alt" style="font-size: 15px" />
          <q-tooltip anchor="top middle" self="center middle">
            Eliminar
          </q-tooltip>
        </q-btn>
      </q-td> -->
    </q-tr>
  </template>
</q-table>

<q-table
  v-if="userCount !== null"
  :rows="conteoRows"
  :columns="conteoColumns"
  row-key="conteo"
  dense
  flat
  bordered
  separator="cell"
  hide-bottom
/>

  </div>


<!-- filtros avanzados modal-->
<Modal v-model="advanced_filters"  @keyup.enter="getRegisters()" title="Filtros Avanzados">
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">

     <div class="col-md-12 q-pa-md">
              <q-select
                @new-value="newValue"
                dense
                use-chips
                outlined
                use-input
                emit-value
                map-options
                v-model='state.form.id_user'
                :options='state.options_users'
                option-value='id'
                option-label='username'
                label='Usuario'
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
                  v-model='state.form.id_movement'
                  :options='state.options_movements'
                  option-value='id'
                  option-label='name'
                  label='Movimiento'
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
                  v-model='state.form.id_module'
                  :options='state.options_modules'
                  option-value='id'
                  option-label='name'
                  label='Modulo'
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
              @click="getRegisters()"
              label="Buscar"
            />
            </div>
  </div>
</Modal>

</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue';
import {reactive, ref, onMounted,watch, computed} from "vue";
import {useQuasar} from "quasar";
import useNotify from "src/composables/useNotify";
// import DeleteAlert from "components/DeleteAlert.vue";
import BinnacleService from "src/services/administration/BinnacleService";
import { date } from 'quasar'
import Modal from 'src/components/Modal.vue';

import imageRoute from 'src/assets/icons/Home/bitacora.png';
import { BinnacleTransaction } from 'src/utils/binnacle';
// import { useRouter } from 'vue-router';
const iconModule = ref(imageRoute);

// const router = useRouter();

const $q = useQuasar();
const {showError} = useNotify()

const advanced_filters = ref(false)
const registers = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const userCount = ref(null);
const state = reactive({
  options_users: [],
  options_movements: [],
  options_modules: [],
  form: {
    id_user: null,
    id_movement: null,
    id_module: null,

  },
})

const  columns = [
{
    name: 'user',
    align: 'left',
    label: 'Nombre',
    field: row => row.user.full_name,
  },
  {
    name: 'cat_transaction_type',
    align: 'left',
    label: 'Movimiento',
    field: row => row.cat_tipos_transaccion.name,
  },
  {
    name: 'cat_module',
    align: 'left',
    label: 'Modulo',
    field: row => row.cat_modulo.name,
  },
  {
    name: 'action',
    align: 'left',
    label: 'Descripción',
    field: row => row.action,
  },
    {
    name: 'created_at',
    align: 'left',
    label: 'Fecha/Hora',
    field: row => row.created_at,
    },
]

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

const conteoColumns = [
  {
    name: 'conteo',
    label: 'Conteo de acciones por usuario',
    field: 'conteo',
    align: 'center',
    sortable: false
  }
];


const getRegisters = (props) => {
 if (props?.pagination) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
}

  const data = {
      params: {
      page: pagination.value.page,
      rowsPerPage: pagination.value.rowsPerPage,
    },
    id_user: state.form.id_user,
    id_movement: state.form.id_movement,
    id_module: state.form.id_module,
    date: state.date
  };

  $q.loading.show()
  BinnacleService.index(data).then(response => {
      registers.value = response.data.Results.transactions.data

    pagination.value = {
      page: response.data.Results.transactions.current_page,
      rowsPerPage: response.data.Results.transactions.per_page,
      rowsNumber: response.data.Results.transactions.total
    }

    userCount.value = response.data.Results.userCount
    $q.loading.hide()
  }).catch(() => {
    $q.loading.hide()

    showError(
      'Error',
      'No se puede completar la acción'
    )
  })
}


const exportData = () => {
  if( registers.value-length === 0) {
    $q.notify({
       type: '',
       message: 'No hay datos para exportar.'
     });

    return
  }
  const data = {
    id_user: state.form.id_user,
    id_movement: state.form.id_movement,
    id_module: state.form.id_module,
    date: state.date
  }

  $q.loading.show()
  BinnacleService.export_data(data)
    .then(response => {
      // Crear un blob del archivo recibido
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)

      // Crear un enlace para forzar descarga
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Transacciones.xlsx')
      document.body.appendChild(link)
      link.click()

      // Limpiar
      link.remove()
      window.URL.revokeObjectURL(url)

      BinnacleTransaction(14,11, 'Se Descargo el documento en Administración de bitácora')
      getRegisters()
      $q.loading.hide()
    })
    .catch(() => {
      $q.loading.hide()
      showError('Error', 'No se puede completar la acción')
    })
}


const clearForm = () => {
  state.form.id_user= null
  state.form.id_movement = null
  state.form.id_module = null
  state.form.date= null
  state.date = null
  getRegisters();
}


const getCatsBinnacle = async () => {
  const data = ''
  BinnacleService.get_cats_binnacle(data).then((response) => {
    if(response.data.success) {
      state.options_users = response.data.Results.catUsers;
      state.options_movements = response.data.Results.catTransactionTypes;
      state.options_modules = response.data.Results.catModules;
    }
    }).catch(e => {
     console.error("error: ",e);
    })
  }

  const newValue = (val,done) => {
    done(val);
  };
  watch(state, async (newVal) => {
    if( newVal.date ){
     if( typeof newVal.date === 'object' ){
        state.form.date = `${newVal.date.from} ${newVal.date.to}`;
     }else{
        state.form.date = `${newVal.date} ${newVal.date}`;
     }
   }else{
      state.form.date = null;
     }
  })

// function obtenerTipoDesdeAccion(texto) {
//   const match = texto.match(/\b(solicitud|impedimento)\b/i)
//   return match ? match[1].toLowerCase() : null
// }


// function irABitacoraDesdeTexto(texto) {
//   const id = obtenerIdDesdeAccion(texto)
//   const tipo = obtenerTipoDesdeAccion(texto)

//   if(tipo == 'solicitud') {
//     router.push({name: "ApplicationBinnacleIndex",query: {
//       id
//     }})
//   } if(tipo === 'impedimento'){
//     router.push({name: "ImpedimentBinnacleIndex", query: {
//       id
//     }})

//   }
// }

// Total = total de registros que regresó el backend (post-filtro)
const totalAccionesPorUsuario = computed(() =>
  (pagination.value?.rowsNumber ?? registers.value?.length ?? 0)
);

// Fila única para la tabla de conteo
const conteoRows = computed(() => [
  { conteo: totalAccionesPorUsuario.value }
]);


watch(
  () => state.date,
  (val) => {
    console.log('Nuevo valor de state.date:', val)

    const formatDate = (d) => {
      if (!d) return ''
      const [year, month, day] = d.split('/')
      return `${day}-${month}-${year}`
    }

    if (typeof val === 'string') {
      // Un solo día seleccionado
      const formatted = formatDate(val)

      state.form.date = `${formatted} ${formatted}`
    } else if (val && val.from && val.to) {
      // Rango de fechas
      const fromFormatted = formatDate(val.from)
      const toFormatted = formatDate(val.to)

      state.form.date = `${fromFormatted} ${toFormatted}`
    } else {
      state.form.date = ''

    }
  },
  { deep: true }
)



  onMounted(() => {
   getRegisters({ pagination: pagination.value })
   getCatsBinnacle()
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
</style>

<template>
<header-section title="Validación de de modificación" :icon-image="iconModule">
</header-section>

<Modal v-model="dialog"  @keyup.enter="getRegisters()" title="Filtros Avanzados">
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="ID Solicitud"
          type="number"
          v-model="filters.id_solicitud"
          v-max="100">
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
            v-model='filters.id_causal_impedimento'
            :options='options.cat_causal_impedimento'
            option-value='id_causal_impedimento'
            option-label='causal_impedimento'
            label='Causal'
            clearable
            multiple
            @filter="filterFnCatCausal"
          />
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
            v-model="filters.id_tipo_solicitud"
            :options="options.cat_tipo_solicitud"
            option-value="id_tipo_solicitud"
            option-label="tipo_solicitud"
            label="Tipo de solicitud"
            clearable
            multiple
          />
        </div>

      <!--<div class="col-md-12 q-pa-md">
        <q-input outlined dense label="Fecha inicial y fecha final" v-model="filters.date" mask="##-##-#### ##-##-####">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="state_date" mask="DD-MM-YYYY"  :locale="myLocale" minimal range>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>-->

      <div class="col-md-12 q-pa-md">
        <q-input
          dense
          mask="##-##-#### ##-##-####"
          label="Fecha inicial y fecha final"
          outlined
          v-model="yesterday_input"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date range v-model="yesterday" :locale="myLocale" :options="getDayCalendar">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
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
          v-model='filters.id_oficina'
          :options="[3, 4, 5].includes(store.user.perfil.id_perfil) ? options.office : [{id_oficina: store.user.oficina.id_oficina, cad_oficina: store.user.oficina.cad_oficina}]"
          option-value='id_oficina'
          option-label='cad_oficina'
          label='Oficina'
          clearable
          multiple
          @filter="filterFnCatOffice"
        />
      </div>

      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="Nombre(s)"
          v-model="filters.nombres"
          v-max="30">
        </q-input>
      </div>
      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="Apellido paterno"
          v-model="filters.primer_apellido"
          v-max="30">
        </q-input>
      </div>
      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="Apellido materno"
          v-model="filters.segundo_apellido"
          v-max="30">
        </q-input>
      </div>
      <div class="col-md-12 q-pa-md">
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Curp"
            v-model="filters.curp"
            v-uppercase
            v-no-spaces
            v-max="18">
          </q-input>
      </div>
  </div>
    <br>
    <div class="row justify-center q-gutter-xs">
      <q-btn
          outline
          size="12px"
          color="white"
          text-color="black"
          icon="fas fa-eraser"
          label="Limpiar"
          @click="clearFilters()"
          />
      <q-btn
          outline
          size="12px"
          icon="fas fa-filter"
          color="primary"
          @click="search()"
          label="Buscar"
          />
    </div>
  </div>
</Modal>

  <div class="q-pa-md">
    <div class="row justify-end">
      <div class="col-12 col-md-12 col-sm-12 col-xs-12">
        <div class="row justify-end q-gutter-xs">
          <q-btn-group>
            <q-btn
              v-if="store.user.perfil.id_perfil == 1 || store.user.perfil.id_perfil == 4"
              outline
              size="12px"
              color="primary"
              label="Nuevo Registro"
              icon="fa-solid fa-plus"
              @click="newRegister"
              :style="'width:' + ($q.screen.width <= 468 ? '100%' : '')"/>
            <q-btn
              outline
              size="12px"
              color="withe"
              icon="fa-solid fa-magnifying-glass"
              label="Filtros avanzados"
              @click="dialog = true" />
          </q-btn-group>
        </div>
      </div>
    </div>
</div>

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
    row-key="name"
  >
  <template v-slot:header="props">
    <q-tr :props="props">
      <q-th
        v-for="col in props.cols"
        :key="col.name"
        :props="props">
        <b>{{ col.label }}</b>
      </q-th>
    </q-tr>
  </template>
  <template v-slot:body="props">
    <q-tr :props="props" :class="[ props.row.id_prioridad == 1 ? 'bg-red-3 text-black' : 'bg-white']">
      <q-td>
        {{ props.row.id_solicitud }}
      </q-td>
      <q-td>
        {{ props.row.full_name }}
      </q-td>
      <q-td>
        {{ props.row.curp }}
      </q-td>
      <q-td>
        {{ props.row.cat_type?.tipo_solicitud }}
      </q-td>
      <q-td>
        {{ formatDMY(props.row.fecha_registro) }}
      </q-td>
      <q-td>
        {{ props.row.cat_office?.cad_oficina }}
      </q-td>
      <q-td style="min-width: 200px; width: 200px;word-break: break-word; white-space: normal;">
        <div style="white-space: normal;">
          {{ truncateText(props.row.cat_causal_impedimento?.causal_impedimento,50) }}
        </div>
      </q-td>
      <q-td>
        {{ props.row.cat_status?.estatus_solicitud }}
      </q-td>

      <q-td>
        <div class="flex justify-center">
          <q-btn-group>
            <q-btn
              color="positive"
              size="sm"
              @click="updateRegister(props.row.hash_id)"
              icon="edit"
            >
              <q-tooltip anchor="top middle" self="center middle">
                Editar
              </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </q-td>

    </q-tr>
  </template>
</q-table>

</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue';
import {ref,onMounted,watch} from "vue";
import Modal from 'src/components/Modal.vue';
import {useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import {useAuthUserStore} from "stores/AuthUser";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';

import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png';
import useImpedimentForm from 'src/composables/useImpedimentForm';
import { BinnacleTransaction } from 'src/utils/binnacle';
const iconModule = ref(imageRoute);

const router = useRouter();
const $q = useQuasar();
const store = useAuthUserStore()
const {truncateText,formatDMY} = useImpedimentForm()
const dialog = ref(false);
const filters = ref({
  id_causal_impedimento: null,
  numero_impedimento: null,
  nombres:null,
  primer_apellido: null,
  segundo_apellido: null,
  id_oficina:null,
  heigh: null,
  date: null,
  id_office: null,
  id_tipo_solicitud: null,
  curp: null,
  id_solicitud: null,

});
const options = ref({
  cat_causal_impedimento:[],
  office:[],
  cat_tipo_solicitud:[]
});
const catalogsOptions = ref({
  cat_causal_impedimento: [],
  office: [],
  cat_tipo_solicitud:[]
})
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const registers = ref([]);
const columns = ref([
  {
    name: 'id_solicitud',
    align: 'left',
    label: 'ID de solicitud',
    field: row => row.id_solicitud,
    headerStyle: 'width: 90px'
  },
  {
    name: 'full_name',
    align: 'left',
    label: 'Nombre',
    field: row => row.full_name,
    headerStyle: 'width: 90px'
  },
  {
    name: 'curp',
    align: 'left',
    label: 'Curp',
    field: row => row.curp,
    headerStyle: 'width: 90px'
  },
  {
    name: 'tipo_solicitud',
    align: 'left',
    label: 'Tipo de solicitud',
    field: row => row.tipo_solicitud,
    headerStyle: 'width: 90px'
  },
  {
    name: 'date',
    align: 'left',
    label: 'Fecha de solicitud',
    field: row => row.date,
    headerStyle: 'width: 90px'
  },
  {
    name: 'office',
    align: 'left',
    label: 'Oficina',
    field: row => row.cat_office.cad_oficina,
    headerStyle: 'width: 90px'
  },
  {
    name: 'cat_causal_impedimento',
    align: 'left',
    label: 'Causal',
    field: row => row.cat_causal_impedimento?.causal_impedimento,
    headerStyle: 'width: 200px'
  },
  {
    name: 'status',
    align: 'left',
    label: 'Estatus',
    field: row => row.cat_status.estatus_solicitud,
    headerStyle: 'width: 90px'
  },  
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    headerStyle: 'width: 90px'
  }
])

const newRegister = () => {
  router.push({name:'FormValidateModificacion'})
};

const updateRegister = (hash_id) => {
  router.push({name:'FormValidateModificacion', params: { hash_id: hash_id }})
};

const getRegisters = ( pag = null) => {
  $q.loading.show();
  if( pag !== undefined && pag ){
    pagination.value.page = pag.pagination.page;
    pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
    pagination.value.rowsNumber = pag.pagination.rowsNumber;
  }

  pagination.value.filters = filters.value
  DischargeImpedimentsServices.get_data({
    ...pagination.value,
  }).then(response => {
      $q.loading.hide();
      if (response.data.success) {
        console.log(response.data.Results.ImSolicitud);
        pagination.value = {
            page: response.data.Results.ImSolicitud.current_page,
            rowsPerPage: response.data.Results.ImSolicitud.per_page,
            rowsNumber: response.data.Results.ImSolicitud.total
        }
        registers.value = response.data.Results.ImSolicitud.data;
        dialog.value = false
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
}
const search = () => {
  getRegisters()

  //transaccion
    BinnacleTransaction(22, 1, `Se realizo una busqueda en el módulo de Validación de de modificación`)
}

const getCatsIndex = () => {
  $q.loading.show();
  DischargeImpedimentsServices.get_cats_index({
    id_tipo_impedimento: 1
  }).then(response => {
    console.log(response.data.Results.ImPersonaSolicitud);
      $q.loading.hide();
      if (response.data.success) {
        options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        options.value.office = response.data.Results.cat_oficinas;
        options.value.cat_tipo_solicitud = response.data.Results.cat_tipo_solicitud;

        catalogsOptions.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        catalogsOptions.value.office = response.data.Results.cat_oficinas;
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
}


const newValue = (val,done) => {
  done(val);
};

const yesterday = ref(null)
  const yesterday_input = ref(null)
  const getDayCalendar = (date) => {
  const today = new Date()
  const inputDate = new Date(date)
  const format = (d) =>
    d.getFullYear() +
      '/' +
    String(d.getMonth() + 1).padStart(2, '0') +
      '/' +
    String(d.getDate()).padStart(2, '0')

    return format(inputDate) <= format(today)
  }
  const myLocale = {
    days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
    months:
      'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
                '_'
      ),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    firstDayOfWeek: 1,
    format24h: true,
    pluralDay: 'dias',
  }

  watch(yesterday, (val) => {
    if (val && val.from && val.to) {
      const formatDate = (d) => {
        const date = new Date(d)
          return (
            String(date.getDate()).padStart(2, '0') +
              '-' +
            String(date.getMonth() + 1).padStart(2, '0') +
              '-' +
              date.getFullYear()
            )
        }

        filters.value.from = formatDate(val.from);
        filters.value.to = formatDate(val.to);
        yesterday_input.value = `${formatDate(val.from)} ${formatDate(val.to)}`
      } else {
        yesterday_input.value = ''
      }
  })

const clearFilters = () => {
  filters.value.id_solicitud = null
  filters.value.id_causal_impedimento = null
  filters.value.numero_impedimento = null
  filters.value.nombres = null
  filters.value.primer_apellido = null
  filters.value.segundo_apellido = null
  filters.value.id_oficina = null
  filters.value.heigh = null
  filters.value.date = null
  filters.value.id_office = null
  filters.value.from = null,
  filters.value.to = null,
  filters.value.id_tipo_solicitud = null,
  yesterday.value = null
  yesterday_input.value = null
  filters.value.curp = null
  getRegisters();
      BinnacleTransaction(22, 1, `Se limpiaron los filtros en el módulo de Validación de de modificación`)

}

function filterFnCatCausal(val, update) {
  if (val === '') {
    update(() => { options.value.cat_causal_impedimento = catalogsOptions.value.cat_causal_impedimento })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value.cat_causal_impedimento = catalogsOptions.value.cat_causal_impedimento.filter(v => v.causal_impedimento.toLowerCase().indexOf(needle) > -1)
  })
}

function filterFnCatOffice(val, update) {
  if (val === '') {
    update(() => { options.value.office = catalogsOptions.value.office })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value.office = catalogsOptions.value.office.filter(v => v.nombre_corto.toLowerCase().indexOf(needle) > -1)
  })
}


onMounted(() => {
  getCatsIndex();
  getRegisters();
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
  background: #10312B;
  color: white;
  padding: 5px;
  font-size: 20px;
}

</style>

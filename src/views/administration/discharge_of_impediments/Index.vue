<template>
<header-section :title="storeImpediment.nombre_tipo_impedimento">
  <template v-slot:buttons>
    <div class="row q-gutter-xs">
      <div class="row q-gutter-xs">
        <q-btn
          size="12px"
          color="red"
          icon="fas fa-angle-left"
          @click="$router.push({name:'AdministrationMe  nu'})">
          Atras
        </q-btn>
      </div>
    </div>
  </template>
</header-section>

<!-- TODO: FILTROS AVANZADOS -->
<Modal v-model="dialog"  @keyup.enter="getRegisters()" title="Filtros Avanzados">
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col-md-12 q-pa-md">
          <q-select
            v-if="storeImpediment.id_tipo_impedimento == 1"
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
            clearable/>
            <q-input
            v-if="storeImpediment.id_tipo_impedimento == 2 || storeImpediment.id_tipo_impedimento == 3"
              outlined
              clearable
              style="width: 100%"
              dense
              placeholder="Número impedimento"
              v-model="filters.numero_impedimento">
            </q-input>
      </div>

      <div class="col-md-12 q-pa-md">
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
          :options='options.office'
          option-value='id_oficina'
          option-label='cad_oficina'
          label='Oficina'
          clearable/>
      </div>

      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="Nombre(s)"
          v-model="filters.nombres">
        </q-input>
      </div>
      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="Apellido paterno"
          v-model="filters.primer_apellido">
        </q-input>
      </div>
      <div class="col-md-12 q-pa-md">
        <q-input
          outlined
          clearable
          style="width: 100%"
          dense
          placeholder="Apellido materno"
          v-model="filters.segundo_apellido">
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
    <q-tr :props="props" :class="[props.pageIndex % 2 != 0 ? 'bg-grey-3' : '', '']">
      <q-td>
        {{ props.row.people?.full_name }}
      </q-td>
      <q-td>
        {{ props.row.fecha_registro }}
      </q-td>
      <q-td>
        {{ props.row.cat_office?.cad_oficina }}
      </q-td>
      <q-td>
        {{ props.row.cat_status?.estatus_solicitud }}
      </q-td>

      <q-td style="width: 10%;text-align: center">
        <q-btn-group class="full-width">
          <q-btn
            v-if="storeImpediment.id_tipo_impedimento == 1"
            color="positive"
            size="5px"
            @click="updateRegister(props.row.hash_id)">
            <i class="far fa-edit" style="font-size: 15px;"/>
            <q-tooltip anchor="top middle" self="center middle">
              Editar
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="storeImpediment.id_tipo_impedimento == 1"
            color="red"
            size="5px"
            @click="customDelete(props.row.hash_id)">
            <i class="far fa-trash-alt" style="font-size: 15px"/>
            <q-tooltip anchor="top middle" self="center middle">
              Eliminar
            </q-tooltip>
          </q-btn>
          <q-btn
            color="blue"
            size="5px"
            @click="seeDetails(props.row.hash_id)">
            <i class="far fa-eye" style="font-size: 15px"/>
            <q-tooltip anchor="top middle" self="center middle">
              Ver detalles
            </q-tooltip>
          </q-btn>
        </q-btn-group>
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
//import useNotify from "src/composables/useNotify";
//import DeleteAlert from "components/DeleteAlert.vue";
//import UserServices from "src/services/administration/UserServices";
import {useAuthUserStore} from "stores/AuthUser";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import { useImpedimentStore } from "stores/impediments";

const router = useRouter();
const $q = useQuasar();
const storeImpediment = useImpedimentStore()
const store = useAuthUserStore()
//const {showError, showSuccess} = useNotify()

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
  id_office: null
});
const state_date = ref(null);
const options = ref({
  cat_causal_impedimento:[],
  office:[]
});
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const registers = ref([]);
const columns = ref([
  {
    name: 'full_name',
    align: 'left',
    label: 'Nombre',
    field: row => row.people.full_name
,
  },
  {
    name: 'date',
    align: 'left',
    label: 'Fecha de solicitud',
    field: row => row.date,
  },
  {
    name: 'office',
    align: 'left',
    label: 'Oficina',
    field: row => row.cat_office.cad_oficina,
  },
  {
    name: 'status',
    align: 'left',
    label: 'Estatus',
    field: row => row.cat_status.estatus_solicitud,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    headerStyle: 'width: 300px'
  }
])

const newRegister = () => {
  storeImpediment.deleteIndex2();
  storeImpediment.setTitle('Nuevo');
  router.push({name:'NewHigh'})
};

const updateRegister = (hash_id) => {
  storeImpediment.deleteIndex2();
  storeImpediment.setTitle('Editar');
  storeImpediment.setHashId(hash_id);
  router.push({name:'updateMenu'})
};

const seeDetails = (hash_id) => {
  storeImpediment.deleteIndex2();
  storeImpediment.setTitle('Ver detalles');
  storeImpediment.setHashId(hash_id);
  router.push({name:'seeDetailsMenu'})
};

const getRegisters = ( pag = null) => {
  $q.loading.show();
  if( pag !== undefined && pag ){
    pagination.value.page = pag.pagination.page;
    pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
    pagination.value.rowsNumber = pag.pagination.rowsNumber;
  }
  DischargeImpedimentsServices.get_data({
    id_tipo_impedimento: storeImpediment.id_tipo_impedimento,
    ...pagination.value,
    filters: filters.value
  }).then(response => {
      $q.loading.hide();
      if (response.data.success) {
        console.log(response.data.Results.ImPersonaSolicitud);
        pagination.value = {
            page: response.data.Results.ImPersonaSolicitud.current_page,
            rowsPerPage: response.data.Results.ImPersonaSolicitud.per_page,
            rowsNumber: response.data.Results.ImPersonaSolicitud.total
        }
        registers.value = response.data.Results.ImPersonaSolicitud.data;
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
}

const getCatsIndex = () => {
  $q.loading.show();
  DischargeImpedimentsServices.get_cats_index({
    id_tipo_impedimento: storeImpediment.id_tipo_impedimento
  }).then(response => {
    console.log(response.data.Results.ImPersonaSolicitud);
      $q.loading.hide();
      if (response.data.success) {
        options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        options.value.office = response.data.Results.cat_oficinas;
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
}


const newValue = (val,done) => {
  done(val);
};
watch(state_date, async (newVal) => {
  if (newVal) {
    if (typeof newVal === 'object') {
      filters.value.date = `${newVal.from} ${newVal.to}`;
    } else {
      filters.value.date = `${newVal} ${newVal}`;
    }
  } else {
    filters.value.date = null;
  }
});


onMounted(() => {
  console.log("tipo de impedimento: ",storeImpediment.id_tipo_impedimento);
  console.log("nombre de impedimento: ",storeImpediment.nombre_tipo_impedimento);
  console.log("-------: ",store.dataUser);
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

<template>
<header-section title="Consulta de impedimentos" :icon-image="iconModule" />

<Modal v-model="dialog"  @keyup.enter="getRegisters()" title="Filtros Avanzados">
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col-md-12 q-pa-md">
            <q-input
            type="number"
              outlined
              clearable
              style="width: 100%"
              dense
              placeholder="Número impedimento"
              v-model="filters.numero_impedimento"
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
            :clear-value="null"
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
          v-model='filters.id_oficina'
          :options="[3, 4, 5].includes(store.user.perfil.id_perfil) ? options.office : [{id_oficina: store.user.oficina.id_oficina, cad_oficina: store.user.oficina.cad_oficina}]"
          option-value='id_oficina'
          option-label='cad_oficina'
          label='Oficina'
          clearable
          multiple
          :clear-value="null"
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


	<q-dialog v-model="deleteDialog" persistent>
		<q-card style="width: 500px; max-width: 90vw;">
			<!-- Título -->
			<q-card-section>
			<div class="text-h6 text-primary">Eliminar</div>
			</q-card-section>

			<!-- Mensaje -->
			<q-card-section>
			<div class="text-subtitle1">
				<q-icon name="help_outline" color="primary" class="q-mr-sm" />
				<span >¿Estás completamente seguro de Eliminar el impedimento?</span>
			</div>
			</q-card-section>

			<!-- Botones -->
			<q-card-actions align="right">
			<q-btn flat label="Cerrar" color="negative" @click="deleteDialog = false" />
			<q-btn :label="label_btn" @click="deleteImpediement(deleteId)" color="negative" icon="delete" />
			</q-card-actions>
		</q-card>
	</q-dialog>

  <div class="q-pa-md">
    <div class="row justify-end">
      <div class="col-12 col-md-12 col-sm-12 col-xs-12">
        <div class="row justify-end q-gutter-xs">
          <q-btn-group>
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
        {{ props.row.id_impedimento }}
      </q-td>
      <q-td>
        {{ props.row?.people?.full_name }}
      </q-td>
      <q-td>
        {{ props.row?.people?.curp }}
      </q-td>
      <q-td>
        {{ props.row.cat_office?.cad_oficina }}
      </q-td>
      <q-td style="min-width: 200px; width: 200px; word-break: break-word; white-space: normal;">
        <div style="white-space: normal;">
          {{ truncateText(props.row.cat_causal?.causal_impedimento, 50) }}
        </div>
      </q-td>
      <q-td>
        {{ props.row.cat_status?.estatus_solicitud }}
      </q-td>

      <q-td>
        <div class="flex justify-center">
          <q-btn-group>
            <q-btn
            v-if="store.hasPermission('impediment_query_correction')"
            color="positive"
              size="sm"
              @click="seeDetails(props.row.hash_id)">
              <i class="far fa-edit" style="font-size: 15px"/>
              <q-tooltip anchor="top middle" self="center middle">
				Editar
              </q-tooltip>
            </q-btn>
            <q-btn
            v-if="store.hasPermission('impediment_query_reactive') || store.hasPermission('impediment_query_modify')"
            color="primary"
              size="sm"
              @click="seeDetails(props.row.hash_id, {modificarImpedimento: true})">
              <i class="far fa-edit" style="font-size: 15px"/>
              <q-tooltip anchor="top middle" self="center middle">
				Modificar Impedimento
              </q-tooltip>
            </q-btn>
            <q-btn
              color="positive"
              size="sm"
              @click="printImpediment(props.row.hash_id)">
              <i class="fa-solid fa-print" style="font-size: 15px"/>
              <q-tooltip anchor="top middle" self="center middle">
                Imprimir boleta
              </q-tooltip>
            </q-btn>
            <q-btn
            v-if="store.hasPermission('impediment_query_delete')"
              color="negative"
              size="sm"
              @click="toggleDeleteDialog(props.row.hash_id)">
              <i class="fa-solid fa-trash-alt" style="font-size: 15px"/>
              <q-tooltip anchor="top middle" self="center middle">
                Eliminar
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
//import useNotify from "src/composables/useNotify";
//import DeleteAlert from "components/DeleteAlert.vue";
//import UserServices from "src/services/administration/UserServices";
import {useAuthUserStore} from "stores/AuthUser";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';

import imageRoute from 'src/assets/icons/Home/bandeja_autorizacion_alta_impedimentos.png';
import useImpedimentForm from 'src/composables/useImpedimentForm';
import { BinnacleTransaction } from 'src/utils/binnacle';
const iconModule = ref(imageRoute);

const router = useRouter();
const $q = useQuasar();
const store = useAuthUserStore()
//const {showError, showSuccess} = useNotify()
const {truncateText} = useImpedimentForm()
const dialog = ref(false);
const deleteDialog = ref(false);
const deleteId = ref(null);
const filters = ref({
  id_causal_impedimento: null,
  numero_impedimento: null,
  nombres:null,
  primer_apellido: null,
  segundo_apellido: null,
  id_oficina:null,
  curp: null,
});
const options = ref({
  cat_causal_impedimento:[],
  office:[],
});
const catalogsOptions = ref({
  cat_causal_impedimento: [],
  office: [],
})
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const registers = ref([]);
const columns = ref([
  {
    name: 'numero_impedimento',
    align: 'left',
    label: 'Número impedimento',
    field: row => row.id_impedimento,
    headerStyle: 'width: 90px'
  },
  {
    name: 'full_name',
    align: 'left',
    label: 'Nombre',
    field: row => row?.people?.full_name,
    headerStyle: 'width: 90px'
  },
  {
    name: 'curp',
    align: 'left',
    label: 'Curp',
    field: row => row?.people?.curp,
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
    field: row => row.cat_causal?.causal_impedimento,
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

const seeDetails = (hash_id, opts) => {
  const modificarImpedimento = opts?.modificarImpedimento ?? false
  console.log('Modificar Impedimento', modificarImpedimento)
  if(opts?.modificarImpedimento) {
    console.log('si paso')
    router.push({name:'ConsultaImpedimentosForm', params: { hash_id: hash_id}, query: { modificarImpedimento: true } })
  } else {
    router.push({name:'ConsultaImpedimentosForm', params: { hash_id: hash_id}})
  }
};


const sanitizeFilters = (f) => {
  const norm = { ...f }
  const toNull = (v) => {
    if (Array.isArray(v)) return v.length ? v : null
    if (typeof v === 'string') return v.trim() ? v.trim() : null
    if (v === undefined) return null
    return v
  }
  Object.keys(norm).forEach(k => { norm[k] = toNull(norm[k]) })
  return norm
}


const getRegisters = ( pag = null) => {
  $q.loading.show();
  if( pag !== undefined && pag ){
    pagination.value.page = pag.pagination.page;
    pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
  }


  const payload = {
    page: pagination.value.page,
    rowsPerPage: pagination.value.rowsPerPage,
    filters: sanitizeFilters(filters.value), // NUEVO
  }

  DischargeImpedimentsServices.get_data_consult_impediment(payload).then(response => {

      $q.loading.hide();
      if (response.data.success) {
        const p = response.data.Results.ImImpedimento
        pagination.value = {
          page: p.current_page,
          rowsPerPage: p.per_page,
          rowsNumber: p.total
        }
        registers.value = p.data
        dialog.value = false
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
  .finally(() => {
      $q.loading.hide()
    })
}
const search = () => {
  getRegisters()

  //transaccion
    BinnacleTransaction(13, 1, `Se realizo una busqueda en el módulo de Consulta de impedimentos`)
}

const getCatsIndex = () => {
  $q.loading.show();
  DischargeImpedimentsServices.get_cats_index({
    id_tipo_impedimento: 1
  }).then(response => {
    //console.log(response.data.Results.ImPersonaSolicitud);
      $q.loading.hide();
      if (response.data.success) {
        options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        options.value.office = response.data.Results.cat_oficinas;

        catalogsOptions.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        catalogsOptions.value.office = response.data.Results.cat_oficinas;
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
}

const yesterday = ref(null)
  const yesterday_input = ref(null)
  // const getDayCalendar = (date) => {
  // const today = new Date()
  // const inputDate = new Date(date)
  // const format = (d) =>
  //   d.getFullYear() +
  //     '/' +
  //   String(d.getMonth() + 1).padStart(2, '0') +
  //     '/' +
  //   String(d.getDate()).padStart(2, '0')

  //   return format(inputDate) <= format(today)
  // }
  // const myLocale = {
  //   days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  //   daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  //   months:
  //     'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
  //               '_'
  //     ),
  //   monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  //   firstDayOfWeek: 1,
  //   format24h: true,
  //   pluralDay: 'dias',
  // }

  const printImpediment = (id) => {
 	$q.loading.show();
	DischargeImpedimentsServices.print_impediment({
		id_impedimento :id,
    is_hash: true,
    moduleId: 13,
	},{ responseType: 'blob' }).then(response => {
		$q.loading.hide();

		// Crear URL del blob y descargar
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `impedimento_boleta.pdf`;
      link.click();

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Éxito, se descargó el impedimento correctamente.'
      });
	}).catch(e => {
    $q.loading.hide();
		console.error("error: ",e);
	})
}
  const deleteImpediement = (id) => {
    console.log(id);
 	$q.loading.show();
	DischargeImpedimentsServices.delete_impediment({
		id_impedimento :id,
    is_hash: true,
    moduleId: 13,
	}).then((response) => {
    $q.loading.hide();
    if(response.data.success) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Éxito, se ha eliminado correctamente el impedimento.'
      });
      deleteDialog.value = false;
      getRegisters()

    }


	}).catch(e => {
    $q.loading.hide();
		console.error("error: ",e);
	})
}

const toggleDeleteDialog = (id) => {
  console.log(store.user.permissions)
  deleteId.value = id
  deleteDialog.value = !deleteDialog.value
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
  yesterday.value = null
  yesterday_input.value = null
  filters.value.curp = null
  getRegisters();
      BinnacleTransaction(13, 1, `Se limpiaron los filtros el módulo de Consulta de impedimentos`)

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

const newValue = (val,done) => {
  done(val);
};


onMounted(() => {
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

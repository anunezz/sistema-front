<template>
	<header-section title="Plantillas" :icon-image="iconModule"  url-redirect="InboxVerification"/>

	<q-dialog v-model="deleteDialog" persistent>
		<q-card style="width: 500px; max-width: 90vw;">
		<!-- Título -->
		<q-card-section>
			<div class="text-h6 text-primary">Eliminar Plantilla</div>
		</q-card-section>

		<!-- Mensaje -->
		<q-card-section>
			<div class="text-subtitle1">
			<q-icon name="help_outline" color="primary" class="q-mr-sm" />
			<span>¿Estás completamente seguro de eliminar esta plantilla?</span>
			</div>
		</q-card-section>

		<!-- Botones -->
		<q-card-actions align="right">
			<q-btn flat label="Cerrar" color="negative" @click="deleteDialog = false" />
			<q-btn label="Eliminar" @click="deleteItem" color="positive" icon="save" />
		</q-card-actions>
		</q-card>
	</q-dialog>
	<q-dialog v-model="showModal">
	<q-card>
		<q-card-section>
		Editar: {{ selectedItem?.name || '...' }}
		</q-card-section>
	</q-card>
	</q-dialog>
		<Modal v-model="dialog"  @keyup.enter="getRegisters()" title="Filtros Avanzados">
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

			<!--<div class="col-md-12 q-pa-md">
				<q-input outlined dense label="Fecha inicial y fecha final" v-model="filters.date" mask="##-##-#### ##-##-####">
				<template v-slot:append>
					<q-icar name="event" class="cursor-pointer">
					<q-popup-proxy cover transition-show="scale" transition-hide="scale">
						<q-date v-model="state_date" mask="DD-MM-YYYY"  :locale="myLocale" minimal range>
						<div class="row items-center justify-end">
							<q-btn v-close-popup label="Cerrar" color="primary" flat />
						</div>
						</q-date>
					</q-popup-proxy>
					</q-icar>
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
				:options='options.office'
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
				@click="clearFilters()"
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
					outline
					size="12px"
					color="positive"
					icon="edit"
					label="Agregar plantilla"
					@click="newRegister" >
					<q-tooltip anchor="top middle" self="center middle">
					Editar
				</q-tooltip>
					</q-btn>
					<!-- <q-btn
					outline
					size="12px"
					color="withe"
					icon="fa-solid fa-magnifying-glass"
					label="Filtros avanzados"
					@click="dialog = true" /> -->
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
			<q-tr :props="props" :class="[ props.row.urgencia ? 'bg-red-3 text-black' : 'bg-white']">
			<q-td>
				<div  style="max-width: 200px; word-break: break-word; white-space: normal;" v-html="props.row.plantilla"></div>
			</q-td>
			<q-td style="max-width: 200px; word-break: break-word; white-space: normal;">
				<div  style="max-width: 200px; word-break: break-word; white-space: normal;">
				{{ props.row.cat_subcausal?.cat_causal_impedimento?.causal_impedimento }}
				</div>
			</q-td>
			<q-td style="max-width: 200px; word-break: break-word; white-space: normal;">
				<div style="white-space: normal;">
				{{ props.row.cat_subcausal?.subcausal_impedimento }}
				</div>
			</q-td>
			<q-td>{{ date.formatDate(props.row.created_at, 'YYYY-MM-DD HH:mm') }}</q-td>
			<q-td>
			<div class="flex justify-center">
		<q-btn-group>
			<!-- Botón Editar -->
			<q-btn
				color="blue"
				size="5px"
				@click="editItem(props.row.id_plantilla)">
				<i class="fas fa-edit" style="font-size: 15px" />
				<q-tooltip anchor="top middle" self="center middle">
				Editar
				</q-tooltip>
			</q-btn>

			<!-- Botón Eliminar -->
			<q-btn
				color="red"
				size="5px"
				@click="deleteItemConfirm(props.row.id_plantilla)">
				<i class="fas fa-trash" style="font-size: 15px" />
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
	import {date, useQuasar} from "quasar";
	import {useRouter} from 'vue-router';
	// import {useAuthUserStore} from "stores/AuthUser";
	// import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';

	import imageRoute from 'src/assets/icons/Home/bandeja_validacion_altas.png';
	// import { BinnacleTransaction } from 'src/utils/binnacle';
import PlantillaService from 'src/services/administration/PlantillaService';
	const iconModule = ref(imageRoute);

	const router = useRouter();
	const $q = useQuasar();
	// const store = useAuthUserStore()
	const deleteDialog  = ref(false)
	const idPlantillaDelete = ref(null)
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
	const selectedItem = ref(null)
	const showModal = ref(false)
	const columns = ref([
	{
		name: 'plantilla',
		align: 'left',
		label: 'Respuesta a',
		field: row => row.plantilla,
	},
	{
		name: 'causal_impedimento',
		align: 'left',
		label: 'Causal impedimento',
		field: row => row.cat_subcausal.cat_causal_impedimento.causal_impedimento,
	  },
	  {
		name: 'subcausal_impedimento',
		align: 'left',
		label: 'Subcausal impedimento',
		field: row => row.cat_subcausal.subcausal_impedimento,
	  },
	  {
		name: 'created_at',
		align: 'left',
		label: 'Fecha de creación',
		field: row => row.created_at,
	  },
	  {
		name: 'actions',
		align: 'left',
		label: 'Acciones',
		field: row => row.created_at,
	  },
	])

	const getRegisters = ( pag = null) => {
	  $q.loading.show();
	  if( pag !== undefined && pag ){
		pagination.value.page = pag.pagination.page;
		pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
		pagination.value.rowsNumber = pag.pagination.rowsNumber;
	  }
	  pagination.value.filters = filters.value
	  PlantillaService.index({
		...pagination.value,
	  }).then(response => {
		  $q.loading.hide();
		  if (response.data.success) {
			console.log(response.data.Results.ImSolicitud);
			pagination.value = {
            page: response.data.Results.Plantillas.current_page,
            rowsPerPage: response.data.Results.Plantillas.per_page,
            rowsNumber: response.data.Results.Plantillas.total
        }
			registers.value = response.data.Results.Plantillas.data;
		  }
	  }).catch(e => {
		$q.loading.hide();
		console.error("error: ",e);
	  })
	}

	const newRegister = () => {
  		router.push({name:'NewPlantillas'})
	};

	const editItem = (id) => {
		console.log('id =>', id )
		router.push({ name: 'EditPlantillas', params: { id } })
	}
	const deleteItemConfirm = (id) => {
		console.log(id)
		idPlantillaDelete.value = id
		deleteDialog.value = true

	}
	const deleteItem = () => {
	const data = {
    id: idPlantillaDelete.value
	}
	console.log('dataaaaa delete', data)
  PlantillaService.delete(data).then((response) => {
    if(response.data.success) {
      $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Éxito, la plantilla ha sido eliminada correctamente.'
      });
     getRegisters()
	 deleteDialog.value = false
    }
  }).catch(error => {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar la plantilla',
    })
  })
}

	// const getCatsIndex = () => {
	//   $q.loading.show();
	//   DischargeImpedimentsServices.get_cats_index({
	// 	id_tipo_impedimento: 1
	//   }).then(response => {
	// 	console.log(response.data.Results.ImPersonaSolicitud);
	// 	  $q.loading.hide();
	// 	  if (response.data.success) {
	// 		options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
	// 		options.value.office = response.data.Results.cat_oficinas;

	// 		catalogsOptions.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
	// 		catalogsOptions.value.office = response.data.Results.cat_oficinas;
	// 	  }
	//   }).catch(e => {
	// 	$q.loading.hide();
	// 	console.error("error: ",e);
	//   })
	// }

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
	  getRegisters();
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

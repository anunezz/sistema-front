<template>
    <q-dialog v-model="dialog_mass_desassign" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
        <div class="text-h6 text-primary">Desasignar solicitudes</div>
        </q-card-section>

        <q-card-section>
        <div class="text-subtitle1">
            <q-icon name="help_outline" color="primary" class="q-mr-sm" />
            <span>¿Estás seguro de desasignar <b>{{ selectedItemsForMassDesassign.length }}</b> solicitudes?</span>
        </div>
        </q-card-section>

        <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" @click="dialog_mass_desassign = false" />
        <q-btn label="Confirmar" color="negative" icon="delete_forever" @click="desassignMass()" />
        </q-card-actions>
    </q-card>
</q-dialog>

    <q-dialog v-model="dialog_desassign" persistent>
	<q-card style="width: 500px; max-width: 90vw;">
	<!-- Título -->
	<q-card-section>
		<div class="text-h6 text-primary">Desasignar</div>
	</q-card-section>

	<!-- Mensaje -->
	<q-card-section>
		<div class="text-subtitle1">
		<q-icon name="help_outline" color="primary" class="q-mr-sm" />
		<span>Estás completamente seguro de desasignar la solicitud?</span>
		</div>
	</q-card-section>

	<!-- Botones -->
	<q-card-actions align="right">
  <q-btn
    label="Desasignar solicitud"
    @click="desassign"
    color="negative"
    icon="trash"
  />
  <q-btn
    flat
    label="Cerrar"
    color="negative"
    @click="dialog_desassign = false"
  />
</q-card-actions>

	</q-card>
</q-dialog>
<Modal v-model="dialog"  @keyup.enter="() => {
    getregisters()
}"
title="Filtros Avanzados">
    <div class="q-pa-md">
        <div class="row q-col-gutter-xs">
            <div class="col-md-12 q-pa-md">
            <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="ID Solicitud"
            v-model="filters.id_solicitud"
            v-max="100">
            </q-input>
        </div>
        <div div class="col-md-12 q-pa-md">
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
            <q-select
            v-model="filters.id_usuario_assigned_requests"
            :options="options.cat_usuarios"
            option-value="id"
            option-label="username"
            label="Usuario"
            dense
            outlined
            use-chips
            use-input
            emit-value
            map-options
            clearable
            @new-value="newValue"
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
            @click="limpiar()"
            />
        <q-btn
            outline
            size="12px"
            icon="fas fa-filter"
            color="primary"
            @click="() => {
            search()
            }"
            label="Buscar"
            />
        </div>
    </div>
</Modal>
    <div>
            <div class="col-12 col-md-12 col-sm-12 col-xs-12">
            <div class="row justify-end q-gutter-xs">
            <q-btn-group>
            <q-btn
            label="Desasignar todos"
            color="negative"
            icon="fa-solid fa-ban"
            outline
            size="12px"
            :disable="registers.length === 0"
            @click="openMassDesassignDialog"

            />

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
        <br/>
        </div>
        <q-table
        :rows="registers"
        :columns="columns"
        separator="cell"
        no-data-label="No hay datos"
        dense
        rows-per-page-label="Registros por página"
        :pagination-label="(first, last, total) => `${first}-${last} de ${total}`"
        flat
        bordered
        v-model:pagination="pagination"
        @request="getRegisters"
        :rows-per-page-options="[5, 10, 20, 50, 100]"

        row-key="name"
        >
        <template v-slot:header="props">
            <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <b>{{ col.label }}</b>
            </q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props" :class="[ props.row.id_prioridad == 1 ? 'bg-red-3 text-black' : 'bg-white']">
                <q-td>
                <q-btn
                color="red-8"
                size="5px"
                @click="toggleDialogDesassign(props.row.hash_id)"
                >
                <i class="fa-solid fa-ban" style="font-size: 15px" />
                <q-tooltip anchor="top middle" self="center middle">Desasignar</q-tooltip>
                </q-btn>
                </q-td>
                <q-td>{{ props.row.id_solicitud }}</q-td>
                <q-td>{{ props.row.full_name }}</q-td>
            <q-td>{{ props.row.cat_type?.tipo_solicitud }}</q-td>
            <q-td>{{ props.row.fecha_registro }}</q-td>
            <q-td>{{ props.row.cat_office?.cad_oficina }}</q-td>
            <q-td style="min-width: 200px; width: 200px;">{{ truncateText(props.row.cat_causal_impedimento?.causal_impedimento,50) }}</q-td>
            <q-td>{{ props.row.cat_status?.estatus_solicitud }}</q-td>
            <q-td>{{ props.row.asignacion.usuario.username }}</q-td>
            <q-td>
                    <div class="flex justify-center">
                    <q-btn-group>
                        <q-btn
                        color="blue"
                        size="5px"
                        @click="seeDetails(props.row.hash_id)"
                        >
                        <i class="far fa-eye" style="font-size: 15px" />
                        <q-tooltip anchor="top middle" self="center middle">
                            Ver detalles
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
    import { useQuasar } from 'quasar';
    import {onMounted, ref, watch } from 'vue';
    import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
    import { useAuthUserStore } from 'src/stores/AuthUser';
    import Modal from 'src/components/Modal.vue';
import useImpedimentForm from 'src/composables/useImpedimentForm';
import { useRouter } from 'vue-router';
import { BinnacleTransaction } from 'src/utils/binnacle';


    const store = useAuthUserStore()

    const $q = useQuasar();
    const router = useRouter();
    const {truncateText} = useImpedimentForm()
    const dialog = ref(false);
    const dialog_desassign = ref(false);
    const selectedItemId = ref(null)
    const selectedItemsForMassDesassign = ref([]);
    const dialog_mass_desassign = ref(false);
    const options = ref({
    cat_causal_impedimento:[],
    office:[],
    cat_usuarios: [],
    });
    const catalogsOptions = ref({
    cat_causal_impedimento: [],
    office: [],
    })

    const yesterday = ref(null)
    const yesterday_input = ref(null)

        const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
    })
    const registers = ref([]);

    const columns = ref([
    {
        name: 'desasignar',
        align: 'left',
        label: 'Desasignar',
    },
    {
        name: 'id_solicitud',
        align: 'left',
        label: 'ID de solicitud',
        field: row => row.id_solicitud,
    },
    {
        name: 'full_name',
        align: 'left',
        label: 'Nombre',
        field: row => row.full_name,
    },
    {
        name: 'tipo_solicitud',
        align: 'left',
        label: 'Tipo de solicitud',
        field: row => row.cat_type?.typo_solicitud,
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
        name: 'cat_causal_impedimento',
        align: 'left',
        label: 'Causal',
        field: row => row.cat_causal_impedimento?.causal_impedimento,
        style: 'width: 350px'
    },
    {
        name: 'status',
        align: 'left',
        label: 'Estatus',
        field: row => row.cat_status.estatus_solicitud,
    },
    {
        name: 'user_assigned',
        align: 'left',
        label: 'Usuario asignado',
        field: row => row.cat_status.estatus_solicitud,
    },
    {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        headerStyle: 'width: 300px'
    }
    ])

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
    curp: null,
    id_usuario: null,
    id_usuario_assigned_requests: null,
    yesterday: null,
    yesterday_input: null,
    id_solicitud: null,
    });
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
    // const seeDetails = (hash_id) => {
    // router.push({name:'FormValidateHigh', params: { hash_id: hash_id }})
    // };
    update(() => {
        const needle = val.toLowerCase()
        options.value.office = catalogsOptions.value.office.filter(v => v.nombre_corto.toLowerCase().indexOf(needle) > -1)
    })
    }

    async function getregisters() {
    if (getRegisters) {
        await getRegisters(); // espera a que termine la llamada del padre
        dialog.value = false;       // cierra el modal solo cuando termina
    }
    }

    async function limpiar() {
    if (clearFilters) {
        await clearFilters(); // en caso de que sea async
        yesterday.value = null
        yesterday_input.value = null
        await getRegisters()
        dialog.value = false;       // cierra el modal al terminar
    }
    }
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
    filters.value.id_usuario = null
    filters.value.from = null,
    filters.value.to = null,
    filters.value.yesterday = null
    filters.value.yesterday_input = null
    filters.value.curp = null
    filters.value.id_usuario_assigned_requests = null
    filters.value.id_solicitud = null
        BinnacleTransaction(23, 1, `Se limpiaron los filtros en el módulo de Asignación de trabajo`)

}

const getRegisters = ( pag = null) => {
    $q.loading.show();
    if( pag !== undefined && pag ){
        pagination.value.page = pag.pagination.page;
        pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
        pagination.value.rowsNumber = pag.pagination.rowsNumber;
    }
    pagination.value.filters = filters.value
    DischargeImpedimentsServices.get_data_inbox_work_assignation({
    ...pagination.value,
    'only_assigned': true
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
        }
    }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
    })
}

const search = () => {
  getRegisters()

  //transaccion
    BinnacleTransaction(23, 1, `Se realizo una busqueda en el módulo de Asignación de trabajo`)
}
function openMassDesassignDialog() {
    console.log('ANTES:', selectedItemsForMassDesassign.value);
    selectedItemsForMassDesassign.value = registers.value.map(r => r.id_solicitud);
    dialog_mass_desassign.value = true;
}

const desassign = () => {
    $q.loading.show();
    DischargeImpedimentsServices.desassing_request({
        selectedItemId: selectedItemId.value,
    }).then(response => {
        $q.loading.hide();
        if (response.data.success) {
            $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Éxito, se ha desasignado la solicitud correctamente.'
        });
        dialog_desassign.value = false
        getregisters()
        }
    }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
    })
};

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
            console.log("response.data.Results.usuarios: ",response.data.Results.usuarios  );

            options.value.cat_usuarios = response.data.Results.usuarios.filter(elemento => elemento.usuario_perfil.id_perfil == 3 && !elemento.bol_eliminado);


            catalogsOptions.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
            catalogsOptions.value.office = response.data.Results.cat_oficinas;
        }
    }).catch(e => {
        $q.loading.hide();
        console.error("error: ",e);
    })
}
const toggleDialogDesassign = (hashId) => {
    selectedItemId.value = hashId
    dialog_desassign.value = true
}
const desassignMass = () => {
    $q.loading.show();
    DischargeImpedimentsServices.desassing_request({
        selectedItemIds: selectedItemsForMassDesassign.value,
    }).then(response => {
        $q.loading.hide();
        if (response.data.success) {
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Se desasignaron las solicitudes correctamente.'
        });
        dialog_mass_desassign.value = false;
        getregisters();
        }
    }).catch(e => {
        $q.loading.hide();
        console.error('Error:', e);
        $q.notify({
        type: 'negative',
        message: 'Error al desasignar las solicitudes.'
        });
    });
};


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

        const seeDetails = (hash_id) => {
        router.push({name:'FormWorkAssignation', params: { hash_id: hash_id }})
        };

      watch(
  () => yesterday.value,
  (val) => {
    console.log('Nuevo valor de yesterday:', val)

        const formatDate = (d) => {
      if (!d) return ''
      const [year, month, day] = d.split('/')
      return `${day}-${month}-${year}`
    }

    if (typeof val === 'string') {
      // un solo día seleccionado
      const formatted = formatDate(val)
      filters.value.from = formatted
      filters.value.to = formatted
      yesterday_input.value = `${formatted} ${formatted}`
    } else if (val && val.from && val.to) {
      //rango de fechas
      const fromFormatted = formatDate(val.from)
      const toFormatted = formatDate(val.to)
      filters.value.from = fromFormatted
      filters.value.to = toFormatted
      yesterday_input.value = `${fromFormatted} ${toFormatted}`
    } else {
      yesterday_input.value = ''
      delete filters.value.from
      delete filters.value.to
    }

    console.log('filters:', filters.value)
  },
  { deep: true }
)
onMounted(() => {
    console.log("-------: ",store.dataUser);
    getCatsIndex()
    getregisters()
})
</script>
<style lang="">

</style>

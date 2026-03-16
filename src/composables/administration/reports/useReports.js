import { ref, watch, onMounted } from "vue";
import { debounce } from 'lodash'
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";
import ReportsServices from "src/services/administration/reports/ReportsServices";
import CatOficinasServices from "src/services/administration/catalogs/CatOficinasServices";
import CatEstatusSolicitudServices from "src/services/administration/catalogs/CatEstatusSolicitudServices";
import CatTipoSolicitudServices from "src/services/administration/catalogs/CatTipoSolicitudServices";

const useReports = () => {
    const $q = useQuasar()
    const { showError, showWarning } = useNotify()


    const dialog = ref(false)
    const offices = ref([])
    const status = ref([])
    const requestType = ref([])
    const filters = ref({
        type_report: null,
        from: null,
        to: null,
        id_tipo_solicitud: null,
        id_estatus_solicitud: null,
        id_oficina: null,
    });

    const catalogsOptions = ref({
        offices: [],
        status: [],
        requestType: [],
    })

    const options = ref([
        { id: 1, name: 'Solicitudes' },
        { id: 2, name: 'Impedimentos' },
    ])

    const title = ref('')
    const showModal = ref(false)
    const search = ref('')
    const registers = ref([])
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    })


    const columns1 = ref([
        {
            name: 'id_solicitud',
            label: 'ID',
            align: 'center',
            field: row => row.id_solicitud,
            sortable: true
        },
        {
            name: 'full_name',
            label: 'Nombre',
            align: 'left',
            field: row => row.full_name,
            sortable: true
        },
        {
            name: 'cat_office.nombre_corto',
            label: 'Oficina',
            align: 'left',
            field: row => row.cat_office.nombre_corto,
            sortable: true
        },
        {
            name: 'created_at',
            label: 'Fecha Alta',
            align: 'left',
            field: row => row.created_at,
            sortable: true
        },
        {
            name: 'observaciones',
            label: 'Observaciones',
            align: 'left',
            field: row => row.observaciones,
            sortable: true
        },
        {
            name: 'cat_causal_impedimento.causal_impedimento',
            label: 'Motivo',
            align: 'left',
            field: row => row.cat_causal_impedimento.causal_impedimento,
            sortable: true
        },
        {
            name: 'cat_status.estatus_solicitud',
            label: 'Estatus',
            align: 'left',
            field: row => row.cat_status.estatus_solicitud,
            sortable: true
        },
    ])

    const columns2 = ref([
        {
            name: 'numero_impedimento',
            label: 'Número de Impedimento',
            align: 'center',
            field: row => row.numero_impedimento,
            sortable: true
        },
        /*{
            name: 'requests.cat_type.tipo_solicitud',
            label: 'Tipo Solicitud',
            align: 'center',
            field: row => row.requests[0]?.cat_type.tipo_solicitud,
            sortable: true
        },
        {
            name: 'requests.id_solicitud',
            label: 'Id Solicitud',
            align: 'center',
            field: row => row.requests[0]?.id_solicitud,
            sortable: true
        },
        {
            name: 'requests.full_name',
            label: 'Nombre',
            align: 'left',
            field: row => row.requests[0]?.full_name,
            sortable: true
        },*/
        {
            name: 'requests.cat_office.nombre_corto',
            label: 'Oficina',
            align: 'left',
            field: row => row.cat_office?.nombre_corto,
            sortable: true
        },
        {
            name: 'created_at',
            label: 'Fecha Alta',
            align: 'left',
            field: row => row.created_at,
            sortable: true
        },
        /*{
            name: 'requests.observaciones',
            label: 'Observaciones',
            align: 'left',
            field: row => row.requests[0].observaciones,
            sortable: true
        },*/
        {
            name: 'requests.cat_causal_impedimento.causal_impedimento',
            label: 'Motivo',
            align: 'left',
            field: row => row.cat_causal_impedimento.causal_impedimento,
            sortable: true
        },
        {
            name: 'requests.cat_status.estatus_solicitud',
            label: 'Estatus',
            align: 'left',
            field: row => row.cat_status.estatus_solicitud,
            sortable: true
        },
        {
            name: 'actions',
            align: 'center',
            label: 'Ver Solicitudes',
        }
    ])

    const requestsColumns = [
        {
            name: 'id_solicitud',
            label: 'Solicitud',
            field: 'id_solicitud',
            align: 'left',
            headerStyle: 'font-weight: bold; color: #333; background-color: #ebddda;'
        },
        {
            name: 'full_name',
            label: 'Nombre Completo',
            field: row => row.full_name,
            align: 'left',
            headerStyle: 'font-weight: bold; color: #333; background-color: #ebddda;'
        },
        {
            name: 'tipo_solicitud',
            label: 'Tipo de Solicitud',
            field: row => row.cat_type?.tipo_solicitud,
            align: 'left',
            headerStyle: 'font-weight: bold; color: #333; background-color: #ebddda;'
        },
        {
            name: 'fecha_registro',
            label: 'Fecha Registro',
            field: 'fecha_registro',
            align: 'left',
            headerStyle: 'font-weight: bold; color: #333; background-color: #ebddda;'
        },
        {
            name: 'estatus_solicitud',
            label: 'Estatus',
            field: row => row.cat_status?.estatus_solicitud,
            align: 'left',
            headerStyle: 'font-weight: bold; color: #333; background-color: #ebddda;'
        },
        {
            name: 'observaciones',
            label: 'Observaciones',
            field: 'observaciones',
            align: 'left',
            headerStyle: 'font-weight: bold; color: #333; background-color: #ebddda;'
        },
    ]
    const typeReportRef = ref(null)
    const isRequired = val => !!val || 'Campo obligatorio'
    const getRegisters = async (props) => {
        if (!filters.value.type_report) {
            showError('Error', 'Por favor selecciona un tipo de reporte')
            return
        }
        if (props !== undefined) {
            pagination.value = props.pagination
        }

        const data = {
            params: {
                page: pagination.value.page,
                rowsPerPage: pagination.value.rowsPerPage,
                search: search.value,
                filters: filters.value
            }
        };

        $q.loading.show()

        ReportsServices.index(data).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                registers.value = response.data.data.data
                pagination.value = {
                    page: response.data.data.current_page,
                    rowsPerPage: response.data.data.per_page,
                    rowsNumber: response.data.data.total
                }
            }
        }).catch((error) => {
            $q.loading.hide()
            if (error.response?.data?.errors?.type_report) {
                typeReportRef.value.validate(false)
            }
            showError('Error', 'No se puede completar la acción')
        })
    }

    watch([search], debounce(() => {
        getRegisters()
    }, 500))

    watch(() => filters.value.type_report, () => {
        registers.value = []
    })

    onMounted(() => {
        getOficinasServices()
        getEstatusServices()
        getTipoSolicitud()
    })

    const getOficinasServices = () => {
        CatOficinasServices.index().then(response => {
            if (response.data.success) {
                offices.value = response.data.data
                catalogsOptions.value.offices = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }

    const getEstatusServices = () => {
        CatEstatusSolicitudServices.index().then(response => {
            if (response.data.success) {
                status.value = response.data.data
                catalogsOptions.value.status = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }

    const getTipoSolicitud = () => {
        CatTipoSolicitudServices.index().then(response => {
            if (response.data.success) {
                requestType.value = response.data.data
                catalogsOptions.value.requestType = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }


    const downloadExcel = () => {

        $q.loading.show()
        const params = {
            action: 'export',
            filters: filters.value
        };

        ReportsServices.downloadExcel(params).then(response => {
            const linkUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = linkUrl;

            link.setAttribute('download', 'Reporte.xlsx');
            document.body.appendChild(link);
            link.click();
            $q.loading.hide()
        })
            .catch(() => {
                $q.loading.hide()

                showWarning(
                    '',
                    'No fue posible completar la acción, intente nuevamente.'
                )
            });
    }

    const downloadPDF = () => {
        const params = {
            action: 'print',
            filters: filters.value
        };

        $q.loading.show()
        ReportsServices.downloadPDF(params).then(response => {

            const linkUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = linkUrl;

            link.setAttribute('download', 'Reporte.pdf');
            document.body.appendChild(link);
            link.click();
            $q.loading.hide()

        }).catch(() => {
            $q.loading.hide()

            showWarning(
                '',
                'No fue posible completar la acción, intente nuevamente.'
            )
        })
    }

    const clearData = () => {

        filters.value.type_report = null,
            filters.value.from = null,
            filters.value.to = null,
            filters.value.id_tipo_solicitud = null,
            filters.value.id_estatus_solicitud = null,
            filters.value.id_oficina = null,
            yesterday.value = null
        yesterday_input.value = null
        dialog.value = false;
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

    const expandedRows = ref([])
    const showRequests = (props) => {
        const wasExpanded = props.expand === true

        expandedRows.value.forEach(row => (row.expand = false))
        expandedRows.value = []
        if (!wasExpanded) {
            props.expand = true
            expandedRows.value = [props]
        }
    }

    function filterFnCatRequest(val, update) {
        if (val === '') {
            update(() => { requestType.value = catalogsOptions.value.requestType })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            requestType.value = catalogsOptions.value.requestType.filter(v => v.tipo_solicitud.toLowerCase().indexOf(needle) > -1)

        })
    }

    function filterFnCatOffice(val, update) {
        if (val === '') {
            update(() => { offices.value = catalogsOptions.value.offices })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            offices.value = catalogsOptions.value.offices.filter(v => v.nombre_corto.toLowerCase().indexOf(needle) > -1)

        })
    }

    function filterFnCatStatus(val, update) {
        if (val === '') {
            update(() => { status.value = catalogsOptions.value.status })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            status.value = catalogsOptions.value.status.filter(v => v.estatus_solicitud.toLowerCase().indexOf(needle) > -1)

        })
    }

    return {
        yesterday,
        yesterday_input,
        myLocale,
        dialog,
        options,
        filters,
        offices,
        status,
        requestType,
        catalogsOptions,

        title,
        showModal,
        pagination,
        search,
        registers,
        columns1,
        columns2,
        requestsColumns,
        expandedRows,
        typeReportRef,
        isRequired,
        clearData,
        getDayCalendar,
        getRegisters,
        downloadExcel,
        downloadPDF,
        showRequests,
        filterFnCatRequest,
        filterFnCatOffice,
        filterFnCatStatus,
    }
}

export default useReports

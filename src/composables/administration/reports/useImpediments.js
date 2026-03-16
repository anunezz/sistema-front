import { ref, watch, onMounted, computed } from "vue";
import { debounce } from 'lodash';
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";
import ImpedimentsService from "src/services/administration/reports/ImpedimentsService";
import CatOficinasServices from "src/services/administration/catalogs/CatOficinasServices";
import CatCausalImpedimentoServices from "src/services/administration/catalogs/CatCausalImpedimentoServices";
import CatSubCausalImpedimentoServices from "src/services/administration/catalogs/CatSubCausalImpedimentoServices";
import UserServices from "src/services/administration/UserServices";

const useImpediments = () => {
    const $q = useQuasar()
    const { showError, showWarning } = useNotify()


    const dialog = ref(false)
    const offices = ref(false)
    const users = ref(false)
    const causeImpediments = ref([])
    const causeSubimpediments = ref([])
    const filters = ref({
        type_report: null,
        date: null,
        id_user: null,
        id_oficina: null,
        id_causal_impedimento: null,
        id_causal_subimpedimento: null,
    });

    const catalogsOptions = ref({
        users: [],
        offices: [],
        causeImpediments: [],
        causeSubimpediments: [],
    })

    const title = ref('')
    const showModal = ref(false)
    const search = ref('')
    const registers = ref([])
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    })


    const columns = ref([
        {
            name: 'dia',
            label: 'Dia',
            align: 'left',
            field: row => row.dia,
            sortable: true
        },
        {
            name: 'nombre_corto',
            label: 'Oficina',
            align: 'left',
            field: row => row.nombre_corto,
            sortable: true
        },
        {
            name: 'alta',
            label: 'Alta',
            align: 'left',
            field: row => row.alta,
            sortable: true
        },
        {
            name: 'baja',
            label: 'Baja',
            align: 'left',
            field: row => row.baja,
            sortable: true
        },
        {
            name: 'verificacion',
            label: 'Verificacion',
            align: 'left',
            field: row => row.verificacion,
            sortable: true
        },
        {
            name: 'modificacion',
            label: 'Modificacion',
            align: 'left',
            field: row => row.modificacion,
            sortable: true
        }

    ])

    const optionUsers = ref([]);
    const allUsers = ref([]);
    const searchUser = ref('')

    const filterUsers = (val, update) => {
        if (val === '') {
            update(() => {
                optionUsers.value = allUsers.value;
            });
            return;
        }

        update(() => {
            const needle = val.toLowerCase();
            optionUsers.value = allUsers.value.filter(
                user => user.username.toLowerCase().indexOf(needle) > -1
            );
        });
    };

    const onUserSelected = (newVal) => {
        if (newVal) {
            catalogsOptions.value.users.find(item => item.id === newVal);
            searchUser.value = '';

        }
    };
    const userCol = {
        name: 'usuario',
        label: 'Usuario',
        align: 'left',
        field: 'usuario',           // <- usa string, no función
        sortable: true,
        format: (val) => val ?? '-' // opcional
    }

    const isMonthlyView = computed(() => !!monthYear.value?.month && !!monthYear.value?.year)

    const columnsDay = ref([
        { name: 'dia', label: 'Día', align: 'left', field: row => row.dia, sortable: true },
        { name: 'nombre_corto', label: 'Oficina', align: 'left', field: row => row.nombre_corto, sortable: true },
        userCol,
        { name: 'alta', label: 'Alta', align: 'left', field: row => row.alta, sortable: true },
        { name: 'baja', label: 'Baja', align: 'left', field: row => row.baja, sortable: true },
        { name: 'verificacion', label: 'Verificación', align: 'left', field: row => row.verificacion, sortable: true },
        { name: 'modificacion', label: 'Modificación', align: 'left', field: row => row.modificacion, sortable: true }
    ])

    // Columnas para vista por MES (cuando back devuelve `periodo`)
    const columnsMonth = ref([
        { name: 'periodo', label: 'Periodo (YYYY-MM)', align: 'left', field: row => row.periodo, sortable: true },
        { name: 'nombre_corto', label: 'Oficina', align: 'left', field: row => row.nombre_corto, sortable: true },
        userCol,
        { name: 'alta', label: 'Alta', align: 'left', field: row => row.alta, sortable: true },
        { name: 'baja', label: 'Baja', align: 'left', field: row => row.baja, sortable: true },
        { name: 'verificacion', label: 'Verificación', align: 'left', field: row => row.verificacion, sortable: true },
        { name: 'modificacion', label: 'Modificación', align: 'left', field: row => row.modificacion, sortable: true }
    ])


    const getRegisters = (props) => {

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
        const noFiltersSelected =
            !yesterday_input.value &&
            !yesterday.value &&
            !monthYear.value.month &&
            !monthYear.value.year &&
            Object.values(filters.value).every(v => !v);

        if (noFiltersSelected) {
            $q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'warning',
                message: 'Error. Por favor captura al menos un filtro'
            })
            return
        }

        if (!yesterday_input.value && monthYear.value.month && !monthYear.value.year) {
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: 'El campo Año es requerido'
            })
            return
        }
        $q.loading.show()

        ImpedimentsService.index(data).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                registers.value = Array.isArray(response?.data?.data?.data)
                    ? response.data.data.data
                    : [];
                pagination.value = {
                    page: response.data.data.current_page,
                    rowsPerPage: response.data.data.per_page,
                    rowsNumber: response.data.data.total
                }
            }
        }).catch(() => {
            $q.loading.hide()
            showError('Error', 'No se puede completar la acción')
        })
    }



    watch([search], debounce(() => {
        getRegisters()
    }, 500))

    const withUser = (baseCols) => {
        const cols = [...baseCols]; // 👈 copia limpia SIEMPRE

        const hasUser =
            Array.isArray(filters.value.id_user)
                ? filters.value.id_user.length > 0
                : !!filters.value.id_user;

        if (hasUser && !cols.some(c => c.name === 'usuario')) {
            cols.splice(2, 0, userCol); // inserta en posición 2
        }

        if (!hasUser) {
            return cols.filter(c => c.name !== 'usuario');
        }

        return cols;
    };


    const columnsToShow = computed(() => withUser(isMonthlyView.value ? columnsMonth.value : columnsDay.value))

    const rowKeyFn = (row) => `${row.periodo || row.dia}|${row.nombre_corto}|${row.usuario || ''}`
    onMounted(() => {
        getUsersServices()
        getOficinasServices()
        getCausalImpedimentoServices()
        getSubCausalImpedimentoServices()
    })

    const getUsersServices = () => {
        UserServices.cat_users().then(response => {
            $q.loading.hide()
            if (response.data.success) {
                console.log('response.data.Results', response.data.Results)
                users.value = response.data.Results
                allUsers.value = response.data.Results
                optionUsers.value = response.data.Results
                catalogsOptions.value.users = response.data.Results

            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }
    const getOficinasServices = () => {
        CatOficinasServices.index().then(response => {
            $q.loading.hide()
            if (response.data.success) {
                offices.value = response.data.data
                catalogsOptions.value.offices = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }

    const getCausalImpedimentoServices = () => {
        CatCausalImpedimentoServices.index().then(response => {
            $q.loading.hide()
            if (response.data.success) {
                causeImpediments.value = response.data.data
                catalogsOptions.value.causeImpediments = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }


    const getSubCausalImpedimentoServices = () => {
        CatSubCausalImpedimentoServices.index().then(response => {
            $q.loading.hide()
            if (response.data.success) {
                causeSubimpediments.value = response.data.data
                catalogsOptions.value.causeSubimpediments = response.data.data
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

        ImpedimentsService.downloadExcel(params).then(response => {
            const linkUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = linkUrl;

            link.setAttribute('download', 'Estadistico_solicitudes.xlsx');
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
        ImpedimentsService.downloadPDF(params).then(response => {

            const linkUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = linkUrl;

            link.setAttribute('download', 'Estadistico_solicitudes.pdf');
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
        // limpiar filtros seleccionados
        filters.value = {
            type_report: null,
            date: null,
            id_user: null,
            id_oficina: null,
            id_causal_impedimento: null,
            id_causal_subimpedimento: null,
            from: null,
            to: null
        };

        // limpiar inputs auxiliares
        search.value = '';
        yesterday.value = null;
        yesterday_input.value = null;
        monthYear.value = { month: null, year: null };

        // reiniciar paginación (si no, se queda la misma página)
        pagination.value.page = 1;

        // cerrar modal si aplica
        dialog.value = false;

        // recuperar registros sin filtros
        getRegisters();
    };


    const yesterday = ref(null)
    const yesterday_input = ref(null)

    const monthYear = ref({ month: null, year: null })

    const monthOptions = [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 }
    ]
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

    // Años (ajusta el rango como gustes)
    const yearOptions = computed(() => {
        const current = new Date().getFullYear()
        const start = current - 10 // últimos 10 años
        return Array.from({ length: current - start + 1 }, (_, i) => {
            const y = current - i
            return { label: String(y), value: y }
        })
    })

    // Si quieres bloquear meses futuros del año actual:
    const monthsForSelectedYear = computed(() => {
        const now = new Date()
        const isCurrentYear = monthYear.value.year === now.getFullYear()
        const currentMonth = now.getMonth() + 1
        return monthOptions.map(m => ({
            ...m,
            // Quasar permite marcar una opción como 'disable' en QSelect
            disable: isCurrentYear && m.value > currentMonth
        }))
    })

    // ==== util común ====
    const fmt = (d) => {
        const date = new Date(d)
        return (
            String(date.getDate()).padStart(2, '0') + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            date.getFullYear()
        )
    }
    const monthToRange = (y, m) => {
        const first = new Date(y, m - 1, 1)
        const last = new Date(y, m, 0)
        return { from: fmt(first), to: fmt(last) }
    }

    // ==== estado / flags ====
    const hasRange = computed(() =>
        !!(yesterday.value && yesterday.value.from && yesterday.value.to)
    )
    const hasMonthYear = computed(() =>
        !!(monthYear.value?.month && monthYear.value?.year)
    )

    // ==== REGLA DE PRIORIDAD ====
    // Si hay rango -> usa rango.
    // Si no hay rango pero hay mes/año -> usa mes/año.
    // Si no hay nada -> limpia.
    watch(
        [
            () => yesterday.value,                  // cambios en el rango
            () => monthYear.value.month,            // cambios en mes
            () => monthYear.value.year              // cambios en año
        ],
        () => {
            if (hasRange.value) {
                // actualiza input visible del rango y los filters
                const from = fmt(yesterday.value.from)
                const to = fmt(yesterday.value.to)
                yesterday_input.value = `${from} ${to}`
                filters.value.from = from
                filters.value.to = to
                return
            }

            if (hasMonthYear.value) {
                const r = monthToRange(monthYear.value.year, monthYear.value.month)
                filters.value.from = r.from
                filters.value.to = r.to
                // deja el input del rango vacío para que no "interfiera" visualmente
                yesterday_input.value = ''
                return
            }

            // nada seleccionado
            filters.value.from = ''
            filters.value.to = ''
            yesterday_input.value = ''
        },
        { deep: true, immediate: true }
    )


    /*const displayValue = ref('') // lo que se muestra como MM/YYYY
    function updateDisplay(val) {
        if (val) {
            const [year, month] = val.split('-')
            displayValue.value = `${month}/${year}`
        }
    }*/

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

    function filterFnCatCausal(val, update) {
        if (val === '') {
            update(() => { causeImpediments.value = catalogsOptions.value.causeImpediments })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            causeImpediments.value = catalogsOptions.value.causeImpediments.filter(v => v.causal_impedimento.toLowerCase().indexOf(needle) > -1)

        })
    }

    function filterFnCatSubcausal(val, update) {
        if (val === '') {
            update(() => { causeSubimpediments.value = catalogsOptions.value.causeSubimpediments })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            causeSubimpediments.value = catalogsOptions.value.causeSubimpediments.filter(v => v.subcausal_impedimento.toLowerCase().indexOf(needle) > -1)

        })
    }

    return {
        //displayValue,
        yesterday,
        yesterday_input,
        myLocale,
        dialog,
        filters,
        offices,
        users,
        optionUsers,
        causeImpediments,
        causeSubimpediments,
        monthsForSelectedYear,
        yearOptions,
        monthYear,
        monthOptions,
        title,
        showModal,
        pagination,
        search,
        registers,
        columns,
        columnsToShow,
        clearData,
        getRegisters,
        downloadExcel,
        downloadPDF,
        //updateDisplay,
        getDayCalendar,
        filterFnCatOffice,
        filterFnCatCausal,
        filterFnCatSubcausal,
        rowKeyFn,
        filterUsers,
        onUserSelected

    }

}
export default useImpediments

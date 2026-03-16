import { ref, watch } from "vue";
import { debounce } from 'lodash'
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";
import CatPaisServices from "src/services/administration/catalogs/CatPaisServices";
import DeleteAlert from 'components/DeleteAlert.vue'

const useCatPais = () => {
    const $q = useQuasar()
    const { showError, showSuccess, showWarning } = useNotify()

    const title = ref('')
    const showModal = ref(false)
    const search = ref('')
    const registers = ref([])
    const catForm = ref({
        idalpha2: '',
        idalpha3: '',
        cad_nombre_es: '',
        bol_eliminado: false,
        action: 1
    })
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    })
    const hasTwoLength = (val) => {
        if (val) {
            return val === null || val === '' || val.length == 2 || 'Escriba dos caracteres'
        }
    }
    const hasThreeLengths = (val) => {
        if (val) {
            return val === null || val === '' || val.length == 3 || 'Escriba tres caracteres'
        }
    }


    const columns = ref([
        {
            name: 'id_pais',
            label: 'ID',
            align: 'center',
            field: row => row.id_pais,
            sortable: true
        },
        {
            name: 'idalpha2',
            label: 'Nombre',
            align: 'left',
            field: row => row.idalpha2,
            sortable: true
        },
        {
            name: 'idalpha3',
            label: 'Nombre',
            align: 'left',
            field: row => row.idalpha3,
            sortable: true
        },
        {
            name: 'cad_nombre_es',
            label: 'País',
            align: 'left',
            field: row => row.cad_nombre_es,
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
            name: 'bol_eliminado',
            label: 'Deshabilitado',
            align: 'left',
            field: row => row.bol_eliminado,
            sortable: true
        },
        {
            name: 'actions',
            align: 'center',
            label: 'Acciones',

        }
    ])

    const customDelete = (id) => {
        $q.dialog({
            component: DeleteAlert,
            componentProps: {
                icon: 'delete',
                title: 'Baja de Catálogo',
                subtitle: 'Esta acción no se puede deshacer',
                question: '¿DESEA ELIMINAR EL REGISTRO DE FORMA PERMANENTE?',
                button: 'Eliminar'
            }

        }).onOk(() => {
            deleteRegister(id);
        }).onCancel(() => {
            $q.notify({
                type: '',
                message: 'Acción cancelada.'
            });
        })
    }

    const deleteRegister = (id) => {

        CatPaisServices.remove(id).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                showSuccess(
                    'Éxito',
                    'Se eliminó el registro.'
                )
                getRegisters()
            }
        }).catch(() => {
            $q.loading.hide()
            showError(
                'Error',
                'Intente nuevamente.'
            )
        })
    }

    const getRegisters = (props) => {

        if (props !== undefined) {
            pagination.value = props.pagination
        }

        const data = {
            params: {
                page: pagination.value.page,
                rowsPerPage: pagination.value.rowsPerPage,
                search: search.value
            }
        };

        $q.loading.show()

        CatPaisServices.index(data).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                registers.value = response.data.data.data
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

    const onSubmit = () => {
        $q.loading.show()
        CatPaisServices.store(catForm.value).then(response => {

            $q.loading.hide()
            if (response.data.success) {
                showModal.value = false
                showSuccess('', 'El registro se guardó correctamente.');
                getRegisters()
            }

        }).catch(error => {
            $q.loading.hide()
            if (error.response.status === 422) {
                showWarning('', 'Ya existe un registro similar, favor de verificar')
            } else {
                showError('Error', 'No se puede completar la acción')
            }
        })
    }

    const onUpdate = () => {
        $q.loading.show()
        CatPaisServices.update(
            catForm.value.hash_id,
            catForm.value)
            .then(response => {
                if (response.data.success) {
                    $q.loading.hide()
                    showModal.value = false
                    showSuccess('El registro se actualizó correctamente.')
                    getRegisters()
                }

            }).catch(e => {
                $q.loading.hide()
                if (e.response.status === 422) {
                    showWarning(
                        '',
                        'Ya existe un registro similar, favor de verificar'
                    )
                } else {
                    showError(
                        'Error',
                        'No se puede completar la acción'
                    )
                }

            })
    }

    const newRegister = () => {
        title.value = 'Nuevo Catálogo'
        showModal.value = true
        catForm.value = {
            idalpha2: '',
            idalpha3: '',
            cad_nombre_es: '',
            bol_eliminado: false,
            action: 1,
        }
    }

    const editRegister = (data) => {
        title.value = 'Editar Catálogo'
        showModal.value = true
        catForm.value = {
            hash_id: data.hash_id,
            idalpha2: data.idalpha2,
            idalpha3: data.idalpha3,
            cad_nombre_es: data.cad_nombre_es,
            bol_eliminado: data.bol_eliminado,
            action: 2,
        }
    }

    watch([search], debounce(() => {
        getRegisters()
    }, 500))

    return {
        title,
        showModal,
        catForm,
        pagination,
        search,
        registers,
        columns,

        customDelete,
        getRegisters,
        editRegister,
        newRegister,
        onSubmit,
        onUpdate,
        hasTwoLength,
        hasThreeLengths,
    }
}

export default useCatPais

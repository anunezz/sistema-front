import { ref, watch, onMounted } from "vue";
import { debounce } from 'lodash'
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";
import CatMunicipioServices from "src/services/administration/catalogs/CatMunicipioServices";
import CatEntidadFederativaServices from "src/services/administration/catalogs/CatEntidadFederativaServices";
import CatPaisServices from "src/services/administration/catalogs/CatCategoriasServices";
import DeleteAlert from 'components/DeleteAlert.vue'

const useCatMunicipio = () => {
    const $q = useQuasar()
    const { showError, showSuccess, showWarning } = useNotify()

    const title = ref('')
    const showModal = ref(false)
    const search = ref('')
    const registers = ref([])
    const countries = ref([])
    const federalEntities = ref([])
    const catForm = ref({
        id_entidad_federativa: '',
        id_pais: '',
        municipio: '',
        bol_eliminado: false,
        action: 1
    })
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    })


    const columns = ref([
        {
            name: 'id_municipio',
            label: 'ID',
            align: 'left',
            field: row => row.id_municipio,
            sortable: true
        },
        {
            name: 'municipio',
            label: 'Municipio',
            align: 'left',
            field: row => row.municipio,
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

        CatMunicipioServices.remove(id).then(response => {
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

        CatMunicipioServices.index(data).then(response => {
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
        CatMunicipioServices.store(catForm.value).then(response => {

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
        CatMunicipioServices.update(
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
            id_entidad_federativa: '',
            id_pais: '',
            municipio: '',
            bol_eliminado: false,
            action: 1,
        }
    }

    const editRegister = (data) => {
        title.value = 'Editar Catálogo'
        showModal.value = true
        catForm.value = {
            hash_id: data.hash_id,
            id_entidad_federativa: data.id_entidad_federativa,
            id_pais: data.id_pais,
            municipio: data.municipio,
            bol_eliminado: data.bol_eliminado,
            action: 2,
        }
    }

    watch([search], debounce(() => {
        getRegisters()
    }, 500))

    onMounted(() => {
        getPaisServices()
        getEntidadesFederativasServices()
    })

    const getPaisServices = () => {
        CatPaisServices.index().then(response => {
            $q.loading.hide()
            if (response.data.success) {
                countries.value = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }

    const getEntidadesFederativasServices = () => {
        CatEntidadFederativaServices.index().then(response => {
            $q.loading.hide()
            if (response.data.success) {
                federalEntities.value = response.data.data
            }
        }).catch(() => {
            showError('Error', 'No se puede completar la acción')
        })
    }

    return {
        title,
        showModal,
        catForm,
        pagination,
        search,
        registers,
        columns,
        countries,
        federalEntities,

        customDelete,
        getRegisters,
        editRegister,
        newRegister,
        onSubmit,
        onUpdate,
    }
}

export default useCatMunicipio

import { ref, watch } from "vue";
import { debounce } from 'lodash'
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";
import CatCausalImpedimentoServices from "src/services/administration/catalogs/CatCausalImpedimentoServices";
import CatSubCausalImpedimentoServices from "src/services/administration/catalogs/CatSubCausalImpedimentoServices";
import DeleteAlert from 'components/DeleteAlert.vue'
import { BinnacleTransaction } from "src/utils/binnacle"

const useCatCausalImpedimento = () => {
    const $q = useQuasar()
    const { showError, showSuccess, showWarning } = useNotify()
    
    const title = ref('')
    const showModal = ref(false)
    const search = ref('')
    const registers = ref([])
    const catForm = ref({
        causal_impedimento: '',
        bol_eliminado: false,
        validate_high: false,
        action: 1
    })
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    })
    
    
    const columns = ref([
        {
            name: 'id_causal_impedimento',
            label: 'ID',
            align: 'left',
            field: row => row.id_causal_impedimento,
            sortable: true
        },
        {
            name: 'causal_impedimento',
            label: 'Causal',
            align: 'left',
            field: row => row.causal_impedimento,
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
    
    const customDelete = (id, bol) => {
        $q.dialog({
            component: DeleteAlert,
            componentProps: {
                icon: bol ? 'check' : 'delete',
                title: 'Baja de Catálogo',
                subtitle: bol ? 'HABILITAR' : 'DESHABILITAR',
                question: bol ? '¿DESEA HABILITAR EL REGISTRO?' :'¿DESEA DESHABILITAR EL REGISTRO?' ,
                button: bol ? 'Habilitar' : 'Deshabilitar',
            }
            
        }).onOk(() => {
            deleteRegister(id, bol);
        }).onCancel(() => {
            $q.notify({
                type: '',
                message: 'Acción cancelada.'
            });
        })
    }
    
    const deleteRegister = (id, bol) => {
        
        CatCausalImpedimentoServices.remove(id).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                showSuccess(
                    'Éxito',
                    bol ? 'El catálogo se ha habilitado correctamente' : 'El catálogo se ha deshabilitado correctamente'
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
        
        CatCausalImpedimentoServices.index(data).then(response => {
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
        CatCausalImpedimentoServices.store(catForm.value).then(response => {
            
            $q.loading.hide()
            if (response.data.success) {
                showModal.value = false
                showSuccess('', 'El registro se guardó correctamente.');
                getRegisters()
            }
            
        }).catch(error => {
        $q.loading.hide()

        if (error.response.status === 422) {
            const errors = error.response.data.errors
            const firstKey = Object.keys(errors)[0]
            const firstMessage = errors[firstKey][0] || 'Error de validación'

            showWarning('', firstMessage)
        } else {
            showError('Error', 'No se puede completar la acción')
        }
        })
    }
    
    const onUpdate = () => {
        $q.loading.show()
        CatCausalImpedimentoServices.update(
            catForm.value.hash_id,
            catForm.value)
            .then(response => {
                if (response.data.success) {
                    $q.loading.hide()
                    showModal.value = false
                    showSuccess('El registro se actualizó correctamente.')
                    getRegisters()
                }
                
            }).catch(error => {
        $q.loading.hide()

        if (error.response.status === 422) {
            const errors = error.response.data.errors
            const firstKey = Object.keys(errors)[0]
            const firstMessage = errors[firstKey][0] || 'Error de validación'

            showWarning('', firstMessage)
        } else {
            showError('Error', 'No se puede completar la acción')
        }
        })
    }
    
    const newRegister = () => {
        title.value = 'Nuevo Catálogo'
        showModal.value = true
        catForm.value = {
            causal_impedimento: '',
            bol_eliminado: false,
            validate_high: false,
            action: 1,
        }
    }
    
    const editRegister = (data) => {
        title.value = 'Editar Catálogo'
        showModal.value = true
        catForm.value = {
            hash_id: data.hash_id,
            causal_impedimento: data.causal_impedimento,
            bol_eliminado: data.bol_eliminado,
            validate_high: data.validate_high ? data.validate_high : false,
            action: 2,
        }
    }
    
    watch([search], debounce(() => {
        getRegisters()
        BinnacleTransaction(10, 1, `Se realizo una busqueda en el módulo Catálogo de Causales`)
    }, 500))
    
    
    const titleSub = ref('')
    const showModalAddSub = ref(false)
    const searchSub = ref('')
    const registersSub = ref([])
    
    const catFormSub = ref({
        id_causal_impedimento: '',
        subcausal_impedimento: '',
        bol_eliminado: false,
        validate_high: false,
        action: 1
    })
    
    const paginationSub = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    })
    
    const columnsSub = ref([
        {
            name: 'subcausal_impedimento',
            label: 'Subcausal',
            align: 'left',
            field: row => row.subcausal_impedimento,
            sortable: true
        },
        {
            name: 'fec_alta',
            label: 'Fecha Alta',
            align: 'left',
            field: row => row.fec_alta,
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
    
    const showModalSub = (data) => {
        showModalAddSub.value = true
        catFormSub.value = {}   
        titleSub.value = 'Nuevo Subcausal'
        catFormSub.value = {
            id_causal_impedimento: data.id_causal_impedimento,
            subcausal_impedimento: '',
            bol_eliminado: false,
            action: 1,
        }
    }
    
    const onSubmitSub = () => {
        $q.loading.show()
        CatSubCausalImpedimentoServices.store(catFormSub.value).then(response => {
            
            $q.loading.hide()
            if (response.data.success) {
                showModalAddSub.value = false
                showSuccess('', 'El registro se guardó correctamente.');
                getRegisters()
            }
            
        }).catch(error => {
            $q.loading.hide()

            const errors = error?.response?.data?.errors
            if (errors) {
                const firstKey = Object.keys(errors)[0]
                const firstMessage = errors[firstKey][0] || 'Error de validación'
                showWarning('', firstMessage)
            } else {
                showError('Error', 'No se puede completar la acción')
            }
        })

    }

    const showModalTable = ref(false)
    const idCausalImpedimento = ref(0)
    const showModalTableSub = (data) => {
        idCausalImpedimento.value = data.id_causal_impedimento
        getRegistersSub()
        showModalTable.value = true
    }

    const getRegistersSub = (props) => {

        if (props !== undefined) {
            paginationSub.value = props.pagination
        }

        const data = {
            params: {
                page: paginationSub.value.page,
                rowsPerPage: paginationSub.value.rowsPerPage,
                search: searchSub.value,
                id_causal_impedimento: idCausalImpedimento.value,
            }
        };

        $q.loading.show()

        CatSubCausalImpedimentoServices.index(data).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                registersSub.value = response.data.data.data
                paginationSub.value = {
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

    const editRegisterSub = (data) => {
        titleSub.value = 'Editar Subcausal'
        showModalAddSub.value = true
        catFormSub.value = {
            hash_id: data.hash_id,
            id_causal_impedimento: data.id_causal_impedimento,
            subcausal_impedimento: data.subcausal_impedimento,
            bol_eliminado: data.bol_eliminado,
            action: 2,
        }
    }

    const onUpdateSub = () => {
        $q.loading.show()
        CatSubCausalImpedimentoServices.update(
            catFormSub.value.hash_id,
            catFormSub.value)
            .then(response => {
                if (response.data.success) {
                    $q.loading.hide()
                    showModalAddSub.value = false
                    showSuccess('El registro se actualizó correctamente.')
                    getRegistersSub()
                }

            }).catch(error => {
        $q.loading.hide()

        if (error.response.status === 422) {
            const errors = error.response.data.errors
            const firstKey = Object.keys(errors)[0]
            const firstMessage = errors[firstKey][0] || 'Error de validación'

            showWarning('', firstMessage)
        } else {
            showError('Error', 'No se puede completar la acción')
        }
        })
    }

    const customDeleteSub = (id, bol) => {
        $q.dialog({
            component: DeleteAlert,
            componentProps: {
                icon: 'delete',
                title: 'Baja de Catálogo',
                subtitle: bol ? 'HABILITAR': 'DESHABILITAR',
                question: bol ? '¿DESEA HABLILITAR EL REGISTRO?': '¿DESEA DESHABILITAR EL REGISTRO?',
                button: bol ? 'Habilitar' : 'Deshabilitar',
            }

        }).onOk(() => {
            deleteRegisterSub(id, bol);
        }).onCancel(() => {
            $q.notify({
                type: '',
                message: 'Acción cancelada.'
            });
        })
    }

    const deleteRegisterSub = (id, bol) => {

        CatSubCausalImpedimentoServices.remove(id).then(response => {
            $q.loading.hide()
            if (response.data.success) {
                showSuccess(
                    'Éxito',
                    bol ? 'El subcausal se ha habilitado correctamente' : 'El subcausal se ha deshabilitado correctamente'    
                )
                getRegistersSub()
            }
        }).catch(() => {
            $q.loading.hide()
            showError(
                'Error',
                'Intente nuevamente.'
            )
        })
    }

    watch([searchSub], debounce(() => {
        getRegistersSub()
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

        titleSub,
        showModalAddSub,
        catFormSub,
        showModalTable,
        searchSub,
        registersSub,
        paginationSub,
        columnsSub,
        showModalSub,
        onSubmitSub,
        showModalTableSub,
        getRegistersSub,
        editRegisterSub,
        onUpdateSub,
        customDeleteSub,
    }
}

export default useCatCausalImpedimento

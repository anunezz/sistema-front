import { ref, watch, onMounted } from "vue";
import { debounce } from 'lodash'
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";
import CatOficinasServices from "src/services/administration/catalogs/CatOficinasServices";
import CatPaisServices from "src/services/administration/catalogs/CatCategoriasServices";
import DeleteAlert from 'components/DeleteAlert.vue'
import { BinnacleTransaction } from "src/utils/binnacle"

const useCatOficinas = () => {
    const $q = useQuasar()
    const { showError, showSuccess, showWarning } = useNotify()

    const title = ref('')
    const showModal = ref(false)
    const search = ref('')
    const registers = ref([])
    const countries = ref([])
    const catForm = ref({
        id_oficina_suet: '',
        id_pais: '',
        cad_oficina: '',
        nombre_corto: '',
        correo_electronico: '',
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
            name: 'id_oficina',
            label: 'ID',
            align: 'center',
            field: row => row.id_oficina,
            sortable: true
        },
        {
            name: 'cad_oficina',
            label: 'Cad Oficina',
            align: 'left',
            field: row => row.cad_oficina,
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
            name: 'correo_electronico',
            label: 'Correo electrónico',
            align: 'left',
            field: row => row.correo_electronico,
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
                question: bol ? '¿DESEA HABILITAR EL REGISTRO' :'¿DESEA DESHABILITAR EL REGISTRO' ,
                button: bol ? 'Habilitar' : 'Deshabilitar',
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

        CatOficinasServices.remove(id).then(response => {
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

        CatOficinasServices.index(data).then(response => {
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
        CatOficinasServices.store(catForm.value).then(response => {

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
        CatOficinasServices.update(
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
            id_oficina_suet: '',
            id_pais: '',
            cad_oficina: '',
            nombre_corto: '',
            correo_electronico: '',
            bol_eliminado: false,
            action: 1,
        }
    }

    const editRegister = (data) => {
        title.value = 'Editar Catálogo'
        showModal.value = true
        catForm.value = {
            hash_id: data.hash_id,
            id_oficina_suet: data.id_oficina_suet,
            id_pais: data.id_pais,
            cad_oficina: data.cad_oficina,
            nombre_corto: data.nombre_corto,
            bol_eliminado: data.bol_eliminado,
            correo_electronico: data.correo_electronico,
            action: 2,
        }
    }

    watch([search], debounce(() => {
        getRegisters()
        BinnacleTransaction(10, 1, `Se realizo una busqueda en el módulo Catálogo de Oficinas`)
    }, 500))

    onMounted(() => {
        getPaisServices()
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

    return {
        title,
        showModal,
        catForm,
        pagination,
        search,
        registers,
        columns,
        countries,

        customDelete,
        getRegisters,
        editRegister,
        newRegister,
        onSubmit,
        onUpdate,
    }
}

export default useCatOficinas

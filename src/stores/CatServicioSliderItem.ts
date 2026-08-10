import { defineStore } from 'pinia'
import { Dialog, Loading, Notify } from 'quasar'
import type { AxiosError } from 'axios'
import CatServicioSliderItemServices from 'src/services/administration/catalogs/CatServicioSliderItemServices'
import DeleteAlert from 'components/DeleteAlert.vue'
import type { TablePagination } from 'src/interfaces/serviceCategory'
import type {
  ServiceSliderItemRecord,
  ServiceSliderItemPayload,
  ServiceSliderItemUploadImage,
} from 'src/interfaces/serviceSliderItem'

type ServiceSliderItemForm = ServiceSliderItemPayload & { hash_id?: string; action: 1 | 2 }

interface CatServicioSliderItemState {
  serviceId: string | number | null
  showManager: boolean
  showModal: boolean
  title: string
  registers: ServiceSliderItemRecord[]
  pagination: TablePagination
  form: ServiceSliderItemForm
  currentImage: ServiceSliderItemUploadImage | null
  saving: boolean
}

interface QTableRequestProps {
  pagination: TablePagination
}

const defaultForm = (): ServiceSliderItemForm => ({
  title: '',
  description: '',
  sort_order: null,
  active: true,
  image: null,
  action: 1,
})

const genericErrorNotify = () =>
  Notify.create({ type: 'negative', message: 'Error', caption: 'No se puede completar la acción' })

export const useCatServicioSliderItemStore = defineStore('catServicioSliderItem', {
  state: (): CatServicioSliderItemState => ({
    serviceId: null,
    showManager: false,
    showModal: false,
    title: '',
    registers: [],
    pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0 },
    form: defaultForm(),
    currentImage: null,
    saving: false,
  }),

  actions: {
    openManager(serviceId: string | number) {
      this.serviceId = serviceId
      this.showManager = true
      this.pagination = { page: 1, rowsPerPage: 10, rowsNumber: 0 }
      this.getRegisters()
    },

    closeManager() {
      this.showManager = false
    },

    async getRegisters(props?: QTableRequestProps) {
      if (!this.serviceId) return

      if (props?.pagination) {
        this.pagination = { ...this.pagination, ...props.pagination }
      }

      Loading.show()
      try {
        const response = await CatServicioSliderItemServices.index(this.serviceId, {
          params: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            sortBy: this.pagination.sortBy,
            descending: this.pagination.descending,
          },
        })
        if (response.data.success) {
          this.registers = response.data.data.data
          this.pagination = {
            ...this.pagination,
            page: response.data.data.current_page,
            rowsPerPage: response.data.data.per_page,
            rowsNumber: response.data.data.total,
          }
        }
      } catch {
        genericErrorNotify()
      } finally {
        Loading.hide()
      }
    },

    newRegister() {
      this.title = 'Nuevo item del slider'
      this.form = defaultForm()
      this.currentImage = null
      this.showModal = true
    },

    editRegister(row: ServiceSliderItemRecord) {
      this.title = 'Editar item del slider'
      this.form = {
        hash_id: row.hash_id,
        title: row.title ?? '',
        description: row.description ?? '',
        sort_order: row.sort_order,
        active: row.active,
        image: null,
        action: 2,
      }
      this.currentImage = row.image ?? null
      this.showModal = true
    },

    onImageUploaded(data: ServiceSliderItemUploadImage) {
      this.form.image = data
    },

    async onSubmit() {
      if (!this.serviceId || this.saving) return
      this.saving = true
      Loading.show()
      try {
        const response = await CatServicioSliderItemServices.store(this.serviceId, this.form)
        if (response.data.success) {
          this.showModal = false
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'El item del slider se guardó correctamente.' })
          this.getRegisters()
        }
      } catch (error) {
        this.handleSaveError(error as AxiosError)
      } finally {
        this.saving = false
        Loading.hide()
      }
    },

    async onUpdate() {
      if (!this.serviceId || !this.form.hash_id || this.saving) return
      this.saving = true
      Loading.show()
      try {
        const response = await CatServicioSliderItemServices.update(this.serviceId, this.form.hash_id, this.form)
        if (response.data.success) {
          this.showModal = false
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'El item del slider se actualizó correctamente.' })
          this.getRegisters()
        }
      } catch (error) {
        this.handleSaveError(error as AxiosError)
      } finally {
        this.saving = false
        Loading.hide()
      }
    },

    handleSaveError(error: AxiosError) {
      if (error?.response?.status === 422) {
        Notify.create({ type: 'warning', message: '', caption: 'Verifica los datos capturados.' })
      } else {
        genericErrorNotify()
      }
    },

    confirmRemove(row: ServiceSliderItemRecord) {
      Dialog.create({
        component: DeleteAlert,
        componentProps: {
          icon: 'delete',
          title: 'Eliminar item del slider',
          subtitle: 'Esta acción no se puede deshacer',
          question: '¿Deseas eliminar este elemento del slider?',
          button: 'Eliminar',
        },
      }).onOk(() => this.removeRegister(row))
    },

    async removeRegister(row: ServiceSliderItemRecord) {
      if (!this.serviceId) return
      Loading.show()
      try {
        const response = await CatServicioSliderItemServices.remove(this.serviceId, row.hash_id)
        if (response.data.success) {
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'Se eliminó el item del slider.' })
          this.getRegisters()
        }
      } catch {
        Notify.create({ type: 'negative', message: 'Error', caption: 'Intente nuevamente.' })
      } finally {
        Loading.hide()
      }
    },
  },

  // Estado puramente transitorio de esta UI (diálogo abierto, registros de
  // la página actual, formulario en edición): no debe sobrevivir un F5 ni
  // filtrarse entre servicios distintos.
  //
  // OJO: pinia-plugin-persistedstate-2 (v2.0.30, ver
  // node_modules/pinia-plugin-persistedstate-2/dist/index.js) lee la opción
  // de store `persistedState`, NO `persist` — persiste TODO el estado de
  // cualquier store por defecto salvo que se declare `persistedState`. El
  // resto del proyecto (p.ej. stores/AuthUser.js) usa la clave `persist:`,
  // que el plugin ignora silenciosamente; no se tocó ese archivo aquí por
  // estar fuera de alcance (login/usuarios), pero es la causa real de que
  // el contexto de Contenido.vue se comportara de forma inconsistente al
  // recargar antes de este cambio.
  persistedState: {
    persist: false,
  },
})

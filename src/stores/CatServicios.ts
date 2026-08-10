import { defineStore } from 'pinia'
import { Dialog, Loading, Notify } from 'quasar'
import type { AxiosError } from 'axios'
import CatServiciosServices from 'src/services/administration/catalogs/CatServiciosServices'
import DeleteAlert from 'components/DeleteAlert.vue'
import type {
  ServiceCategoryRecord,
  ServiceCategoryPayload,
  ServiceCategoryFilters,
  TablePagination,
} from 'src/interfaces/serviceCategory'

type ServiceCategoryForm = ServiceCategoryPayload & { hash_id?: string; action: 1 | 2 }

interface CatServiciosState {
  title: string
  showModal: boolean
  registers: ServiceCategoryRecord[]
  pagination: TablePagination
  filters: ServiceCategoryFilters
  form: ServiceCategoryForm
  editingOriginalOrder: number | null
  selectedService: ServiceCategoryRecord | null
}

interface QTableRequestProps {
  pagination: TablePagination
}

const defaultForm = (): ServiceCategoryForm => ({
  module_id: null,
  icon: '',
  title: '',
  subtitle: '',
  sort_order: null,
  active: true,
  action: 1,
})

const defaultFilters = (): ServiceCategoryFilters => ({
  title: null,
  module_id: null,
  active: null,
})

const genericErrorNotify = () =>
  Notify.create({ type: 'negative', message: 'Error', caption: 'No se puede completar la acción' })

export const useCatServiciosStore = defineStore('catServicios', {
  state: (): CatServiciosState => ({
    title: '',
    showModal: false,
    registers: [],
    pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0 },
    filters: defaultFilters(),
    form: defaultForm(),
    editingOriginalOrder: null,
    selectedService: null,
  }),

  actions: {
    async getRegisters(props?: QTableRequestProps): Promise<boolean> {
      if (props?.pagination) {
        this.pagination = { ...this.pagination, ...props.pagination }
      }

      Loading.show()
      try {
        const response = await CatServiciosServices.index({
          params: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            sortBy: this.pagination.sortBy,
            descending: this.pagination.descending,
            filters: this.filters,
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
          return true
        }
        return false
      } catch {
        genericErrorNotify()
        return false
      } finally {
        Loading.hide()
      }
    },

    // Devuelve si la búsqueda fue exitosa para que la vista pueda cerrar el
    // modal de filtros solo cuando la consulta realmente funcionó.
    search(): Promise<boolean> {
      this.pagination.page = 1
      return this.getRegisters()
    },

    clearFilters() {
      this.filters = defaultFilters()
      this.getRegisters()
    },

    newRegister() {
      this.title = 'Nuevo Servicio'
      this.form = defaultForm()
      this.editingOriginalOrder = null
      this.showModal = true
    },

    selectService(row: ServiceCategoryRecord) {
      this.selectedService = row
    },

    // Reconstruye selectedService desde la API cuando se entra directo a la
    // URL de Contenido (F5, link directo) y Pinia no trae el registro
    // porque no persiste entre recargas.
    async loadServiceByHashId(hashId: string): Promise<boolean> {
      Loading.show()
      try {
        const response = await CatServiciosServices.edit(hashId)
        if (response.data.success) {
          this.selectedService = response.data.data
          return true
        }
        return false
      } catch {
        genericErrorNotify()
        return false
      } finally {
        Loading.hide()
      }
    },

    editRegister(row: ServiceCategoryRecord) {
      this.title = 'Editar Servicio'
      this.form = {
        hash_id: row.hash_id,
        module_id: row.module_id,
        icon: row.icon,
        title: row.title,
        subtitle: row.subtitle,
        sort_order: row.sort_order,
        active: row.active,
        action: 2,
      }
      this.editingOriginalOrder = row.sort_order
      this.showModal = true
    },

    async onSubmit() {
      Loading.show()
      try {
        const response = await CatServiciosServices.store(this.form)
        if (response.data.success) {
          this.showModal = false
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'El registro se guardó correctamente.' })
          this.getRegisters()
        }
      } catch (error) {
        this.handleSaveError(error as AxiosError)
      } finally {
        Loading.hide()
      }
    },

    async onUpdate() {
      if (!this.form.hash_id) return

      Loading.show()
      try {
        const response = await CatServiciosServices.update(this.form.hash_id, this.form)
        if (response.data.success) {
          this.showModal = false
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'El registro se actualizó correctamente.' })
          this.getRegisters()
        }
      } catch (error) {
        this.handleSaveError(error as AxiosError)
      } finally {
        Loading.hide()
      }
    },

    handleSaveError(error: AxiosError) {
      if (error?.response?.status === 422) {
        Notify.create({ type: 'warning', message: '', caption: 'Ya existe un registro similar, favor de verificar' })
      } else {
        genericErrorNotify()
      }
    },

    // Recorre el orden de los servicios afectados (entre los ya cargados) para que
    // ninguno quede duplicado ni con huecos al insertar/mover un registro a una posición ocupada.
    async reorderSiblings(newOrder: number, originalOrder: number | null) {
      const currentId = this.form.hash_id
      const siblings = this.registers.filter((row) => (row.hash_id ?? String(row.id)) !== currentId)

      let toShift: ServiceCategoryRecord[] = []
      let step = 0

      if (originalOrder === null) {
        toShift = siblings.filter((row) => row.sort_order >= newOrder)
        step = 1
      } else if (newOrder < originalOrder) {
        toShift = siblings.filter((row) => row.sort_order >= newOrder && row.sort_order < originalOrder)
        step = 1
      } else if (newOrder > originalOrder) {
        toShift = siblings.filter((row) => row.sort_order > originalOrder && row.sort_order <= newOrder)
        step = -1
      }

      for (const row of toShift) {
        await CatServiciosServices.update(row.hash_id ?? row.id, {
          module_id: row.module_id,
          icon: row.icon,
          title: row.title,
          subtitle: row.subtitle,
          sort_order: row.sort_order + step,
          active: row.active,
        })
      }
    },

    async submitWithReorder() {
      const newOrder = this.form.sort_order

      if (typeof newOrder === 'number') {
        Loading.show()
        try {
          await this.reorderSiblings(newOrder, this.editingOriginalOrder)
        } catch {
          Loading.hide()
          genericErrorNotify()
          return
        }
        Loading.hide()
      }

      if (this.form.action === 1) {
        await this.onSubmit()
      } else {
        await this.onUpdate()
      }
    },

    confirmRemove(row: ServiceCategoryRecord) {
      Dialog.create({
        component: DeleteAlert,
        componentProps: {
          icon: 'delete',
          title: 'Eliminar Servicio',
          subtitle: 'Esta acción no se puede deshacer',
          question: '¿DESEA ELIMINAR EL REGISTRO DE FORMA PERMANENTE?',
          button: 'Eliminar',
        },
      }).onOk(() => this.removeRegister(row))
    },

    async removeRegister(row: ServiceCategoryRecord) {
      Loading.show()
      try {
        const response = await CatServiciosServices.remove(row.hash_id ?? row.id)
        if (response.data.success) {
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'Se eliminó el registro.' })
          this.getRegisters()
        }
      } catch {
        Notify.create({ type: 'negative', message: 'Error', caption: 'Intente nuevamente.' })
      } finally {
        Loading.hide()
      }
    },

    confirmStatusChange(row: ServiceCategoryRecord) {
      const activate = !row.active
      Dialog.create({
        component: DeleteAlert,
        componentProps: {
          icon: activate ? 'check_circle' : 'block',
          title: activate ? 'Activar Servicio' : 'Desactivar Servicio',
          subtitle: activate ? 'ACTIVAR REGISTRO' : 'DESACTIVAR REGISTRO',
          question: activate ? '¿DESEA ACTIVAR EL REGISTRO?' : '¿DESEA DESACTIVAR EL REGISTRO?',
          button: activate ? 'Activar' : 'Desactivar',
        },
      }).onOk(() => this.changeStatus(row, activate))
    },

    async changeStatus(row: ServiceCategoryRecord, active: boolean) {
      Loading.show()
      try {
        const response = await CatServiciosServices.update(row.hash_id ?? row.id, {
          module_id: row.module_id,
          icon: row.icon,
          title: row.title,
          subtitle: row.subtitle,
          sort_order: row.sort_order,
          active,
        })
        if (response.data.success) {
          Notify.create({
            type: 'positive',
            message: 'Éxito',
            caption: active ? 'Registro activado correctamente.' : 'Registro desactivado correctamente.',
          })
          this.getRegisters()
        }
      } catch {
        genericErrorNotify()
      } finally {
        Loading.hide()
      }
    },
  },
})

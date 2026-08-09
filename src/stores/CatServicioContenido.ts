import { defineStore } from 'pinia'
import { Dialog, Loading, Notify } from 'quasar'
import type { AxiosError } from 'axios'
import CatServicioContenidoServices from 'src/services/administration/catalogs/CatServicioContenidoServices'
import DeleteAlert from 'components/DeleteAlert.vue'
import type { ServiceContentPayload } from 'src/interfaces/serviceContent'

interface CatServicioContenidoState {
  form: ServiceContentPayload
}

const defaultForm = (): ServiceContentPayload => ({
  title: '',
  subtitle: '',
  description: '',
  content: '',
})

const genericErrorNotify = () =>
  Notify.create({ type: 'negative', message: 'Error', caption: 'No se puede completar la acción' })

export const useCatServicioContenidoStore = defineStore('catServicioContenido', {
  state: (): CatServicioContenidoState => ({
    form: defaultForm(),
  }),

  actions: {
    async loadContent(serviceId: string | number) {
      this.form = defaultForm()

      Loading.show()
      try {
        const response = await CatServicioContenidoServices.show(serviceId)
        if (response.data.success && response.data.data) {
          const record = response.data.data
          this.form = {
            title: record.title,
            subtitle: record.subtitle,
            description: record.description,
            content: record.content,
          }
        }
      } catch {
        genericErrorNotify()
      } finally {
        Loading.hide()
      }
    },

    confirmUpdate(serviceId: string | number) {
      Dialog.create({
        component: DeleteAlert,
        componentProps: {
          icon: 'save',
          title: 'Actualizar Contenido',
          subtitle: 'Confirma tu acción',
          question: '¿Deseas actualizar el contenido de este servicio?',
          button: 'Actualizar',
        },
      }).onOk(() => this.updateContent(serviceId))
    },

    async updateContent(serviceId: string | number) {
      Loading.show()
      try {
        const response = await CatServicioContenidoServices.update(serviceId, this.form)
        if (response.data.success) {
          Notify.create({ type: 'positive', message: 'Éxito', caption: 'El contenido se actualizó correctamente.' })
        }
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 422) {
          Notify.create({ type: 'warning', message: '', caption: 'Ya existe un registro similar, favor de verificar' })
        } else {
          genericErrorNotify()
        }
      } finally {
        Loading.hide()
      }
    },
  },
})

<template>
  <header-section :title="pageTitle" url-redirect="IndexServicios" :icon-image="iconModule">
    <template v-slot:buttons>
      <!-- En mobile este botón se oculta aquí y se repite más abajo, después
           del campo Contenido (mismo handler openSliderManager, no hay
           lógica duplicada, solo cambia dónde se pinta según el viewport). -->
      <q-btn
        v-if="$q.screen.gt.xs"
        outline
        size="12px"
        color="primary"
        icon="view_carousel"
        label="Administrar slider"
        @click="openSliderManager"
      />
    </template>
  </header-section>
  <br />

  <div class="q-pa-md contenido-page">
    <q-form ref="myForm" @submit.prevent="attemptUpdate" class="q-gutter-md">
      <div class="row q-col-gutter-xs">
        <div class="col-12 q-pa-md">
          <h5>
            <q-btn round color="orange" text-color="grey-9">
              <q-avatar size="24px">
                <q-icon name="article" size="16px" />
              </q-avatar>
            </q-btn>
            Contenido público del servicio
          </h5>
        </div>

        <div class="col-12 col-sm-6 q-pa-md">
          <label style="font-weight: bold">Título *</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Título"
            v-model="contentStore.form.title"
            v-max="100"
            :rules="[isRequired]"
          />
        </div>

        <div class="col-12 col-sm-6 q-pa-md">
          <label style="font-weight: bold">Subtítulo *</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Subtítulo"
            v-model="contentStore.form.subtitle"
            v-max="150"
            :rules="[isRequired]"
          />
        </div>

        <div class="col-12 q-pa-md">
          <label style="font-weight: bold">Descripción *</label>
          <q-editor
            ref="myDescriptionEditor"
            v-model="contentStore.form.description"
            v-max1000="1000"
            :dense="true"
            :error="descriptionError"
            error-message="Este campo es obligatorio"
            :definitions="{}"
            :toolbar="editorToolbar"
            class="responsive-editor"
          />
        </div>

        <div class="col-12 q-pa-md">
          <q-separator class="q-mb-md" />
          <label style="font-weight: bold">Contenido *</label>
          <q-editor
            ref="myEditor"
            v-model="contentStore.form.content"
            v-max1000="1000"
            :dense="true"
            :error="contentError"
            error-message="Este campo es obligatorio"
            :definitions="{}"
            :toolbar="editorToolbar"
            class="responsive-editor"
          />
        </div>

        <!-- Mismo botón/handler que el de la cabecera: en mobile ($q.screen.xs)
             se muestra aquí, después de Contenido, en vez de arriba. -->
        <div class="col-12 q-pa-md" v-if="$q.screen.xs">
          <q-btn
            outline
            color="primary"
            icon="view_carousel"
            label="Administrar slider"
            class="full-width mobile-slider-btn"
            @click="openSliderManager"
          />
        </div>

        <div class="col-12 q-pt-xs">
          <div class="row justify-end">
            <div class="col-12 col-sm-7">
              <q-btn-group spread>
                <q-btn outline color="red" label="Cancelar" @click="onCancel" />
                <q-btn outline type="submit" color="primary" label="Actualizar" />
              </q-btn-group>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </div>

  <!-- ===== Administración de items del slider ===== -->
  <q-dialog
    v-model="sliderStore.showManager"
    persistent
    transition-show="scale"
    :maximized="$q.screen.xs"
  >
    <q-card class="slider-manager-card">
      <q-card-section class="servicio-modal-header text-white row items-center justify-between">
        <div class="row items-center">
          <q-icon name="view_carousel" size="28px" class="q-mr-sm" />
          <div class="text-h6">Items del slider</div>
        </div>
        <q-btn flat round dense icon="close" text-color="white" @click="sliderStore.closeManager()" />
      </q-card-section>

      <q-card-section>
        <div class="row justify-end q-mb-sm slider-new-item-row">
          <q-btn
            outline
            size="12px"
            color="primary"
            icon="fa-solid fa-plus"
            label="Nuevo item"
            @click="sliderStore.newRegister()"
          />
        </div>

        <q-table
          :rows="sliderStore.registers"
          :columns="sliderColumns"
          separator="cell"
          no-data-label="No hay datos"
          dense
          rows-per-page-label="Registros por página"
          :pagination-label="
            (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
          "
          flat
          bordered
          v-model:pagination="sliderStore.pagination"
          :rows-per-page-options="[5, 10, 20, 50, 100]"
          @request="sliderStore.getRegisters"
          row-key="id"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <b>{{ col.label }}</b>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td style="text-align: center">
                <q-img
                  v-if="props.row.image?.path"
                  :src="mediaUrl(props.row.image.path)"
                  style="width: 60px; height: 40px"
                  fit="cover"
                />
                <span v-else class="text-grey">Sin imagen</span>
              </q-td>
              <q-td>{{ props.row.title }}</q-td>
              <q-td>
                <div class="slider-description-cell" v-html="props.row.description"></div>
              </q-td>
              <q-td style="text-align: center">{{ props.row.sort_order }}</q-td>
              <q-td>
                <q-chip square dense :color="props.row.active ? 'positive' : 'grey-6'" text-color="white">
                  {{ props.row.active ? 'Activo' : 'Inactivo' }}
                </q-chip>
              </q-td>
              <q-td v-if="$q.screen.gt.sm">{{ date.formatDate(props.row.created_at, 'DD-MM-YYYY HH:mm:ss') }}</q-td>
              <q-td v-if="$q.screen.gt.sm">{{ date.formatDate(props.row.updated_at, 'DD-MM-YYYY HH:mm:ss') }}</q-td>
              <q-td>
                <div class="flex justify-center">
                  <q-btn-group>
                    <q-btn color="positive" size="sm" icon="edit" @click="sliderStore.editRegister(props.row)">
                      <q-tooltip anchor="top middle" self="center middle">Editar</q-tooltip>
                    </q-btn>
                    <q-btn color="negative" size="sm" icon="delete" @click="sliderStore.confirmRemove(props.row)">
                      <q-tooltip anchor="top middle" self="center middle">Eliminar</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- ===== Formulario de item del slider (crear/editar) ===== -->
  <q-dialog
    v-model="sliderStore.showModal"
    persistent
    transition-show="scale"
    :maximized="$q.screen.xs"
  >
    <q-card class="slider-form-card">
      <q-card-section class="servicio-modal-header text-white">
        <q-icon name="view_carousel" size="26px" class="q-mr-sm" />
        <div class="text-h6">{{ sliderStore.title }}</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-form ref="sliderForm" class="q-gutter-md" @submit.prevent="attemptSaveSliderItem">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <label style="font-weight: bold">Título *</label>
              <q-input outlined clearable dense v-model="sliderStore.form.title" v-max="255" :rules="[isRequired]" />
            </div>

            <div class="col-12">
              <label style="font-weight: bold">Descripción</label>
              <q-editor
                v-model="sliderStore.form.description"
                :dense="true"
                :definitions="{}"
                :toolbar="editorToolbar"
                class="responsive-editor"
              />
            </div>

            <div class="col-12 col-sm-6">
              <label style="font-weight: bold">Orden *</label>
              <q-input
                outlined
                clearable
                dense
                type="number"
                v-model.number="sliderStore.form.sort_order"
                :rules="[isRequired, isIntegerOrder]"
              />
            </div>

            <div class="col-12 col-sm-6 flex items-center">
              <q-toggle v-model="sliderStore.form.active" label="Activo" />
            </div>

            <div class="col-12">
              <label style="font-weight: bold">Imagen</label>

              <div class="slider-image-preview q-mb-sm">
                <q-img
                  v-if="sliderImagePreview"
                  :src="sliderImagePreview"
                  fit="contain"
                  style="width: 100%; height: 100%"
                />
                <div v-else class="slider-image-placeholder">
                  <q-icon name="image" size="48px" color="grey-6" />
                  <div class="text-caption text-grey-7 q-mt-xs">Sin imagen</div>
                </div>
              </div>

              <div class="text-center q-mb-sm">
                <div v-if="sliderStore.form.image" class="text-caption text-positive">
                  Nueva imagen lista para guardar: {{ sliderStore.form.image.fileName }}
                </div>
                <div v-else-if="sliderStore.currentImage?.path" class="text-caption text-grey-7">
                  Imagen actual — selecciona un archivo para reemplazarla
                </div>
              </div>

              <UploadFileChuncks
                @success-file="sliderStore.onImageUploaded"
                :max_allowed_size_mb="3"
                :size_chunks_mb="2"
                type_file_front=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG"
                :type_file_back_system="12"
                save_storage_folder="servicios/slider"
                save_storage_cunks_folder="servicios/sliderChunks"
                url="upload/file-chunks"
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <q-btn-group spread>
            <q-btn outline color="red" class="full-width" label="Cancelar" @click="sliderStore.showModal = false" />
            <q-btn
              outline
              type="submit"
              color="primary"
              class="full-width"
              :label="sliderStore.form.action === 1 ? 'Guardar' : 'Actualizar'"
            />
          </q-btn-group>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { date, useQuasar } from 'quasar'
import type { QForm, QTableColumn } from 'quasar'
import HeaderSection from 'components/HeaderSection.vue'
import UploadFileChuncks from 'src/components/UploadFileChuncks.vue'
import { useCatServiciosStore } from 'src/stores/CatServicios'
import { useCatServicioContenidoStore } from 'src/stores/CatServicioContenido'
import { useCatServicioSliderItemStore } from 'src/stores/CatServicioSliderItem'
import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png'
import type { ServiceSliderItemRecord } from 'src/interfaces/serviceSliderItem'

const iconModule = ref(imageRoute)
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const store = useCatServiciosStore()
const contentStore = useCatServicioContenidoStore()
const sliderStore = useCatServicioSliderItemStore()

const myForm = ref<QForm | null>(null)
const sliderForm = ref<QForm | null>(null)

// Misma configuración de toolbar para ambos QEditor (Descripción y Contenido)
const editorToolbar = [
  ['left', 'center', 'right', 'justify'],
  ['bold', 'italic', 'strike', 'underline'],
  ['token', 'hr', 'link'],
  ['unordered', 'ordered'],
  ['quote', 'fullscreen'],
]

// Fuente de verdad: el hash_id en la URL, no el store de Pinia (que no
// persiste entre recargas). Así F5 / abrir la URL directa reconstruye el
// contexto consultando la API en vez de depender de navegación previa.
const serviceId = computed(() => (route.params.hash_id as string) || null)

const pageTitle = computed(() => {
  const name = store.selectedService?.title ?? ''
  return `SERVICIOS / CONTENIDO / ${name}`
})

const isEditorEmpty = (html: string) => (html || '').replace(/<br\s*\/?>/gi, '').trim() === ''

const descriptionError = computed(() => isEditorEmpty(contentStore.form.description))
const contentError = computed(() => isEditorEmpty(contentStore.form.content))

const attemptUpdate = async () => {
  const valid = await myForm.value?.validate()
  if (!valid || descriptionError.value || contentError.value || serviceId.value === null) return
  contentStore.confirmUpdate(serviceId.value)
}

const onCancel = () => {
  router.back()
}

// ===== Items del slider =====
// Columnas de fecha ocultas en mobile ($q.screen.gt.sm === false) para evitar
// que la tabla fuerce scroll horizontal excesivo en pantallas chicas; el
// v-if de los <q-td> de fecha en el body debe reflejar la misma condición.
const sliderColumns = computed<QTableColumn<ServiceSliderItemRecord>[]>(() => {
  const cols: QTableColumn<ServiceSliderItemRecord>[] = [
    { name: 'image', align: 'center', label: 'Imagen', field: (row) => row.image, headerStyle: 'width: 90px' },
    { name: 'title', align: 'left', label: 'Título', field: (row) => row.title },
    { name: 'description', align: 'left', label: 'Descripción', field: (row) => row.description },
    { name: 'sort_order', align: 'center', label: 'Orden', field: (row) => row.sort_order, sortable: true, headerStyle: 'width: 80px' },
    { name: 'active', align: 'left', label: 'Estado', field: (row) => row.active, headerStyle: 'width: 90px' },
  ]

  if ($q.screen.gt.sm) {
    cols.push(
      { name: 'created_at', align: 'left', label: 'Fecha creación', field: (row) => row.created_at, headerStyle: 'width: 130px' },
      { name: 'updated_at', align: 'left', label: 'Fecha actualización', field: (row) => row.updated_at, headerStyle: 'width: 130px' }
    )
  }

  cols.push({ name: 'actions', align: 'center', label: 'Acciones', field: () => '', headerStyle: 'width: 100px' })

  return cols
})

const mediaUrl = (path: string) => `${process.env.API_URL}${path}`

const sliderImagePreview = computed(() => {
  if (sliderStore.form.image?.path) return mediaUrl(sliderStore.form.image.path)
  if (sliderStore.currentImage?.path) return mediaUrl(sliderStore.currentImage.path)
  return null
})

const isIntegerOrder = (val: number) => Number.isInteger(val) || 'Debe ser un número entero'

const openSliderManager = () => {
  if (serviceId.value === null) return
  sliderStore.openManager(serviceId.value)
}

const attemptSaveSliderItem = async () => {
  const valid = await sliderForm.value?.validate()
  if (!valid) return
  if (sliderStore.form.action === 1) {
    sliderStore.onSubmit()
  } else {
    sliderStore.onUpdate()
  }
}

onMounted(async () => {
  if (serviceId.value === null) {
    router.push({ name: 'IndexServicios' })
    return
  }

  const currentMatches =
    store.selectedService?.hash_id === serviceId.value || String(store.selectedService?.id) === serviceId.value

  if (!currentMatches) {
    const loaded = await store.loadServiceByHashId(serviceId.value)
    if (!loaded) {
      router.push({ name: 'IndexServicios' })
      return
    }
  }

  contentStore.loadContent(serviceId.value)
})
</script>

<style scoped>
.title {
  font-weight: bold;
  background: #10312b;
  color: white;
  padding: 5px;
  font-size: 20px;
}

.servicio-modal-header {
  background: linear-gradient(to bottom, #611232, #9b2247);
  display: flex;
  align-items: center;
  padding: 16px 20px;
}

.slider-description-cell {
  max-width: 320px;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slider-image-preview {
  width: 100%;
  height: 260px;
  border-radius: 12px;
  background: #f5f5f5;
  border: 1px dashed #c9c9c9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slider-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== Responsive ===== */

.contenido-page {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.responsive-editor {
  width: 100%;
  max-width: 100%;
}

.responsive-editor :deep(.q-editor__toolbar) {
  flex-wrap: wrap;
  height: auto;
}

.responsive-editor :deep(.q-editor__content) {
  max-width: 100%;
  overflow-x: auto;
}

.mobile-slider-btn {
  min-height: 44px;
}

.slider-manager-card {
  width: 1100px;
  max-width: 95vw;
}

.slider-form-card {
  width: 700px;
  max-width: 90vw;
}

@media (max-width: 599px) {
  .slider-new-item-row {
    justify-content: center;
  }

  .slider-new-item-row .q-btn {
    width: 100%;
  }

  .slider-image-preview {
    height: 180px;
  }

  /* :maximized en el q-dialog fuerza width/height:100% en la tarjeta, pero
     nuestro max-width fijo (95vw/90vw, pensado para desktop) seguía
     ganándole y dejaba el diálogo angosto con márgenes grises a los lados. */
  .slider-manager-card,
  .slider-form-card {
    max-width: 100vw;
  }
}
</style>

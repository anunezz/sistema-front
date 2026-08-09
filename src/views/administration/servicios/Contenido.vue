<template>
  <header-section :title="pageTitle" url-redirect="IndexServicios" :icon-image="iconModule" />
  <br />

  <div class="q-pa-md">
    <q-form ref="myForm" @submit.prevent="attemptUpdate" class="q-gutter-md">
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn round color="orange" text-color="grey-9">
              <q-avatar size="24px">
                <q-icon name="article" size="16px" />
              </q-avatar>
            </q-btn>
            Contenido público del servicio
          </h5>
        </div>

        <div class="col-md-6 q-pa-md">
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

        <div class="col-md-6 q-pa-md">
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

        <div class="col-md-12 q-pa-md">
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
          />
        </div>

        <div class="col-md-12 q-pa-md">
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
          />
        </div>

        <div class="col-12 q-pt-xs">
          <div class="row justify-end">
            <div class="col-12 col-sm-7">
              <q-btn-group class="full-width">
                <q-btn outline color="red" class="full-width" label="Cancelar" @click="onCancel" />
                <q-btn outline type="submit" color="primary" class="full-width" label="Actualizar" />
              </q-btn-group>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { QForm } from 'quasar'
import HeaderSection from 'components/HeaderSection.vue'
import { useCatServiciosStore } from 'src/stores/CatServicios'
import { useCatServicioContenidoStore } from 'src/stores/CatServicioContenido'
import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png'

const iconModule = ref(imageRoute)
const router = useRouter()
const store = useCatServiciosStore()
const contentStore = useCatServicioContenidoStore()

const myForm = ref<QForm | null>(null)

// Misma configuración de toolbar para ambos QEditor (Descripción y Contenido)
const editorToolbar = [
  ['left', 'center', 'right', 'justify'],
  ['bold', 'italic', 'strike', 'underline'],
  ['token', 'hr', 'link'],
  ['unordered', 'ordered'],
  ['quote', 'fullscreen'],
]

const serviceId = computed(() => store.selectedService?.hash_id ?? store.selectedService?.id ?? null)

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

onMounted(() => {
  if (serviceId.value !== null) {
    contentStore.loadContent(serviceId.value)
  }
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
</style>

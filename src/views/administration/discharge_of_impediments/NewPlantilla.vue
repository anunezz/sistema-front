<template>
  <header-section :title="title" :icon-image="iconModule" url-redirect="InboxPlantillas"/>
  <br>

  <q-dialog v-model="dialog" persistent>
  <q-card style="width: 500px; max-width: 90vw;">
    <!-- Título -->
    <q-card-section>
      <div class="text-h6 text-primary">{{ title }}</div>
    </q-card-section>

    <!-- Mensaje -->
    <q-card-section>
      <div class="text-subtitle1">
        <q-icon name="help_outline" color="primary" class="q-mr-sm" />
        <span v-html="message"></span>
      </div>
    </q-card-section>

    <!-- Botones -->
    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="negative" @click="dialog = false" />
      <q-btn :label="label_btn" @click="actionForm" color="positive" icon="save" />
    </q-card-actions>
  </q-card>
</q-dialog>


  <div class="q-pa-md">
    <q-form
    ref="myForm"
      class="q-gutter-md"
    >
      <div class="row q-col-gutter-xs">
        <div :class="`col-md-6 q-pa-md`" >
          <label for='id_impediment' style='font-weight: bold;'>Causal *</label>
          <q-select
            @update:model-value="onChangeCausal"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_causal_impedimento'
            :options='options.cat_causal_impedimento'
            option-value='id_causal_impedimento'
            option-label='causal_impedimento'
            label='Causal'
            :rules="[isRequired]"
            clearable
            :disable="esEdicion"
            />

        </div>
      <div :class="`col-md-6 q-pa-md`" >
          <label for='id_impediment' style='font-weight: bold;'>Subcausal *</label>
          <q-select
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_subcausal_impedimento'
            :options='subcausalOptions'
            option-value='id_subcausal_impedimento'
            option-label='subcausal_impedimento'
            label='Nombre de la plantilla'
            :rules="[isRequired]"
            clearable
            :disable="esEdicion" />
        </div>
        <q-separator/>
      <q-card class="fit" >
          <div class="flex justify-between q-pa-md">
            <label for='id_impediment' style='font-weight: bold;'>*</label>
      <q-btn
      icon="refresh"
      color="red"
      text-color="white"
      round

      @click="confirmClear">
      <q-tooltip anchor="top middle" self="center middle">
        Limpiar contenido
      </q-tooltip>
    </q-btn>
          </div>
          <q-editor
            ref="myEditor"
            v-model="plantilla"
            label="Plantilla"
            :dense="true"
			v-max1000="500"
            :error="plantillaError"
            :error-message="'Este campo es obligatorio'"
            :definitions="{}"
            :toolbar="[
            ['left', 'center', 'right', 'justify'],
            ['bold', 'italic', 'strike', 'underline'],
            ['token', 'hr', 'link'],
            ['unordered', 'ordered'],
            ['quote', 'fullscreen']
            ]"

          />
        </q-card>

        <div class="col-12 q-pt-xs">
          <div class="row justify-end" >
            <div class="col-5 q-pt-xs">
              <q-btn-group class="full-width">
                <q-btn
                  outline
                  color="red"
                  class="full-width"
                  @click="$router.push({name:'InboxPlantillas'})"
                  label="Cancelar">
                </q-btn>
                <q-btn
                  outline
				  :disable="disablePlantillaSave"
                  color="primary"
                  class="full-width"
                  :label="'Guardar'"
                  @click="validarFormulario">
                </q-btn>
              </q-btn-group>

            </div>
          </div>
        </div>

      </div>
    </q-form>
  </div>

</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue';
import { useQuasar } from 'quasar';
// import {ref,onMounted,computed} from "vue";
// import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
// import {useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import { useRoute } from 'vue-router'
// import {useAuthUserStore} from "stores/AuthUser";
// import useNotify from "src/composables/useNotify";

import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png';
import PlantillaService from 'src/services/administration/PlantillaService';
import { onMounted, ref,computed, nextTick, watch } from 'vue';
import useImpedimentForm from 'src/composables/useImpedimentForm';
const iconModule = ref(imageRoute);

const router = useRouter();
const route = useRoute()

const {
  form,
  options,
get_cats,
onChangeCausal,
} = useImpedimentForm()

const esEdicion = ref(false)
const idPlantilla = ref(null)
// const $q = useQuasar();
// const store = useAuthUserStore()
// const {showError} = useNotify()


// const action = computed(() => {
//   return ( router.currentRoute.value.params.hash_id == undefined ? "Nuevo" : "Editar" );
// });

const title = ref(null);
const message = ref(null);
const dialog = ref(false);
const label_btn = ref(false);

const $q = useQuasar()
const plantilla = ref('')
const plantillaError = ref(false)

const myEditor = ref(null)


const newRegister = () => {
  const data = {
    plantilla: plantilla.value,
    id_subcausal_impedimento: form.value.id_subcausal_impedimento,
    id_causal_impedimento: form.value.id_causal_impedimento
  }
    PlantillaService.store(data).then(() => {
            router.push({ name: 'InboxPlantillas' });
            $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Correcto. Se actualizó el texto de respuesta de verificación'
          });
    }).catch( error => {
      if (error.response) {
      if (error.response.status === 422) {

        $q.notify({
          type: 'negative',
          message: error.response.data.error,
          position: 'top',
          timeout: 3000,
          icon: 'warning'
        });
      } else {
      $q.notify({
          type: 'negative',
          message: 'Ocurrió un error inesperado.',
          position: 'top',
          timeout: 3000,
          icon: 'error'
        });
      }
    } else {
      $q.notify({
        type: 'negative',
        message: 'Error de conexión o inesperado.',
        position: 'top',
        timeout: 3000,
        icon: 'wifi_off'
      });
    }
    })

}

function actualizarPlantilla() {
  const data = {
    plantilla: plantilla.value,
    id_subcausal_impedimento: form.value.id_subcausal_impedimento,
  }

  PlantillaService.update(idPlantilla.value, data).then((response) => {
    if(response.data.success) {
      $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Correcto. Se actualizó el texto de respuesta de verificación'
      });
      router.push({ name: 'InboxPlantillas' });
    }
  }).catch(error => {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar la plantilla',
    })
  })
}


function validarFormulario () {
  // Elimina las etiquetas HTML y espacios
  const contenidoLimpio = plantilla.value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim()
  plantillaError.value = contenidoLimpio === ''

  if (plantillaError.value) {
    console.log('El contenido del editor está vacío')
    return false
  }

  if (esEdicion.value) {
    actualizarPlantilla()
  } else {
    newRegister()
  }
}

function confirmClear() {
  if(plantilla.value) {
    $q.dialog({
      title: 'Confirmar',
      message: '¿Deseas limpiar el contenido?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      plantilla.value = ''
    })
  }
}

const disablePlantillaSave = computed(() => {
	let aux = false;
	if( plantilla.value == '' || !plantilla.value ){
		return true;
	}

	if( form.value.id_subcausal_impedimento == null || form.value.id_subcausal_impedimento == '' ){
		return true;
	}

	if( form.value.id_causal_impedimento == null || form.value.id_causal_impedimento == '' ){
		return true;
	}

	return aux;
});

async function cargarPlantilla(id) {
  try {

    const { data } = await PlantillaService.getPlantillaById(id)
    const p = data?.Results?.Plantilla ?? {}

    if (!options.value.cat_causal_impedimento?.length) {
      await get_cats()
    }

    const causalId = Number(
      p?.cat_subcausal?.cat_causal_impedimento?.id_causal_impedimento ??
      p?.id_causal_impedimento
    )

    const subcausalId = Number(
      p?.cat_subcausal?.id_subcausal_impedimento ??
      p?.id_subcausal_impedimento
    )

    // 1️⃣ asignar causal
    form.value.id_causal_impedimento = causalId

    // 2️⃣ esperar a que Vue procese el computed
    await nextTick()

    // 3️⃣ esperar a que existan subcausales filtradas
    let tries = 0
    while (subcausalOptions.value.length === 0 && tries < 10) {
      await new Promise(r => setTimeout(r, 50))
      tries++
    }

    // 4️⃣ ahora asignar subcausal
    form.value.id_subcausal_impedimento = subcausalId

    plantilla.value = p.plantilla ?? ''
    title.value = 'Editar Plantilla'
    label_btn.value = 'Actualizar'

  } catch (error) {

    console.error('Error al cargar la plantilla', error)

    $q.notify({
      type: 'negative',
      message: 'No se pudo cargar la plantilla.'
    })

  }
}
const subcausalOptions = computed(() => {

  const causalId = Number(form.value.id_causal_impedimento)
  const currentSubcausal = Number(form.value.id_subcausal_impedimento)

  if (!options.value.cat_subcausal_impedimento) return []

  return options.value.cat_subcausal_impedimento.filter(o =>
    Number(o.id_causal_impedimento) === causalId &&
    (
      o.cat_plantilla === null ||
      Number(o.id_subcausal_impedimento) === currentSubcausal
    )
  )
})


watch(subcausalOptions, (list) => {
  const id = Number(form.value.id_subcausal_impedimento);
  if (id && !list.some(o => Number(o.id_subcausal_impedimento) === id)) {
    form.value.id_subcausal_impedimento = null;
  }
});

watch(plantilla, val => {
  if (val == "<br>") {
    plantilla.value = ''
  }
})

onMounted(() => {
  get_cats()

  idPlantilla.value = route.params.id || route.query.id
  if (idPlantilla.value) {
    esEdicion.value = true
    cargarPlantilla(idPlantilla.value)
  } else {
    title.value = 'Nueva Plantilla'
    label_btn.value = 'Guardar'
  }
})
</script>


<style scoped>

.table-bordered, .table-bordered th, .table-bordered td {
  border: 1px solid #ccc;
  border-collapse: collapse;
}

thead tr:first-child th {
  background-color: #6F7271;
  color: white;
}

.cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
}

.title{
  font-weight: bold;
  background: #10312B;
  color: white;
  padding: 5px;
  font-size: 20px;
}

</style>

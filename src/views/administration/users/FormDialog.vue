<template>
    <div>
        <h1>{{ showDialog }}</h1>
        <q-dialog v-model="showDialog">
            <q-card style="min-width: 800px;min-height: 400px;">
                <q-card-section style="background-color: #C39326;" class="text-white">
                    <div class="text-h6"><i class="fas fa-user-plus"></i> Nuevo / Editar Usuario</div>
                </q-card-section>

                <q-card-section>
                    <div class="q-pa-md">

                        <q-form @submit="onSubmit" @reset="onReset">
                            <div class="row">
                                <div class="col-6 q-pa-md">
                                    <q-input outlined v-model="formUser.name" label="Nombre (s)" counter
                                        maxlength="30" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input outlined v-model="formUser.surname" label="Apellido paterno" counter
                                        maxlength="30" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input outlined v-model="formUser.secondsurname" label="Apellido materno" counter
                                        maxlength="30" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input outlined v-model="formUser.acronym" label="Acrónimo" counter
                                        maxlength="30" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-select outlined v-model="formUser.profile_id" :options="options"
                                        label="Tipo de perfil" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-select outlined v-model="formUser.pemissions" :options="options"
                                        label="Permisos de usuario" />
                                </div>
                            </div>
                        </q-form>
                    </div>
                </q-card-section>

                <q-card-actions>
                    <div class="q-pa-md" style="width: 100%;">
                        <div class="row">
                            <div class="col-6 q-pa-md">
                                <q-btn size="lg" label="Cancel" class="full-width" @click="closeDialog" v-close-popup />
                            </div>
                            <div class="col-6 q-pa-md">
                                <q-btn size="lg" type="submit" label="Guardar" class="full-width" icon="fas fa-save" v-close-popup style="background: #00A982;color:white;" />
                            </div>
                        </div>
                    </div>
                </q-card-actions>
            </q-card>
            <!-- <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
        <q-header class="bg-primary">
          <q-toolbar style="background-color: #C39326;" class="text-white">
            <q-toolbar-title><i class="fas fa-user-plus"></i> Nuevo / Editar Usuario</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" @click="closeDialog" />
            <div class="q-pa-md">
              <div class="q-gutter-md" style="max-width: 300px">
                <q-input outlined v-model="text" label="Outlined" />
              </div>
            </div>
          </q-toolbar>
        </q-header>
        <q-footer class="bg-black text-white">
         <! --  <q-toolbar>
            <q-toolbar-title>Footer</q-toolbar-title>
          </q-toolbar> -->
            <!--</q-footer>

        <q-page-container>
          <q-page padding>
            <p v-for="n in contentSize" :key="n">
              {{ lorem }}
            </p>
          </q-page>
        </q-page-container>
      </q-layout> -->
        </q-dialog>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from "quasar";
import useNotify from "src/composables/useNotify";

import UserServices from "src/services/administration/UserServices";

const $q = useQuasar();
const { showError, showSuccess } = useNotify()

//const moreContent = ref();
//const contentSize= computed(() => moreContent.value ? 150 : 5);


const props = defineProps({ isVisibleForm: { type: Boolean, required: true, default: false } });
//let showDialog=ref(false);
console.log(props.isVisibleForm);
//const showDialog=ref(props.isVisibleForm);

let emit = defineEmits(['update:isVisibleForm']);
const showDialog = computed({
    get: () => props.isVisibleForm,
    set: (val) => emit('update:isVisibleForm', val)
});

function closeDialog() {
    emit('update:isVisibleForm', false);
    //showDialog.value = false
}

const formUser = ref({
    name: null,
    surname: null,
    secondsurname: null,
    acronym: null,
    profile_id: null,
    permissions: []
})

const onSubmit = (() => {
  formUser.value.validate().then(success => {
      if (success) {
        	UserServices.store(formUser).then(response => {
		console.log(response)
		$q.loading.hide()
		showSuccess(
			'Éxito',
			'Se eliminó el registro.'
		)
		//getRegisters()
	}).catch(error => {
		$q.loading.hide()
		console.log(error)
		showError(
			'Error',
			'Intente nuevamente.'
		)
	})
      }
      else {
        // oh no, user has filled in
        // at least one invalid value
      }
			/*console.log('SUBMIT')
			api.post('paciente',
				toRaw(formPatients.value)
			).then(response => {
				console.log(response);

				if (response.data.message) {
					$q.notify({
						color: 'green-4',
						textColor: 'white',
						icon: 'cloud_done',
						message: response.data.message
					})

					//router.push({ name: 'patientIndex' });
				}
			})*/
    })
		})
/* function onSubmit() {
    if (accept.value !== true) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'You need to accept the license and terms first'
      })
    }
    else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
      })
    }
} */

function onReset() {
    //name.value = null
    //age.value = null
    // accept.value = false
}


/*import { ref, computed } from 'vue'

  setup () {
    const moreContent = ref(true)

    return {
      showDialog: ref(true),

      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!'
    }
  }
} */

</script>

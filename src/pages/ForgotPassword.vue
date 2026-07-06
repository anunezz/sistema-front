<template>
  <q-header elevated style="background: #691C32;height: 47px">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-img class="avatar" src="~assets/img/login/logoSRE.png" style="width: 300px;"/> -->
        </q-toolbar-title>

      </q-toolbar>
    </q-header>
<q-page padding class="flex justify-center items-center">
  <div style="max-width: 1000px; width: 100%;">
    <q-card class="column q-pa-lg" style="width:100;">
      <div class="row q-pa-xl">
		  <q-img src="~assets/img/login/logo_reset_password.png" style="width: 150px;"/>
        <div class="column items-center justify-center q-pl-xl">
          <h3 class="text-weight-bold" style="margin-bottom: 30px; margin: 0; font-size: 25px;">SISTEMA</h3>
          <h4 style="max-width: 210px; margin: 0; padding:0; font-size: 15px;">
            Sistema DEMO
          </h4>
        </div>
      </div>

      <q-form @submit.prevent="submit">
        <q-input v-model="email" label="Correo electrónico" type="email" required outlined >
          <template v-slot:prepend>
          <q-icon name="email" />
        </template>
        </q-input>
        <div class="flex items-center justify-center q-pt-lg" v-if="message">{{ message }}</div>
        <br />
      <div class="flex justify-end q-mt-lg" style="width:100%;">
          <q-btn style="background-color:#c39326; color:white;" class="q-px-xl q-py-sm" label="RECUPERAR CONTRASEÑA" icon="lock" stack type="submit" />
      </div>
      <div class="flex items-center justify-center q-mt-xl text-primary">
        <p  @click="$router.push({ path: '/ingresar' })" class="cursor-pointer">Iniciar sesión</p>
      </div>
      <div class="flex items-center justify-center q-mt-xl text-dark">
        <p>©2025 - SISTEMA.</p>
      </div>
      </q-form>

    </q-card>
  </div>
</q-page>

</template>

<script setup>
import { ref } from 'vue'
import { axiosInstance } from 'src/boot/axios';
const email = ref('')
const message = ref('')
const error = ref('')
const submit = async () => {
  try {
    const res = await axiosInstance.post('/forgot_password', { email: email.value })

	if( res.data.success ){
		message.value = res.data.aux ? 'Se envio un correo electronico para restablecer las credenciales.' : 'Error el correo electronico no existe.'
	}

	//message.value = res.data.message
  } catch (err) {
    message.value = 'Ocurrió un error.'
    error.value = err
  }
}
</script>

<style>

</style>

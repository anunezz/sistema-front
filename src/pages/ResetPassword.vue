<template>
    <q-header elevated style="background: #691C32;height: 47px">
      <q-toolbar>
        <q-toolbar-title>
          <q-img class="avatar" src="~assets/img/login/logoSRE.png" style="width: 300px;"/>
        </q-toolbar-title>
        
      </q-toolbar>
    </q-header>
  <q-page padding class="flex justify-center items-center">
  <div style="max-width: 1000px; width: 100%;">
    <q-card class="column q-pa-lg" style="width:100;">
      <div class="row q-pa-xl">
          <q-img src="~assets/img/login/logo_reset_password.png" style="width: 150px;"/>        <div class="column items-center justify-center q-pl-xl">
          <h3 class="text-weight-bold" style="margin-bottom: 30px; margin: 0; font-size: 25px;">SAIA</h3>
          <h4 style="max-width: 210px; margin: 0; padding:0; font-size: 15px;">
            Sistema de Impedimentos Administrativos y Judiciales
          </h4>
        </div>
      </div>

      <!-- <q-form @submit.prevent="submit">
        <q-input v-model="email" label="Correo electrónico" type="email" required outlined >
           <template v-slot:prepend>
          <q-icon name="email" />
        </template>
        </q-input>
        <br />
      <div class="flex justify-end q-mt-lg" style="width:100%;">
          <q-btn style="background-color:#c39326; color:white;" class="q-px-xl q-py-sm" label="RECUPERAR CONTRASEÑA" icon="lock" stack type="submit" />
      </div>
      <div class="flex items-center justify-center q-mt-xl text-primary">
        <p  @click="$router.push({ path: '/ingresar' })" class="cursor-pointer">INICIAR SESIÓN</p>
      </div>
      <div class="flex items-center justify-center q-mt-xl text-dark">
        <p>©2024 - Secretaría de Relaciones Exteriores.</p>
      </div>
      </q-form> -->
<q-form @submit.prevent="resetPassword">
      <q-input v-model="password" label="Nueva contraseña" type="password" required outlined class="q-my-lg" />
      <q-input v-model="passwordConfirmation" label="Confirmar contraseña" type="password" required outlined class="q-my-lg" />
      <div class="flex items-center justify-end">
        <q-btn style="background-color: #1e5b4f; color:white;" label="Actualizar contraseña" icon="refresh" type="submit" class="q-mt-sm"/>
      </div>
    </q-form>
      <div class="flex items-center justify-center q-pt-lg" v-if="message">{{ message }}</div>

      <div class="flex items-center justify-center q-mt-xl text-dark">
        <p>©2025 - Secretaría de Relaciones Exteriores.</p>
      </div>
    </q-card>
  </div>
</q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { axiosInstance } from 'src/boot/axios'

const route = useRoute()

const password = ref('')
const passwordConfirmation = ref('')
const message = ref('')
const token = ref('')
const email = ref('')
const error = ref('')
onMounted(() => {
  token.value = route.query.token
  email.value = route.query.email
})

const resetPassword = async () => {
  try {
    const response = await axiosInstance.post('/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    message.value = response.data.message
  } catch (err) {
    message.value = 'Ocurrió un error al restablecer la contraseña.'
    error.value = err
  }
}
</script>

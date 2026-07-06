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
          <q-img src="~assets/img/login/logo_reset_password.png" style="width: 150px;"/>        <div class="column items-center justify-center q-pl-xl">
          <h3 class="text-weight-bold" style="margin-bottom: 30px; margin: 0; font-size: 25px;">SISTEMA</h3>
          <h4 style="max-width: 210px; margin: 0; padding:0; font-size: 15px;">
            Sistema programa demo
          </h4>
        </div>
      </div>


	<div class="row justify-center">
	<div class="col-12">
		<q-card class="q-pa-lg shadow-2 rounded-borders">
			<q-form ref="formRef" @submit.prevent="resetPassword" v-if="aux" class="q-gutter-md">

				<div class="text-h6 text-center text-weight-bold q-mb-md">
				Actualizar contraseña
				</div>

				<q-input
					v-model="password"
					label="Nueva contraseña"
					type="password"
					outlined
					dense
					v-max="15"
					:rules="passwordRules"
					hint="Debe contener mayúscula, minúscula, número y símbolo"
  					lazy-rules
				/>

				<q-input
					v-model="passwordConfirmation"
					label="Confirmar contraseña"
					type="password"
					outlined
					dense
					v-max="15"
					:rules="confirmPasswordRules"
					hint="Debe contener mayúscula, minúscula, número y símbolo"
  					lazy-rules
				/>

				<!-- 🔥 CONTENEDOR DEL BOTÓN -->
				<div class="row justify-center">
				<div class="col-12">
					<q-btn
					label="Actualizar contraseña"
					icon="fa-solid fa-pen-to-square"
					type="submit"
					class="full-width q-mt-md"
					color="primary"
					unelevated
					no-caps
					/>
				</div>
				</div>
			</q-form>

				<!-- 🔥 iniciar sesion -->
				<div class="row justify-center q-gutter-xs">
					<div class="col-12">
						<q-btn
						label="Iniciar sesión"
						icon="fa-duotone fa-regular fa-user"
						@click="$router.push({ path: '/ingresar' })"
						class="full-width q-mt-md"
						color="secondary"
						unelevated
						no-caps
						/>
					</div>
					<!-- Mensaje -->
					<div class="col-12">
						<q-banner
							v-if="message && aux_succes"
							class="bg-green-7 text-white q-mt-md"
							rounded
						>
							<template v-slot:avatar>
								<q-icon name="check_circle" />
							</template>
							{{ message }}
						</q-banner>
					</div>
					<div class="col-12">
						<q-banner
							v-if="message && aux_error"
							class="bg-red-8 text-white q-mb-md"
							rounded>
						<template v-slot:avatar>
							<q-icon name="error" />
						</template>

						{{ message }}
						</q-banner>
					</div>
				</div>
		</q-card>
	</div>
	</div>

      <div class="flex items-center justify-center q-mt-xl text-dark" >
        <p>©{{ year }} - Sistema.</p>
      </div>
    </q-card>
  </div>
</q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { axiosInstance } from 'src/boot/axios'
import type { QForm } from 'quasar'

const route = useRoute()

// 🔥 Tipado
const formRef = ref<QForm | null>(null)
const password = ref<string>('')
const passwordConfirmation = ref<string>('')
const message = ref<string>('')
const token = ref<string | null>(null)
const error = ref<unknown>(null)
const aux = ref<Boolean>(false)
const aux_succes = ref<Boolean>(false)
const aux_error = ref<Boolean>(false)
const year = new Date().getFullYear()
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/

const passwordRules = [
  (val: string) => !!val || 'La contraseña es obligatoria',
  (val: string) => val.length >= 10 || 'Mínimo 10 caracteres',
  (val: string) =>
    passwordRegex.test(val) ||
    'Debe incluir mayúscula, minúscula, número y carácter especial'
]

const confirmPasswordRules = [
  (val: string) => !!val || 'Confirma tu contraseña',
  (val: string) =>
    val === password.value || 'Las contraseñas no coinciden'
]

interface interfaceValidateToken {
	success: boolean,
	message?: string | null,
	aux: boolean
}

const validateToken = async (): Promise<void> => {
	try {
		aux.value = false;
		aux_succes.value = false;
		aux_error.value = false;
		if (!token.value) {
			message.value = 'Link inválido o incompleto'
			aux_error.value = true;
			return
		}

		const response = await axiosInstance.post<interfaceValidateToken>('/validate_token', {
			token: token.value,
		})

		if( response.data.success ){
			message.value = response.data.message
			aux.value = response.data.aux;
			if( aux.value == true ){
				aux_error.value = false;
			}else{
				aux_succes.value = false;
				aux_error.value = true;
			}
		}else{
			message.value = response.data.message
			aux.value = false;
			aux_error.value = aux.value;
			aux.value = false;
		}
	} catch (err: unknown) {
		aux_error.value = true;
		message.value = 'Ocurrió un error al restablecer la contraseña.'
		error.value = err
	}
}


onMounted(() => {
  console.log(route, 'cambiando la contraseña:', route.params?.hash)
  const hash = route.params?.hash
  token.value = Array.isArray(hash) ? hash[0] : hash ?? null;
  validateToken();
})

// 🔥 Tipado de respuesta (opcional pero recomendado)
interface ResetResponse {
  success: boolean,
}

const resetPassword = async (): Promise<void> => {
  try {
    aux_succes.value = false
    aux_error.value = false

    const isValid = await formRef.value?.validate()

    if (!isValid) {
      message.value = 'Corrige los errores del formulario'
      aux_error.value = true
      return
    }

    if (!token.value) {
      message.value = 'Link inválido o incompleto'
      aux_error.value = true
      return
    }

    const response = await axiosInstance.post<ResetResponse>('/reset-password', {
      token: token.value,
      password: password.value
    })

    if (response.data.success) {
      message.value = "La contraseña se actualizó exitosamente, favor de iniciar sesión"
      aux_succes.value = true
      aux.value = false
    }

  } catch (err: unknown) {
    message.value = 'Ocurrió un error al restablecer la contraseña.'
    aux_error.value = true
    error.value = err
  }
}

</script>

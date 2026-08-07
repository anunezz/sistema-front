<template>
  <div class="login-page flex flex-center">
    <div class="login-shell row no-wrap">
      <!-- Panel institucional (branding) -->
      <div class="login-brand col-6 gt-sm column flex-center">
        <div class="login-brand-content text-center">
          <q-avatar size="96px" class="login-brand-avatar q-mb-lg">
            <q-icon name="fa-duotone fa-solid fa-shield-halved" size="52px" />
          </q-avatar>

          <div class="text-h3 text-weight-bold text-white letter-spacing-1">
            The Planet Studio
          </div>
          <q-badge
            outline
            color="white"
            text-color="white"
            :label="'v' + $q.config.versionApp"
            class="q-mt-sm q-px-sm"
          />

          <p class="text-subtitle1 text-white login-brand-subtitle q-mt-xl">
            THE PLANET STUDIO
          </p>

          <div class="login-brand-divider q-my-xl" />

          <p class="text-body2 login-brand-caption">
            Plataforma de gestión de citas y servicios de The Planet Studio, especializada en peluquería, estética y belleza profesional.
          </p>
        </div>
      </div>

      <!-- Panel de formulario -->
      <div class="login-form-panel col-12 col-sm-8 col-md-6 column flex-center">
        <q-card flat class="login-card">
          <q-card-section class="text-center lt-md q-pb-none">
            <div class="text-h5 text-weight-bold text-primary">
              The Planet Studio
              <q-badge
                outline
                color="primary"
                :label="'v' + $q.config.versionApp"
                class="q-ml-xs"
              />
            </div>
            <p class="text-caption text-grey-7 q-mb-none">The Planet Studio</p>
          </q-card-section>

          <q-card-section class="q-pt-lg">
            <div class="text-h5 text-weight-bold text-grey-9">
              Iniciar sesión
            </div>
            <p class="text-body2 text-grey-6 q-mb-lg">
              Ingresa tus credenciales para continuar
            </p>

            <q-form
              class="q-gutter-y-md"
              @submit="()=>{isPwd = true;login(loginForm)}"
            >
              <q-input
                outlined
                v-model="loginForm.username"
                label="Usuario"
                :rules="[isRequired]"
                hide-bottom-space
                class="login-input"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" color="primary" />
                </template>
              </q-input>

              <q-input
                outlined
                v-model="loginForm.password"
                :type="isPwd ? 'password' : 'text'"
                label="Contraseña"
                :rules="[isRequired]"
                hide-bottom-space
                class="login-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click.prevent="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-btn
                label="Iniciar sesión"
                icon="fa-duotone fa-regular fa-user"
                type="submit"
                color="primary"
                class="full-width q-mt-md login-submit-btn"
                unelevated
                rounded
                no-caps
                size="lg"
              />

              <div class="text-center q-mt-md">
                <span class="text-grey-7 text-body2">¿Olvidaste tu contraseña? </span>
                <q-btn
                  flat
                  dense
                  no-caps
                  padding="none"
                  label="Recuperar"
                  class="login-forgot-link text-negative text-weight-medium"
                  @click="$router.push({name:'ForgotPassword'})"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <div class="text-center text-grey-6 text-caption q-mt-xl login-footer">
          © {{ currentYear }} - The Planet Studio
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import useSession from "src/composables/useSession";

const currentYear = new Date().getFullYear()
const isPwd = ref(true)
const loginForm = reactive({
  username: '',
  password: ''
});

const { login } = useSession(loginForm)
</script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 0;
  overflow-x: hidden;
  background: linear-gradient(135deg, #7a0c1e 0%, #a11627 45%, #039B77 130%);
}

.login-shell {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  align-items: stretch;
  max-width: 100vw;
}

/* ---------- Panel institucional ---------- */
.login-brand {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #6d0a1a 0%, #9c1526 60%, #7a0c1e 100%);
  padding: 48px;
}

.login-brand::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.08) 0, transparent 40%),
    radial-gradient(circle at 85% 80%, rgba(3, 155, 119, 0.25) 0, transparent 45%);
  pointer-events: none;
}

.login-brand-content {
  position: relative;
  z-index: 1;
  max-width: 380px;
  animation: fadeInUp 0.6s ease both;
}

.login-brand-avatar {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.letter-spacing-1 {
  letter-spacing: 2px;
}

.login-brand-subtitle {
  opacity: 0.9;
}

.login-brand-divider {
  width: 56px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  margin-left: auto;
  margin-right: auto;
}

.login-brand-caption {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

/* ---------- Panel de formulario ---------- */
.login-form-panel {
  background: #f7f7fb;
  padding: 32px 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(20, 20, 40, 0.12);
  animation: fadeInUp 0.6s ease 0.1s both;
}

.login-input :deep(.q-field__control) {
  border-radius: 10px;
  min-height: 48px;
}

.login-submit-btn {
  font-weight: 600;
  letter-spacing: 0.3px;
  min-height: 48px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.login-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(3, 155, 119, 0.35);
}

.login-forgot-link {
  font-size: 0.875rem;
  text-decoration: underline;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- Responsive ---------- */

/* Tablets: equilibrado, panel de marca visible (gt-sm), formulario con buen aire */
@media (min-width: 768px) and (max-width: 1023px) {
  .login-brand {
    padding: 32px;
  }

  .login-form-panel {
    padding: 32px 24px;
  }

  .login-card {
    max-width: 440px;
  }
}

/* Móvil: panel de marca oculto (lt-md), formulario ocupa casi todo el ancho */
@media (max-width: 767px) {
  .login-page {
    padding: 0;
  }

  .login-shell {
    display: block;
  }

  .login-form-panel {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 20px 16px;
    box-sizing: border-box;
  }

  .login-card {
    max-width: 100%;
    border-radius: 14px;
    box-shadow: 0 10px 25px rgba(20, 20, 40, 0.1);
  }

  .login-input :deep(.q-field__native),
  .login-input :deep(.q-field__label) {
    font-size: 1rem;
  }

  .login-submit-btn {
    font-size: 1rem;
  }
}

/* Móvil horizontal: reducir alturas verticales para que todo entre en pantalla */
@media (max-width: 767px) and (orientation: landscape) {
  .login-form-panel {
    min-height: auto;
    padding: 16px;
  }

  .login-card {
    animation: none;
  }

  .login-footer {
    margin-top: 12px !important;
  }
}

@media (max-width: 359px) {
  .login-card :deep(.q-card__section) {
    padding: 12px;
  }
}
</style>

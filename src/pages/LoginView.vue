<template>
  <div class="login-page flex flex-center">
    <div class="login-shell row no-wrap">
      <!-- Panel institucional (branding) -->
      <div class="login-brand col-6 gt-sm column flex-center">
        <div class="login-brand-content text-center">
          <img
            src="~/src/assets/The_planet/The_planert_logo.png"
            class="login-brand-logo q-mb-lg"
          />

          <div class="text-h3 text-weight-bold login-brand-title letter-spacing-1">
            The Planet Studio
          </div>
          <q-badge
            outline
            class="login-brand-badge q-mt-sm q-px-sm"
            :label="'v' + $q.config.versionApp"
          />

          <p class="text-subtitle1 login-brand-subtitle q-mt-xl">
            Estética &amp; Peluquería
          </p>

          <div class="login-brand-divider q-my-xl" />

          <p class="text-body2 login-brand-caption">
            Bienestar, belleza y cuidado en un solo lugar.
          </p>
        </div>
      </div>

      <!-- Panel de formulario -->
      <div class="login-form-panel col-12 col-sm-8 col-md-6 column flex-center">
        <q-card flat class="login-card">
          <q-card-section class="text-center lt-md q-pb-none login-card-mobile-brand">
            <img
              src="~/src/assets/The_planet/The_planert_logo.png"
              class="login-brand-logo-sm q-mb-sm"
            />
            <div class="text-h5 text-weight-bold login-brand-title">
              The Planet Studio
              <q-badge
                outline
                class="login-brand-badge q-ml-xs"
                :label="'v' + $q.config.versionApp"
              />
            </div>
            <p class="text-caption login-brand-subtitle q-mb-none">Estética &amp; Peluquería</p>
          </q-card-section>

          <q-card-section class="q-pt-lg">
            <div class="text-h5 text-weight-bold login-title">
              Iniciar sesión
            </div>
            <p class="text-body2 login-subtitle q-mb-lg">
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
                  <q-icon name="account_circle" class="login-input-icon" />
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
                  <q-icon name="lock" class="login-input-icon" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer login-input-icon"
                    @click.prevent="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-btn
                label="Iniciar sesión"
                icon="fa-duotone fa-regular fa-user"
                type="submit"
                class="full-width q-mt-md login-submit-btn"
                unelevated
                rounded
                no-caps
                size="lg"
              />

              <div class="text-center q-mt-md">
                <span class="login-forgot-text text-body2">¿Olvidaste tu contraseña? </span>
                <q-btn
                  flat
                  dense
                  no-caps
                  padding="none"
                  label="Recuperar contraseña"
                  class="login-forgot-link text-weight-medium"
                  @click="$router.push({name:'ForgotPassword'})"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <div class="text-center text-caption q-mt-xl login-footer">
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
  background: #060606;
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
  padding: 48px;
  background-image: url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1600&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
}

.login-brand::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.88), rgba(91, 22, 45, 0.55)),
    radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.18) 0, transparent 45%),
    radial-gradient(circle at 10% 90%, rgba(255, 105, 180, 0.16) 0, transparent 45%);
  pointer-events: none;
}

.login-brand-content {
  position: relative;
  z-index: 1;
  max-width: 380px;
  animation: fadeInUp 0.6s ease both;
}

.login-brand-logo {
  width: clamp(88px, 12vw, 128px);
  height: clamp(88px, 12vw, 128px);
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.45));
}

.login-brand-logo-sm {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 50%;
  filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.4));
}

.login-brand-title {
  color: #d4af37;
}

.login-brand-badge {
  color: #d4af37 !important;
  border-color: rgba(212, 175, 55, 0.55) !important;
}

.letter-spacing-1 {
  letter-spacing: 2px;
}

.login-brand-subtitle {
  color: #f48fb1;
  opacity: 0.95;
}

.login-brand-divider {
  width: 56px;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ff8fb3);
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
  background: radial-gradient(circle at top, rgba(255, 105, 180, 0.1), #060606 45%);
  padding: 32px 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(160deg, rgba(15, 15, 15, 0.98), rgba(35, 10, 20, 0.97));
  border: 1px solid rgba(212, 175, 55, 0.18);
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5), 0 0 30px rgba(233, 30, 99, 0.08);
  animation: fadeInUp 0.6s ease 0.1s both;
}

.login-card-mobile-brand {
  padding-top: 28px;
}

.login-title {
  color: #ffffff;
}

.login-subtitle {
  color: #a3a3a3;
}

.login-input :deep(.q-field__control) {
  border-radius: 10px;
  min-height: 48px;
  background: #ffffff;
}

.login-input :deep(.q-field__control):before {
  border-color: rgba(212, 175, 55, 0.55);
}

.login-input :deep(.q-field__control):hover:before {
  border-color: rgba(212, 175, 55, 0.85);
}

.login-input.q-field--focused :deep(.q-field__control):after {
  border-color: #e91e63;
}

.login-input :deep(.q-field__native),
.login-input :deep(input) {
  color: #1a1a1a;
}

.login-input :deep(.q-field__native)::placeholder {
  color: #8a8a8a;
  opacity: 1;
}

.login-input :deep(.q-field__label) {
  color: #d4af37;
}

.login-input.q-field--focused :deep(.q-field__label) {
  color: #e91e63;
}

/* Sobrescribe el fondo azul/gris del autocompletado del navegador */
.login-input :deep(input:-webkit-autofill),
.login-input :deep(input:-webkit-autofill:hover),
.login-input :deep(input:-webkit-autofill:focus),
.login-input :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
  box-shadow: 0 0 0 1000px #ffffff inset !important;
  -webkit-text-fill-color: #1a1a1a !important;
  caret-color: #1a1a1a;
  transition: background-color 9999s ease-in-out 0s;
}

.login-input-icon {
  color: #d4af37;
}

.login-submit-btn {
  background: linear-gradient(90deg, #ad1457, #e91e63 55%, #ff4081);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.3px;
  min-height: 48px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.login-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(233, 30, 99, 0.45);
}

.login-forgot-text {
  color: #9a9a9a;
}

.login-forgot-link {
  font-size: 0.875rem;
  color: #d4af37 !important;
  text-decoration: underline;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.login-footer {
  color: rgba(255, 255, 255, 0.45);
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
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
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

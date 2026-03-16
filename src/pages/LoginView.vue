<template>
  <div class="limiter">
    <div class="wrap-login100" >
      <q-form class="login100-form  validate-form" @submit="()=>{isPwd = true;login(loginForm)}">
        <div class="row">
          <div class="col-11 justify-center items-center" style="text-align: center">
            <div
              class="row justify-center shadow-24"
              style="
                border: 1px solid rgba(155, 166, 181, 0.61);
                padding: 30px;
                border-radius: 20px;
                margin-top: 3%;
                background: white;
                max-width: 450px;
              "
            >
              <div class="col-11">
                <q-card-section
                  class="row justify-center"
                  style="margin-top: 5px"
                >
                  <div class="row" style="width: 100%;">
                <span style="font-size: calc(12px + 1.5vw);width: 100%;" class="txt3">
                    SIAJ
                    <q-badge
                      outline
                      color="primary"
                      :label="'v' + $q.config.versionApp"
                      style="padding: 3px"
                    /> </span
                >
                  </div>
                  <br/>
                  <div class="row">
                    <p style="font-size: 14px; font-weight: 400;margin-bottom: 20px" class="txt3">
                      Sistema de Impedimentos Administrativos y Judiciales <br />
                    </p>
                  </div>
                  <div class="row q-col-gutter-md q-mb-md" style="margin-top: 15px">
                    <div class="col-12" style="margin-bottom: 15px">
                      <q-input
                        outlined
                        dense
                        v-model="loginForm.username"
                        label="Usuario"
                        :rules="[isRequired]"
                        hide-bottom-space
                      >
                        <template v-slot:prepend>
                          <q-icon name="account_circle" />
                        </template
                        ></q-input>
                    </div>
                    <div class="col-12">
                      <q-input
                        outlined
                        dense
                        v-model="loginForm.password"
                        :type="isPwd ? 'password' : 'text'"
                        label="Contraseña"
                        :rules="[isRequired]"
                        hide-bottom-space
                      ><template v-slot:prepend>
                        <q-icon name="lock" />
                      </template>
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click.prevent="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card-section>


                <br />
                <br />
                <q-btn
                  label="ACCEDER"
                  type="submit"
                  style="background: #039B77; color: white"
                  class="full-width"
                />
               <!-- <div class="row justify-center" style="margin-top: 15px;">
                 <p style="margin-right: 5px;">¿Olvidaste tu contraseña? </p>
                 <span style="color: #C10015; cursor: pointer;"  @click="$router.push({name:'ForgotPassword'})">RECUPERAR</span>
               </div> -->
              </div>
              <div
                style="
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                "
              >
                <br /><br />
              </div>
            </div>
            <div style="text-align: center; max-width: 400px">
              <br /><br />
              <span style="font-size: 16px; font-weight: bold; color: white">
                © {{ currentYear }} - Secretaría de Relaciones Exteriores
              </span>
              <br /><br />
              <!--          <q-img-->
              <!--            src="../assets/img/login/logoSRE.png"-->
              <!--            alt="alt"-->
              <!--            style="max-width: 100%"-->
              <!--          />-->
            </div>
          </div>
        </div>
      </q-form>
      <div class="login100-more">
        <div class="center-items">
          <div class="row">
            <div class="col-12 justify-center items-center" style="text-align: center">
              <q-img class="avatar" src="~assets/img/login/LogoSREVertical.png" style="width: 320px;margin-right: 10px"/>
            </div>
          </div>
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

* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  font-family: NotoSans, sans-serif;
}



/*---------------------------------------------*/


p {
  font-family: NotoSans;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
}

/*---------------------------------------------*/
button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}


/*/////////////////////////////////////////////////////////////////
[ login ]*/
.limiter {
  width: 100%;
  margin: 0 auto;
}

.wrap-login100 {
  width: 100%;
  height:100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;

  display: flex;
  flex-direction: row-reverse;
  background-image: url('src/assets/img/login/Rojo.png');

}

/*==================================================================
[ login more ]*/
.center-items {
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
  height: 100%; /* Asegúrate de que tenga un alto para alinear verticalmente */
}

.login100-more {
  //background-image: url('src/assets/img/login/home_green.png');
  width: calc(100% - 50%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  //z-index: 1;
}

.login100-more::before {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.1);
}

/*==================================================================
[ Form ]*/


.login100-form {
  width: 50%;
  min-height: 100vh;
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
  height: 100%; /* Asegúrate de que tenga un alto para alinear verticalmente */
}



/*------------------------------------------------------------------
[ Responsive ]*/

@media (max-width: 992px) {
  .login100-form {
    width: 50%;
    padding-left: 30px;
    padding-right: 30px;
  }

  .login100-more {
    width: 50%;
  }
}

@media (max-width: 600px) {
  .login100-form {
    width: 100%;
  }

  .login100-more {
    display: none;
  }
}

@media (max-width: 576px) {
  .login100-form {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 70px;
  }
}




</style>

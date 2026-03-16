<template>
  <router-view />
</template>

<script setup>
import {onMounted, watch} from 'vue'
import {useIdle} from '@vueuse/core'
import {useQuasar} from "quasar";
import {useAuthUserStore} from "stores/AuthUser";
import useSession from "src/composables/useSession";


const $q = useQuasar()
const store = useAuthUserStore()
const { logout } = useSession()
const { idle } = useIdle(25 * 60 * 1000) // 25 min

const removeSession = () =>{

  let closeIn60Seconds = setTimeout( async () => {
    $q.loading.show()

    await logout()

    $q.loading.hide();
    dialog.hide();
  }, 30000); // Will close on 30 seconds

  let contador = 30;

  const dialog = $q.dialog({
    title: 'La sesión expirará pronto',
    message: 'La aplicación se cerrará en los próximos 30 segundos, ningún cambio será guardado.',
    cancel: false,
    persistent: true
  }).onOk(() => {
    clearInterval(temporizador);
    clearTimeout(closeIn60Seconds);
  })


  let temporizador = setInterval(function() {
    console.log('Contador:', contador);
    contador--;

    if (contador >= 0) {
      dialog.update({
        message: `La aplicación se cerrará en los próximos <strong style="font-size: 15px">${contador}</strong> <br> segundos, ningún cambio será guardado.`,
        html: true
      })
    }else {
      clearInterval(temporizador);
    }
  }, 1000);
}


watch(idle, (idleValue) => {
  if (idleValue && window.sessionStorage.getItem("impedimentos_token")) {
    removeSession()
  }
})

onMounted(async () => {
  if ( window.sessionStorage.getItem("impedimentos_token")) {
    await store.sessionInfo()
  }
})
</script>



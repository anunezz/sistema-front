import {useQuasar} from "quasar";
import AuthServices from "src/services/AuthServices";
import useNotify from "src/composables/useNotify";
import {useRouter} from "vue-router";
import { useAuthUserStore } from "stores/AuthUser"

const useSession = (data) => {

  const {showError} = useNotify()
  const $q = useQuasar()
  const router = useRouter()
  const store = useAuthUserStore()


  const login = () => {

    $q.loading.show()

    AuthServices.login(data).then(response => {
      $q.loading.hide();
      if (response.data.success) {
        store.setUser(response.data.user)
        store.setSession(response.data.session)
        // Spec §14: "Inicio" (dashboard) es el módulo inicial del
        // administrador — antes aterrizaba en el menú de tiles
        // (AdministrationMenu), que sigue existiendo intacto en
        // /administracion (no se eliminó nada, solo cambia el destino
        // post-login).
        router.push({name:'Inicio'})
      }

    }).catch(e => {
		console.error(e);
      $q.loading.hide()
      if (e.response.status === 402) {
        showError('', `Por favor verifique los datos. <br> Verifique sus credenciales e intente nuevamente.`);
      }
      if (e.response.status === 429) {
        showError('', e.response.data.messages)

      }
    })
  }

  const logout = async () => {
    $q.loading.show()
    await AuthServices.logut().then(response => {
      $q.loading.hide()
      if (response.data.authenticated === false) {
        store.logout()
        router.push('/ingresar')
      } else {
        showError(
          'Error',
          'It was not possible to log out, please try again.'
        )
      }
    }).catch(e => {
      console.log('e', e)
      $q.loading.hide()
      showError(
        'Error',
        'It was not possible to log out, please try again.'
      )
    })
  }

  return {
    login,
    logout
  }
}

export default useSession

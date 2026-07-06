import { defineStore } from 'pinia';
import {axiosInstance} from "boot/axios";
import { Notify } from 'quasar'
import LocalForage from "localforage";

export const useAuthUserStore = defineStore('auth', {
  state: () => ({
    user: {},
  }),
  getters: {
    dataUser: (state) => state.user,
    hasPermission: (state) => (permissionName) => {
      if (!state.user || !Array.isArray(state.user.permissions)) {
        return false;
      }
      return state.user.permissions.includes(permissionName);
    },
  },
  actions: {
    async setUser(user) {
      this.user = user;
    },
    deleteUser() {
      this.user = {};
    },

    async sessionInfo() {
      await axiosInstance.get('/user/' + window.sessionStorage.getItem('impedimentos_hash'))
        .then(response => {
          this.setUser(response.data.user);
        }).catch(error => {
        console.log('error', error)
        this.logout();
      })
    },

    setSession(session) {
      sessionStorage.setItem('sistema_token', session.sistema_token);
      sessionStorage.setItem('sistema_token_expiration', session.sistema_token_expiration);
      sessionStorage.setItem('impedimentos_hash', session.impedimentos_hash);

      axiosInstance.defaults.headers.common = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer ' + sessionStorage.getItem('sistema_token')
      };
    },

    async logout () {
      // await this.deleteUser()
      if ( window.sessionStorage.getItem('sistema_token') ) {
        setTimeout(function(){
          Notify.create({
            type: 'positive',
            color: 'positive',
            timeout: 2000,
            message: 'Su sesión se cerró correctamente'
          })
        }, 200);
      }
      sessionStorage.removeItem('sistema_token');
      sessionStorage.removeItem('sistema_token_expiration');
      sessionStorage.removeItem('impedimentos_hash');

      axiosInstance.defaults.headers.common = {
        Authorization: 'Bearer'
      };

      await LocalForage.clear()
    }
  },
  persist: {
    key: 'auth',
    storage: LocalForage, // o sessionStorage o incluso tu plugin con localForage
    paths: ['user'] // solo esta propiedad se persistirá
  }
});

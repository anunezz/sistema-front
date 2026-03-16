import { defineStore } from 'pinia';
//import LocalForage from "localforage";

export const useImpedimentStore = defineStore('index_Impediment_store', {
  state: () => ({
    form: {},
    hash_id: null,
    id_tipo_impedimento: null,
    nombre_tipo_impedimento: null,
    title:null
  }),
  getters: {
    data_form: (state) => state.form,
    data_hash_id: (state) => state.hash_id,
    data_id_tipo_impedimento: (state) => state.id_tipo_impedimento,
    data_title: (state) => state.title,
    data_nombre_tipo_impedimento: (state) => state.nombre_tipo_impedimento,
  },
  actions: {
    async setForm(form) {
        this.form = form;
    },
    async setHashId(hash_id) {
        this.hash_id = hash_id;
    },
    async setIdTipoImpedimento(id_tipo_impedimento) {
        this.id_tipo_impedimento = id_tipo_impedimento;
    },
    async setTitle(title) {
        this.title = title;
    },
    async setNombreTipoImpedimento(nombre_tipo_impedimento) {
        this.nombre_tipo_impedimento = nombre_tipo_impedimento;
    },
    deleteIndex() {
        this.form = {};
        this.id_tipo_impedimento = null;
        this.nombre_tipo_impedimento = null;
        this.hash_id = null;
        this.title = null;
    },
    deleteIndex2() {
        this.form = {};
        this.hash_id = null;
        this.title = null;
    }
  },
  persist: {
    key: 'index_Impediment_store',
    storage: localStorage, // o sessionStorage o incluso tu plugin con localForage
    // paths: [
    //   'form',
    //   'hash_id',
    //   'id_tipo_impedimento',
    //   'title'
    // ] // solo esta propiedad se persistirá
  }
});

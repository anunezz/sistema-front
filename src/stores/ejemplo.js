import { defineStore } from 'pinia'

export const useEjemploStore = defineStore('ejemplo', {
  state: () => ({
    form: {}
  }),

  actions: {
    setForm(data) {
      this.form = { ...data }
    },
    clearForm() {
      this.form = {}
    }
  },

  persist: {
    storage: localStorage,
    paths: ['form']
  }
})

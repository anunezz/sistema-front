import { defineStore } from 'pinia'

export const useCatalogosStore = defineStore('catalogo', {
  state: () => ({
    selectedCat: null
  }),

  actions: {
    setSelectedCat(cat) {
      this.selectedCat = cat
    },
    clearSelectedCat() {
      this.selectedCat = null
    }
  },

  persist: {
    storage: localStorage,
    paths: ['selectedCat']
  }
})

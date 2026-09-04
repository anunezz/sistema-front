<template lang="">
  <q-dialog  position="left" full-height>
    <q-card :style="'width: 390px; border: 2px solid ' + headerColor">
      <div class="flex justify-end q-pa-sm">
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <p class="title" :style="'background:' + headerColor">{{title}}</p>
      <slot/>
    </q-card>
  </q-dialog>
</template>
<script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    // Override opcional del color de cabecera (por defecto el mismo
    // "#10312B" de siempre, no afecta a ningún módulo existente). Agenda lo
    // usa para que sus filtros usen el mismo color del header administrativo
    // (spec §4, ver BloqueosTab.vue).
    headerColor: {
      type: String,
      required: false,
      default: '#10312B'
    }
  })
</script>

<style scoped lang="css">
.title{
  font-weight: bold;
  color: white;
  padding: 5px;
  font-size: 20px;
}</style>


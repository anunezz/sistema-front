<template lang="">
  <q-dialog  position="left" full-height>
    <q-card style="width: 390px; border: 2px solid #10312B" >
      <div class="flex justify-end q-pa-sm">
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <p class="title">{{title}}</p>
      <slot/>
    </q-card>
  </q-dialog>
</template>
<script setup>
  defineProps({
    title: {
      type: String,
      required: true
    }
  })
</script>

<style scoped lang="css">
.title{
  font-weight: bold;
  background: #10312B;
  color: white;
  padding: 5px;
  font-size: 20px;
}</style>


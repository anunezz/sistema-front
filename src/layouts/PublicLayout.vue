<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
   

    <!-- Contenedor principal -->
    <q-page-container>
      <q-page class="flex flex-center">
        <!-- Aquí se cargan las páginas públicas -->
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'PublicLayout'
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
}
</style>

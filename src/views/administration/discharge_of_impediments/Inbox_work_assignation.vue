<template>
<header-section title="Asignación de trabajo" :icon-image="iconModule" />
  <div class="q-pa-md">
    <div class="row justify-end">
      <div class="col-12 col-md-12 col-sm-12 col-xs-12">
	</div>

    </div>
</div>
  <q-section>
    <TabsRequest/>
  </q-section>

</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue';
import {ref,onMounted} from "vue";
// import {useRouter} from 'vue-router';
// import {useAuthUserStore} from "stores/AuthUser";

import imageRoute from 'src/assets/icons/Home/bandeja_validacion_altas.png';
import TabsRequest from 'src/components/TabsRequest.vue';
const iconModule = ref(imageRoute);





onMounted(() => {

  // getCatsIndex();
  // getRegisters();
  // getRegistersAssigned();

})
</script>


<style scoped>

thead tr:first-child th {
  background-color: #6F7271;
  color: white;
}

.cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
}

.title{
  font-weight: bold;
  background: #10312B;
  color: white;
  padding: 5px;
  font-size: 20px;
}

</style>

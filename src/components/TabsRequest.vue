<template lang="">


<q-tabs
    v-model="currentTab"
    dense
    class="text-primary"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    >
<q-tab name="disponibles" label="Disponibles" />
<q-tab name="asignadas" label="Asignadas" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="currentTab" animated>

    <!-- TAB 1: DISPONIBLES -->
        <q-tab-panel name="disponibles">
            <TabDisponibles/>
        </q-tab-panel>
    <!-- TAB 2: ASIGNADAS -->
    <q-tab-panel name="asignadas">
            <TabAsignadas
            />
    </q-tab-panel>

    </q-tab-panels>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';

import { useAuthUserStore } from 'src/stores/AuthUser';
import TabDisponibles from './TabDisponibles.vue';
import TabAsignadas from './TabAsignadas.vue';
const $q = useQuasar();
const store = useAuthUserStore()
const currentTab = ref('disponibles')




const options = ref({
  cat_causal_impedimento:[],
  office:[],
  cat_usuarios: [],
});
const catalogsOptions = ref({
  cat_causal_impedimento: [],
  office: [],
})


// const getRegistersAssigned = ( pag = null) => {
//   $q.loading.show();
//   if( pag !== undefined && pag ){
//     pagination.value.page = pag.page;
//     pagination.value.rowsPerPage = pag.rowsPerPage;

//   }
//   pagination.value.filters = filters.value
//   DischargeImpedimentsServices.get_data_inbox_work_assignation({
//     ...pagination.value,
//     'only_assigned': true
//   }).then(response => {
//       $q.loading.hide();
//       if (response.data.success) {
//         console.log(response.data.Results.ImSolicitud);
//         pagination.value = {
//             page: response.data.Results.ImSolicitud.current_page,
//             rowsPerPage: response.data.Results.ImSolicitud.per_page,
//             rowsNumber: response.data.Results.ImSolicitud.total
//         }
//         registers_assigned.value = response.data.Results.ImSolicitud.data;
//       }
//   }).catch(e => {
//     $q.loading.hide();
//     console.error("error: ",e);
//   })
// }




const getCatsIndex = () => {
  $q.loading.show();
  DischargeImpedimentsServices.get_cats_index({
    id_tipo_impedimento: 1
  }).then(response => {
    console.log(response.data.Results.ImPersonaSolicitud);
      $q.loading.hide();
      if (response.data.success) {
        options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        options.value.office = response.data.Results.cat_oficinas;

		console.log("response.data.Results.usuarios: ",response.data.Results.usuarios  );

        options.value.cat_usuarios = response.data.Results.usuarios.filter(elemento => elemento.usuario_perfil.id_perfil == 3);



        catalogsOptions.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
        catalogsOptions.value.office = response.data.Results.cat_oficinas;
      }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
}


onMounted(() => {
    console.log("-------: ",store.dataUser);
    getCatsIndex()
})
</script>
<style lang="">
    
</style>

<!-- <div class="col-12 col-md-12 col-sm-12 col-xs-12">
    <div class="row justify-end q-gutter-xs">
        <q-btn-group>
            <q-btn
            outline
            size="12px"
            color="withe"
            icon="fa-solid fa-list"
            label="Asignar solicitudes"
            @click="dialog2=true"
            />
            <q-btn
            outline
            size="12px"
            color="withe"
            icon="fa-solid fa-magnifying-glass"
            label="Filtros avanzados"
            @click="dialog = true" />
        </q-btn-group>
        </div>
    </div> -->
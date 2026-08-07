<template>
  <div class="row q-col-gutter-md q-pa-md" style="justify-content: center">
    <div
      class="col-12 col-sm-6 col-md-4"
      v-for="(section, index) in AccessModulePermission"
      :key="index + 100"
    >
      <q-card
        v-ripple
        style="cursor: pointer;padding: 5px"
        @click="moduleMenu(section)"
      >
        <div class="row">
          <div class="col-12">
            <q-img
              style="border-radius: 5px;"
              :style="$q.screen.lt.md ? 'height: 145px' : 'height: 146px'"
              src="~assets/img/MenuColor.png"
              basic
            >
              <div
                class="absolute-bottom text-subtitle2 text-center q-mb-md transparent text-grey-10"
              >
                <q-icon
                  :name="section.icon !== '' ? section.icon : section.iconImage ? `img:${section.iconImage}` : ''"
                  style="color: #126866; font-size: clamp(20px, 4vw, 80px);"
                />
              </div>
              <div class="absolute-full transparent app-secition"></div>
            </q-img>
          </div>
          <div class="col-12 text-center" style="color: #335474;padding: 7px">
            {{ section.name }}
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useAuthUserStore } from "src/stores/AuthUser";

import iconBandejaSolicitudes from 'src/assets/icons/Home/bandeja_solicitudes.png';
import iconAdminCatalogos from 'src/assets/icons/Home/admin_catalogos.png';
import iconAdminUsuarios from 'src/assets/icons/Home/admin_usuarios.png';

import { useRouter } from 'vue-router'

const authStore = useAuthUserStore();
const router = useRouter()
const modules = ref([
  {
    name: "Inicio",
    icon: "",
    iconImage: iconBandejaSolicitudes,
    routeName: "InboxRequests",
    permission: 'inicio'
  },
  {
    name:'Servicios',
    icon:'',
    iconImage:iconAdminCatalogos,
    routeName:'IndexServicios',
    permission:'servicios'
  },
  {
    name:'Agenda',
    icon:'',
    iconImage:iconAdminCatalogos,
    routeName:'CatalogsIndex',
    permission:'agenda'
  },
  {
    name:'Productos',
    icon:'',
    iconImage:iconAdminCatalogos,
    routeName:'CatalogsIndex',
    permission:'productos'
  },
  {
    name:'Contacto',
    icon:'',
    iconImage:iconAdminCatalogos,
    routeName:'CatalogsIndex',
    permission:'contacto'
  },
  {
    name:'Administracion de catalogos',
    icon:'',
    iconImage:iconAdminCatalogos,
    routeName:'CatalogsIndex',
    permission:'catalog_management'
  },
  {
    name: "Administración de Usuarios",
    icon: "",
    iconImage: iconAdminUsuarios,
    routeName: "UsersIndex",
    permission:'user_management'
  }
]);

const moduleMenu = (section) => {
  router.push({ name: section.routeName })
}

const AccessModulePermission = computed(() => {
  return modules.value.filter(module=>authStore.hasPermission(module.permission));
  //return modules.value.filter(module=>authStore.hasPermission(module.permission));
});
</script>

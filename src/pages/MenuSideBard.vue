<template>
  <div v-for="(link,$index) in menuList" :key="$index">
    <q-item  v-if="link.moduleName !== ''">
      <q-item-section class="text-weight-bold" style="font-size: 12px">
        <strong>{{ link.moduleName }}</strong>
      </q-item-section>
    </q-item>

    <q-list>
      <template  v-for="(menuItem, index) in link.childs" :key="index">
        <q-item
          v-if="authStore.hasPermission(menuItem.permission)"
          clickable
          v-ripple
          tag="router-link"
          @click="handleItem(menuItem)"
          :style="itemStyle(menuItem)"
          active-class="bg-grey-4 text-primary"
          exact
        >
          <q-item-section avatar>
            <q-icon
              :style="menuItem.color ? { color: menuItem.color } : null"
              :name="menuItem.icon !== '' ? menuItem.icon : (menuItem.iconImage ? `img:${menuItem.iconImage}` : '')"
            />
          </q-item-section>

          <q-item-section :style="menuItem.color ? { color: menuItem.color } : null">
            {{ menuItem.moduleName }}
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>

</template>

<script setup>
import {ref} from "vue";
import { useAuthUserStore } from "src/stores/AuthUser";

import iconBandejaSolicitudes from 'src/assets/icons/SideBard/bandeja_solicitudes.png';
import iconAdminCatalogos from 'src/assets/icons/SideBard/admin_catalogos.png';
import iconAdminUsuarios from 'src/assets/icons/SideBard/admin_usuarios.png';
import { BinnacleTransaction } from "src/utils/binnacle";
import { useRouter } from "vue-router";

const authStore = useAuthUserStore();
const router = useRouter();

const menuList = ref([
  {
    moduleName: '',
    childs:[
      { icon: 'fa-solid fa-inbox', moduleName: 'Inicio', routeName: 'AdministrationMenu', color: "#FFFFFF",backgroundColor:"#343434"}
    ]
  },

  {
    moduleName: '',
    childs:[
      { id:1, icon: '',iconImage:iconBandejaSolicitudes, moduleId:2 ,moduleName: 'Solicitudes', routeName: 'InboxRequests', color: "#343434",permission:'request_tray'},
	  { id:2, icon: '', iconImage: iconAdminCatalogos, moduleId: 10,moduleName: 'Administración de Catálogos', routeName: 'CatalogsIndex', color: "#343434",permission:'catalog_management'},
	  { id:3, icon: '', iconImage: iconAdminUsuarios, moduleId:12 ,moduleName: 'Administración de Usuarios', routeName: 'UsersIndex', color: "#343434",permission:'user_management'},
    ]
  },

]);

const handleItem = (menuItem) => {

  BinnacleTransaction(menuItem.moduleId, 1, `Ingreso al módulo de ${menuItem.moduleName}`)
    router.push({ name: menuItem.routeName })

}

const itemStyle = (menuItem) => {
  const s = {};
  if (menuItem.backgroundColor) s.backgroundColor = menuItem.backgroundColor;
  if (menuItem.color) s.color = menuItem.color;
  return s;
};



</script>

<style scoped>
.q-item2{

  background: #ece9e9;

}

.q-item2:hover{

  background: #343434;
  color: #FFF;

}

</style>

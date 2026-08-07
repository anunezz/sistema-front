<template>
  <div v-for="(link,$index) in menuList" :key="$index" class="menu-group">
    <q-item  v-if="link.moduleName !== ''">
      <q-item-section class="text-weight-bold" style="font-size: 12px">
        <strong>{{ link.moduleName }}</strong>
      </q-item-section>
    </q-item>

    <q-list class="menu-list">
      <template  v-for="(menuItem, index) in link.childs" :key="index">
        <q-item
          v-if="authStore.hasPermission(menuItem.permission)"
          clickable
          v-ripple
          tag="router-link"
          class="menu-item"
          @click="handleItem(menuItem)"
          :style="itemStyle(menuItem)"
          active-class="menu-item--active bg-grey-4 text-primary"
          exact
        >
          <q-item-section avatar>
            <q-icon
              :style="menuItem.color ? { color: menuItem.color } : null"
              :name="menuItem.icon !== '' ? menuItem.icon : (menuItem.iconImage ? `img:${menuItem.iconImage}` : '')"
            />
          </q-item-section>

          <q-item-section v-if="!mini" :style="menuItem.color ? { color: menuItem.color } : null">
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
import { useRouter } from "vue-router";

const authStore = useAuthUserStore();
const router = useRouter();
const emit = defineEmits(['item-click']);
defineProps({
  mini: {
    type: Boolean,
    default: false
  }
});

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
      { id:1, icon: '',iconImage:iconBandejaSolicitudes ,moduleName: 'Inicio', routeName: 'InboxRequests', color: "#343434",permission:'inicio'},
      { id:2, icon: '',iconImage:iconBandejaSolicitudes ,moduleName: 'Servicios', routeName: 'IndexServicios', color: "#343434",permission:'servicios'},
      { id:3, icon: '',iconImage:iconBandejaSolicitudes ,moduleName: 'Agenda', routeName: 'InboxRequests', color: "#343434",permission:'agenda'},
      { id:4, icon: '',iconImage:iconBandejaSolicitudes ,moduleName: 'Productos', routeName: 'InboxRequests', color: "#343434",permission:'productos'},
      { id:5, icon: '',iconImage:iconBandejaSolicitudes ,moduleName: 'Contacto', routeName: 'InboxRequests', color: "#343434",permission:'contacto'},
	  { id:6, icon: '', iconImage: iconAdminCatalogos,moduleName: 'Administración de Catálogos', routeName: 'CatalogsIndex', color: "#343434",permission:'catalog_management'},
	  { id:7, icon: '', iconImage: iconAdminUsuarios ,moduleName: 'Administración de Usuarios', routeName: 'UsersIndex', color: "#343434",permission:'user_management'},
    ]
  },

]);

const handleItem = (menuItem) => {
    router.push({ name: menuItem.routeName })
    emit('item-click', menuItem)
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

.menu-group {
  margin-bottom: 4px;
}

.menu-list {
  padding: 2px 8px;
}

.menu-item {
  border-radius: 8px;
  margin-bottom: 3px;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.menu-item:hover {
  background: rgba(105, 28, 50, 0.08);
  transform: translateX(2px);
}

.menu-item--active {
  position: relative;
  font-weight: 600;
}

.menu-item--active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 3px;
  background: #691C32;
}
</style>

<template>
  <q-layout view="hHh lpR lFf">

    <q-header elevated style="background: #691C32;height: 47px">
      <q-toolbar>
        <q-btn flat
               dense
               round
               icon="fas fa-bars"
               aria-label="Menu"
               class="app-drawer-toggle"
               @click="toggleDrawer"/>
        <q-toolbar-title>
          <!-- <q-img class="avatar" src="~assets/img/login/logoSRE.png" style="width: 300px;"/> -->
          <small style="margin-left: 10%;font-weight: 700">The planet studio</small>
          <small v-if="!isMobile" style="font-size: 13px;margin-left: 2px">&nbsp;v{{ $q.config.versionApp }}</small>
        </q-toolbar-title>
        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
			<template v-if="!isMobile">
				<span>oficina</span>
				<q-separator dark vertical inset />
			</template>
          <q-btn dense flat no-wrap>
            <q-icon v-if="!isMobile" name="fa-solid fa-house" size="20px" style="margin-right: 15px"/>
            <q-avatar size="24px">
              <q-icon name="account_circle" size="24px"/>
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px"/>

            <q-menu auto-close style="min-width: 220px">
              <q-list style="min-width: 220px">
                <q-item class="q-pa-md text-center">
                  <q-item-section>
					<div class="column q-gutter-xs">
						<!-- Nombre en mayúsculas y destacado -->
						<div class="text-subtitle1 text-weight-medium text-uppercase">
						{{ store.user.full_name }}
						</div>

						<!-- Email con estilo sutil -->
						<div class="text-caption text-grey-7 text-uppercase">
						<q-icon name="email" class="q-mr-sm" />
						{{ store.user.email }}
						</div>

						<!-- Perfil y oficina con jerarquía moderada -->
						<div class="text-body2 text-uppercase">
						<q-icon name="person" class="q-mr-sm" />
						{{ store.user.perfil.perfil }}
						</div>

						<div class="text-body2">
						<q-icon name="business" class="q-mr-sm" />
						oficina
						</div>
					</div>
                  </q-item-section>
                </q-item>
                <q-separator/>
                <q-item
                  clickable
                  class="GL__menu-link"
                  @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout"/>
                  </q-item-section>
                  <q-item-section>
                    Salir
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="app-drawer"
      :class="{ 'app-drawer--mini': miniState }"
      style="background-color: #ECE9E9;"
      v-model="leftDrawerOpen"
      :mini="miniState"
      elevated
      bordered
      show-if-above
      :width="250"
      :mini-width="72"
      :breakpoint="768"
      @mouseenter="onDrawerMouseEnter"
      @mouseleave="onDrawerMouseLeave">
      <q-scroll-area class="fit app-drawer-scroll">
        <q-img src="~assets/img/Blanco.png" style="height: 150px" :class="{ 'app-drawer-profile--mini': miniState }">
          <div class="absolute-bottom bg-transparent text-black text-center">
            <q-avatar :size="miniState ? '40px' : '90px'" icon="fa-solid fa-user-large">
            </q-avatar>
            <template v-if="!miniState">
              <div class="text-weight-bold">{{ store.user.full_name }}</div>
              <div class="text-weight-bold" style="font-size: 10px">{{ store.user.email }}</div>
            </template>
          </div>
        </q-img>
        <MenuSideBard :mini="miniState" @item-click="onMenuItemClick"/>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md q-gutter-md">
        <q-card flat class="my-card">
          <q-card-section>
            <router-view :key="$route.fullPath"/>
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import useSession from "src/composables/useSession";
import {useAuthUserStore} from "stores/AuthUser";
import {ref, computed, watch} from "vue";
import {useQuasar} from "quasar";
import MenuSideBard from "pages/MenuSideBard.vue";

const {logout} = useSession()
const store = useAuthUserStore()
const $q = useQuasar()

const leftDrawerOpen = ref($q.screen.width >= 768)
const miniState = ref($q.screen.width >= 768 && $q.screen.width < 1024)

const isMobile = computed(() => $q.screen.width < 768)

watch(() => $q.screen.width, (width) => {
  if (width < 768) {
    leftDrawerOpen.value = false
    miniState.value = false
  } else if (width < 1024) {
    leftDrawerOpen.value = true
    miniState.value = true
  } else {
    leftDrawerOpen.value = true
    miniState.value = false
  }
})

const toggleDrawer = () => {
  if ($q.screen.width < 768) {
    leftDrawerOpen.value = !leftDrawerOpen.value
  } else if ($q.screen.width < 1024) {
    miniState.value = !miniState.value
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
}

const onDrawerMouseEnter = () => {
  if ($q.screen.width >= 768 && $q.screen.width < 1024) miniState.value = false
}

const onDrawerMouseLeave = () => {
  if ($q.screen.width >= 768 && $q.screen.width < 1024) miniState.value = true
}

const onMenuItemClick = () => {
  if ($q.screen.width < 768) leftDrawerOpen.value = false
}

// console.log(store.dataUser.email)
// console.log(store.user.email)


</script>

<style scoped>
.app-drawer.q-drawer {
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
}

.app-drawer :deep(.q-drawer__content) {
  overflow-x: hidden;
}

.app-drawer-profile--mini {
  height: 72px !important;
}

.app-drawer-scroll :deep(.q-scrollarea__thumb) {
  background: #691C32;
  opacity: 0.35;
  border-radius: 4px;
  width: 6px;
}

.app-drawer-scroll :deep(.q-scrollarea__thumb:hover) {
  opacity: 0.6;
}

.app-drawer-toggle {
  transition: transform 0.15s ease;
}

.app-drawer-toggle:active {
  transform: scale(0.9);
}
</style>

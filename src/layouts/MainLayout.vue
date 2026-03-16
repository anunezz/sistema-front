<template>
  <q-layout view="hHh lpR lFf">

    <q-header elevated style="background: #691C32;height: 47px">
      <q-toolbar>
        <q-btn flat
               dense
               round
               :icon="! switchMenu ? 'fas fa-ellipsis-v' : 'fas fa-ellipsis-h'"
               aria-label="Menu"
               @click="switchMenu = !switchMenu"/>
        <q-toolbar-title>
          <q-img class="avatar" src="~assets/img/login/logoSRE.png" style="width: 300px;"/>
          <small style="font-size: 13px;margin-left: 2px">&nbsp;v{{ $q.config.versionApp }}</small>
          <small style="margin-left: 10%;font-weight: 700">Sistema de Impedimentos Administrativos y Judiciales</small>
        </q-toolbar-title>
        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
			<span>{{ store.user.oficina.cad_oficina}}</span>
			<q-separator dark vertical inset />
          <q-btn dense flat no-wrap>
            <q-icon name="fa-solid fa-house" size="20px" style="margin-right: 15px"/>
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
						{{ store.user.oficina.cad_oficina }}
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
      style="background-color: #ECE9E9;"
      v-model="switchMenu"
      elevated
      show-if-above
      :width="250"
      :breakpoint="400">
      <q-scroll-area class="fit">
        <q-img src="~assets/img/Blanco.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent text-black text-center">
            <q-avatar size="90px"  icon="fa-solid fa-user-large">
            </q-avatar>
            <div class="text-weight-bold">{{ store.user.full_name }}</div>
            <div class="text-weight-bold" style="font-size: 10px">{{ store.user.email }}</div>
          </div>
        </q-img>
        <MenuSideBard/>
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
import {ref} from "vue";
import MenuSideBard from "pages/MenuSideBard.vue";

const {logout} = useSession()
const store = useAuthUserStore()

const switchMenu = ref(false)

// console.log(store.dataUser.email)
// console.log(store.user.email)


</script>

<style scoped>

</style>

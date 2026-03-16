<template>
  <header-section title="Administración" />
  <div class="row q-col-gutter-md q-pa-md">
    <div
      class="col-xs-6 col-md-4"
      v-for="(section, index) in modules"
      :key="index + 100"
    >
      <q-card
        v-ripple
        style="cursor: pointer"
        @click="$router.push({ name: section.route })"
      >
        <q-img
          :style="$q.screen.lt.md ? 'height: 175px' : 'height: 200px'"
          src="src/assets/wing-background.png"
          basic
        >
          <div
            class="absolute-top text-subtitle2 text-center q-mt-lg transparent text-grey-10 text-weight-bolder"
          >
            {{ section.name }}
          </div>
          <div
            class="absolute-bottom text-subtitle2 text-center q-mb-md transparent text-grey-10"
          >
            <q-icon
              class="play-left"
              :name="`fas fa-${section.icon}`"
              style="color: #126866; font-size: clamp(20px, 4vw, 50px);"
            />
          </div>
          <div class="absolute-full transparent app-secition"></div>
        </q-img>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import HeaderSection from "components/HeaderSection.vue";

const modules = [
  {
    name: "Usuarios",
    icon: "users",
    route: "UsersIndex",
  }
];
</script>

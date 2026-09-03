<template>
	<header-section title="Agenda" :icon-image="iconModule"></header-section>

	<q-tabs
		v-model="tab"
		dense
		align="left"
		active-color="primary"
		indicator-color="primary"
		class="q-mx-md q-mt-sm text-grey-8"
	>
		<q-tab name="calendario" label="Calendario" icon="event" />
		<q-tab name="horario" label="Horario" icon="schedule" />
		<q-tab name="bloqueos" label="Bloqueos" icon="block" />
	</q-tabs>

	<q-separator class="q-mx-md q-mt-md" />

	<q-tab-panels v-model="tab" animated class="bg-transparent">
		<q-tab-panel name="calendario">
			<calendario-tab ref="calendarioTabRef" />
		</q-tab-panel>
		<q-tab-panel name="horario">
			<horario-tab />
		</q-tab-panel>
		<q-tab-panel name="bloqueos">
			<bloqueos-tab @changed="onBlocksChanged" />
		</q-tab-panel>
	</q-tab-panels>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderSection from 'components/HeaderSection.vue'
import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png'
import CalendarioTab from './CalendarioTab.vue'
import HorarioTab from './HorarioTab.vue'
import BloqueosTab from './BloqueosTab.vue'
// ServiciosTab.vue ya no se referencia aquí (movido a
// administration/servicios/ServiciosAgendables.vue) — el archivo se deja
// intacto en disco por si algo más lo referenciara (ver skill agenda §9:
// "antes de eliminarla completamente, revisa"), pero deja de ser el punto
// principal de administración.

const iconModule = ref(imageRoute)
const tab = ref('calendario')
const calendarioTabRef = ref<InstanceType<typeof CalendarioTab> | null>(null)

// Bloqueos ya no es un modal: es su propio tab (BloqueosTab). Un alta/baja
// ahí puede cambiar tanto las citas visibles (auto-cancel por traslape) como
// las franjas "CERRADO" del calendario — q-tab-panels mantiene CalendarioTab
// montado en segundo plano, así que se refresca explícitamente vía su
// método expuesto en vez de esperar a que se remonte solo.
const onBlocksChanged = () => {
	calendarioTabRef.value?.reload()
}
</script>

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

	<!-- v-if (no q-tab-panels) a propósito: cada TAB debe reinicializarse y
	     recargar sus datos desde cero cada vez que se selecciona (spec de
	     corrección de Tabs) — q-tab-panels mantiene los tres tabs montados en
	     segundo plano (comportamiento tipo v-show) y NUNCA los remonta al
	     volver a uno ya visitado, lo que obligaba antes a refrescar
	     manualmente vía ref (ver onBlocksChanged, ya no necesario: al volver
	     a "Calendario" el propio onMounted del componente vuelve a correr).
	     v-if desmonta el tab inactivo y crea una instancia nueva al
	     reactivarlo, sin animación de slide (se pierde ese detalle visual,
	     pero es justo el mecanismo que garantiza "una sola carga por
	     inicialización" sin peticiones en segundo plano de tabs no visibles. -->
	<div class="q-pa-none">
		<calendario-tab v-if="tab === 'calendario'" />
		<horario-tab v-else-if="tab === 'horario'" />
		<bloqueos-tab v-else-if="tab === 'bloqueos'" />
	</div>
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
</script>

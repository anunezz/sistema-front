<template>
	<q-chip
		:color="meta.color"
		:text-color="meta.textColor || 'white'"
		:icon="meta.icon"
		dense
		square
		class="status-chip"
	>
		{{ meta.label }}
	</q-chip>
</template>

<script setup>
import { computed } from 'vue'

// Los 5 estados reales (Appointment::STATUSES, ver .claude/skills/agenda/
// §5) — mismo criterio de color que ThePlanetCalendar.vue usa para pintar
// el evento en el calendario (fc-status-*, ver su <style>): PENDIENTE=
// amarillo, CONFIRMADA=verde, CANCELADA=rojo, COMPLETADA=azul, NO_SHOW=
// morado. Si cambias un color aquí, cámbialo también allá — son dos
// representaciones (nombre Quasar vs. CSS del calendario) del mismo mapeo,
// no un sistema de colores independiente.
const STATUS_META = {
	PENDIENTE: { label: 'Pendiente', color: 'amber-8', textColor: 'dark', icon: 'schedule' },
	CONFIRMADA: { label: 'Confirmada', color: 'positive', icon: 'check_circle' },
	CANCELADA: { label: 'Cancelada', color: 'negative', icon: 'cancel' },
	COMPLETADA: { label: 'Completada', color: 'blue-8', icon: 'task_alt' },
	NO_SHOW: { label: 'No se presentó', color: 'purple-6', icon: 'person_off' },
}

const props = defineProps({
	status: {
		type: String,
		required: true,
	},
})

const meta = computed(
	() => STATUS_META[props.status] || { label: props.status, color: 'grey-6', icon: 'help' },
)
</script>

<style scoped>
.status-chip {
	font-weight: 600;
	letter-spacing: 0.02em;
}
</style>

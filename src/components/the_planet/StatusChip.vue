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
import { getStatusMeta } from 'src/utils/agendaStatus'

const props = defineProps({
	status: {
		type: String,
		required: true,
	},
})

const meta = computed(() => getStatusMeta(props.status))
</script>

<style scoped>
.status-chip {
	font-weight: 600;
	letter-spacing: 0.02em;
}
</style>

<template>
	<!-- Modal de ALTA de bloqueo — el listado/administración completa vive en
	     BloqueosTab.vue (tabla, tab "Bloqueos" de Agenda). Este componente ya
	     no incluye la tabla ni el botón "Nuevo bloqueo": solo el formulario,
	     controlado directamente por modelValue desde quien lo abra. -->
	<q-dialog
		:model-value="modelValue"
		@update:model-value="(v) => emit('update:modelValue', v)"
		persistent
	>
		<q-card style="min-width: 380px">
			<q-card-section class="text-h6">Nuevo bloqueo</q-card-section>
			<q-form @submit.prevent="save">
				<q-card-section class="q-gutter-md">
					<!-- Fecha: solo seleccionable por calendario, sin captura
					     manual (spec §5) — acotado al mes actual, sin navegar a
					     meses anteriores/posteriores (spec §6/§7, misma técnica
					     que el date-picker de reserva pública: navigation-min/max
					     -year-month fijos al mes actual calculado con `new Date()`,
					     nunca hardcodeado). -->
					<q-input
						outlined
						dense
						readonly
						v-model="form.dateDisplay"
						label="Fecha"
						placeholder="DD-MM-YYYY"
						:rules="[isRequired]"
					>
						<template v-slot:append>
							<q-icon name="event" class="cursor-pointer">
								<q-popup-proxy
									cover
									transition-show="scale"
									transition-hide="scale"
								>
									<q-date
										v-model="form.dateDisplay"
										mask="DD-MM-YYYY"
										:navigation-min-year-month="currentYearMonth"
										:navigation-max-year-month="currentYearMonth"
										:default-year-month="currentYearMonth"
										:options="isFutureDateSelectable"
									/>
								</q-popup-proxy>
							</q-icon>
						</template>
					</q-input>

					<div>
						<q-radio v-model="form.all_day" :val="true" label="Todo el día" />
						<q-radio v-model="form.all_day" :val="false" label="Horario específico" />
					</div>

					<template v-if="!form.all_day">
						<!-- Hora: solo Time Picker (q-time), sin captura manual de
						     texto (spec §8/§9). -->
						<q-input
							outlined
							dense
							readonly
							v-model="form.start_time"
							label="Hora inicio"
							placeholder="HH:mm"
							:rules="[isRequired]"
						>
							<template v-slot:append>
								<q-icon name="schedule" class="cursor-pointer">
									<q-popup-proxy
										cover
										transition-show="scale"
										transition-hide="scale"
									>
										<q-time v-model="form.start_time" format24h />
									</q-popup-proxy>
								</q-icon>
							</template>
						</q-input>
						<q-input
							outlined
							dense
							readonly
							v-model="form.end_time"
							label="Hora fin"
							placeholder="HH:mm"
							:rules="[isRequired, isAfterStart]"
						>
							<template v-slot:append>
								<q-icon name="schedule" class="cursor-pointer">
									<q-popup-proxy
										cover
										transition-show="scale"
										transition-hide="scale"
									>
										<q-time v-model="form.end_time" format24h />
									</q-popup-proxy>
								</q-icon>
							</template>
						</q-input>
					</template>

					<q-input v-model="form.reason" label="Motivo (opcional)" outlined dense />
				</q-card-section>
				<q-card-actions align="right">
					<q-btn flat label="Cancelar" @click="emit('update:modelValue', false)" />
					<q-btn type="submit" color="primary" label="Guardar" />
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Notify } from 'quasar'
import { ScheduleBlockApi } from 'src/services/administration/agenda/AgendaAdminServices'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'created'])

const isRequired = (val: unknown) => !!val || 'Campo obligatorio'
const isAfterStart = (val: string) =>
	!val ||
	!form.value.start_time ||
	val > form.value.start_time ||
	'Debe ser posterior a la hora de inicio'

// Mismo criterio que el date-picker de reserva pública (spec §7: mes actual
// calculado dinámicamente, nunca hardcodeado) — el backend también valida
// esto (ScheduleBlockRequest), esto es solo la restricción de UI.
const currentYearMonth = computed(() => {
	const today = new Date()
	return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}`
})

// 'DD-MM-YYYY' (formato del q-date) -> 'YYYY-MM-DD' (formato que espera el backend)
const toIsoDate = (displayDate: string) => {
	const [day, month, year] = displayDate.split('-')
	return `${year}-${month}-${day}`
}

// El bloqueo debe ser estrictamente futuro (spec §10: ni hoy ni una fecha
// pasada) — el backend también lo valida (ScheduleBlockRequest), esto
// impide seleccionarlo desde el propio calendario, no solo tras enviarlo.
// q-date entrega el candidato como 'YYYY/MM/DD'.
const todayIso = () => {
	const today = new Date()
	return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`
}

const isFutureDateSelectable = (slashDate: string) => slashDate > todayIso()

const defaultForm = () => ({
	dateDisplay: '',
	all_day: true,
	start_time: '',
	end_time: '',
	reason: '',
})
const form = ref(defaultForm())

// El formulario se reinicia cada vez que el modal se abre — mismo
// comportamiento que antes tenía openNew() al pulsar "Nuevo bloqueo".
watch(
	() => props.modelValue,
	(open) => {
		if (open) form.value = defaultForm()
	},
)

const save = async () => {
	if (!form.value.dateDisplay) {
		Notify.create({ type: 'negative', message: 'Selecciona una fecha.' })
		return
	}

	try {
		await ScheduleBlockApi.store({
			date: toIsoDate(form.value.dateDisplay),
			all_day: form.value.all_day,
			start_time: form.value.all_day ? null : form.value.start_time,
			end_time: form.value.all_day ? null : form.value.end_time,
			reason: form.value.reason || null,
		})
		Notify.create({ type: 'positive', message: 'Bloqueo creado.' })
		emit('update:modelValue', false)
		emit('created')
	} catch (error) {
		// El backend valida fecha futura/mes actual y rango dentro del
		// horario configurado (ScheduleBlockRequest §10/§11) — se muestra su
		// mensaje real en vez de uno genérico, para que el admin sepa
		// exactamente qué corregir.
		const backendMessage = error?.response?.data?.errors
			? Object.values(error.response.data.errors)[0]?.[0]
			: error?.response?.data?.message
		Notify.create({
			type: 'negative',
			message: backendMessage || 'No se pudo guardar. Revisa la fecha y el horario.',
		})
	}
}
</script>

<template>
	<div class="q-pa-md">
		<q-banner class="bg-blue-1 text-grey-9 q-mb-md" rounded>
			Horario de atención único de The Planet Studio — aplica a todas las citas, sin
			distinción de barbero.
		</q-banner>

		<q-form ref="formRef">
			<q-card flat bordered>
				<q-card-section>
					<div
						v-for="day in days"
						:key="day.day_of_week"
						class="row items-center q-col-gutter-sm q-mb-sm"
					>
						<div class="col-3">{{ dayLabel(day.day_of_week) }}</div>
						<div class="col-2">
							<q-toggle v-model="day.active" dense />
						</div>
						<div class="col-3">
							<!-- Solo Time Picker (q-time), sin captura manual de texto
						     (spec §8/§9). -->
							<q-input
								readonly
								v-model="day.start_time"
								:disable="!day.active"
								dense
								outlined
								placeholder="HH:mm"
								:rules="day.active ? [(val) => !!val || 'Obligatoria'] : []"
							>
								<template v-slot:append>
									<q-icon
										name="schedule"
										:class="day.active ? 'cursor-pointer' : ''"
									>
										<q-popup-proxy
											v-if="day.active"
											cover
											transition-show="scale"
											transition-hide="scale"
										>
											<q-time v-model="day.start_time" format24h />
										</q-popup-proxy>
									</q-icon>
								</template>
							</q-input>
						</div>
						<div class="col-3">
							<q-input
								readonly
								v-model="day.end_time"
								:disable="!day.active"
								dense
								outlined
								placeholder="HH:mm"
								:rules="
									day.active
										? [
												(val) => !!val || 'Obligatoria',
												(val) =>
													val > day.start_time ||
													'Debe ser posterior a la hora de inicio',
											]
										: []
								"
							>
								<template v-slot:append>
									<q-icon
										name="schedule"
										:class="day.active ? 'cursor-pointer' : ''"
									>
										<q-popup-proxy
											v-if="day.active"
											cover
											transition-show="scale"
											transition-hide="scale"
										>
											<q-time v-model="day.end_time" format24h />
										</q-popup-proxy>
									</q-icon>
								</template>
							</q-input>
						</div>
					</div>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn
						color="primary"
						label="Guardar horario"
						icon="save"
						:loading="saving"
						@click="save"
					/>
				</q-card-actions>
			</q-card>
		</q-form>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import type { QForm } from 'quasar'
import { WorkingHourApi } from 'src/services/administration/agenda/AgendaAdminServices'
import type { WorkingHourDay } from 'src/interfaces/agenda'

const formRef = ref<QForm | null>(null)

const DAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const dayLabel = (day: number) => DAY_LABELS[day] ?? String(day)

const days = ref<WorkingHourDay[]>(
	Array.from({ length: 7 }, (_, dayOfWeek) => ({
		day_of_week: dayOfWeek,
		start_time: '09:00',
		end_time: '18:00',
		active: false,
	})),
)

const saving = ref(false)

const load = async () => {
	const response = await WorkingHourApi.index()
	const existing = response.data.success ? response.data.data : []

	days.value = Array.from({ length: 7 }, (_, dayOfWeek) => {
		const found = existing.find((d) => d.day_of_week === dayOfWeek)
		return (
			found ?? {
				day_of_week: dayOfWeek,
				start_time: '09:00',
				end_time: '18:00',
				active: false,
			}
		)
	})
}

const save = async () => {
	const valid = await formRef.value?.validate()
	if (!valid) return

	saving.value = true
	try {
		await WorkingHourApi.update(days.value)
		Notify.create({ type: 'positive', message: 'Horario guardado.' })
	} catch {
		Notify.create({ type: 'negative', message: 'No se pudo guardar el horario.' })
	} finally {
		saving.value = false
	}
}

onMounted(load)
</script>

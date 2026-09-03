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
						class="row items-center q-col-gutter-sm q-mb-md day-schedule-row"
					>
						<!-- col-6 col-sm-* : en celular (xs) cada control ocupa la mitad
						     del ancho (grid 2x2), evitando las 4 columnas de 25% que se
						     amontonaban; desde "sm" (tablet/escritorio) recupera las
						     proporciones 3/2/3/3 que ya existían, sin cambio visual. -->
						<div class="col-6 col-sm-3 day-label">{{ dayLabel(day.day_of_week) }}</div>
						<div class="col-6 col-sm-2">
							<q-toggle v-model="day.active" :dense="$q.screen.gt.xs" />
						</div>
						<div class="col-6 col-sm-3">
							<!-- Solo Time Picker (q-time), sin captura manual de texto
						     (spec §8/§9). -->
							<q-input
								readonly
								v-model="day.start_time"
								:disable="!day.active"
								dense
								outlined
								:label="$q.screen.xs ? 'Inicio' : ''"
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
						<div class="col-6 col-sm-3">
							<q-input
								readonly
								v-model="day.end_time"
								:disable="!day.active"
								dense
								outlined
								:label="$q.screen.xs ? 'Fin' : ''"
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

<style scoped>
.day-label {
	font-weight: 600;
}

/* Celular (xs): separa visualmente cada día (grid 2x2 día/toggle/inicio/fin,
   ver template) para que no se vean encimados uno tras otro sin límite
   claro — no cambia nada en tablet/escritorio (sm+ ya vuelve a la fila
   única 3/2/3/3 de siempre). */
@media (max-width: 599px) {
	.day-schedule-row {
		padding: 10px 6px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		margin-left: 0;
		margin-right: 0;
	}

	.day-label {
		font-size: 1rem;
	}
}
</style>

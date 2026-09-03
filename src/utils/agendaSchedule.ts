// Deriva los límites reales del calendario (ThePlanetCalendar.vue) a partir
// del horario de atención configurado (WorkingHour) — única fuente de
// verdad, usada tanto por la vista pública como por el calendario
// administrativo (ver .claude/skills/agenda/ §13.5). Antes el componente
// tenía un rango fijo hardcodeado (11:00-19:00); esto reemplaza ese
// hardcode con el horario real, sin duplicar el cálculo en cada página.

export interface WorkingHourDayLike {
	day_of_week: number
	start_time: string
	end_time: string
	active: boolean
}

export interface CalendarBounds {
	businessHours: Array<{ daysOfWeek: number[]; startTime: string; endTime: string }> | false
	closedDaysOfWeek: number[]
	slotMinTime: string
	slotMaxTime: string
}

const toSeconds = (t: string): number => {
	const [h, m] = t.split(':').map(Number)
	return h * 3600 + m * 60
}

// FullCalendar espera 'HH:mm:ss' — el backend entrega 'HH:mm'.
const normalizeTime = (t: string): string => (t.length === 5 ? `${t}:00` : t)

export function buildCalendarBounds(days: WorkingHourDayLike[]): CalendarBounds {
	const active = days.filter((d) => d.active)

	if (active.length === 0) {
		return {
			businessHours: false,
			closedDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
			slotMinTime: '00:00:00',
			slotMaxTime: '24:00:00',
		}
	}

	const businessHours = active.map((d) => ({
		daysOfWeek: [d.day_of_week],
		startTime: d.start_time,
		endTime: d.end_time,
	}))

	const closedDaysOfWeek = [0, 1, 2, 3, 4, 5, 6].filter(
		(dow) => !active.some((d) => d.day_of_week === dow),
	)

	const earliestStart = active.reduce(
		(min, d) => (toSeconds(d.start_time) < toSeconds(min) ? d.start_time : min),
		active[0].start_time,
	)

	const latestEnd = active.reduce(
		(max, d) => (toSeconds(d.end_time) > toSeconds(max) ? d.end_time : max),
		active[0].end_time,
	)

	return {
		businessHours,
		closedDaysOfWeek,
		slotMinTime: normalizeTime(earliestStart),
		slotMaxTime: normalizeTime(latestEnd),
	}
}

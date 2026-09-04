// Formato de PRESENTACIÓN de fechas visibles al usuario en THE PLANET STUDIO
// (spec §8/§11): DD-MM-YYYY, con hora DD-MM-YYYY HH:mm. La API sigue usando
// su propio formato (ISO) — esto solo cambia cómo se pinta, nunca lo que se
// envía/recibe. No aplica al dominio de Impedimentos (fuera de alcance de
// esta tarea, tiene sus propios formatDate ad-hoc ya existentes).

const pad = (n: number) => String(n).padStart(2, '0')

export function formatDateDMY(input: Date | string): string {
	const d = typeof input === 'string' ? new Date(input) : input
	return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}

export function formatDateTimeDMY(input: Date | string): string {
	const d = typeof input === 'string' ? new Date(input) : input
	return `${formatDateDMY(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Para fechas ISO puras "YYYY-MM-DD" (sin hora) — evita el corrimiento de día
// que puede producir `new Date('YYYY-MM-DD')` al interpretarse como UTC.
export function formatIsoDateDMY(isoDate: string): string {
	const [year, month, day] = isoDate.split('-')
	return `${day}-${month}-${year}`
}

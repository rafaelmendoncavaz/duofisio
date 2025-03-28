// schedule-list/day-detail-schedule.tsx
import { format, addMinutes, isBefore } from "date-fns"
import type { TypeAppointmentList } from "../../../../types/types"
import { ScheduleCard } from "./schedule-card/schedule-card"
import { ChevronLeft } from "lucide-react"

type DayDetailScheduleProps = {
    appointments: TypeAppointmentList[]
    selectedDay: Date
    onBack: () => void
    onAppointmentClick: (appointment: TypeAppointmentList) => void
}

export function DayDetailSchedule({
    appointments,
    selectedDay,
    onBack,
    onAppointmentClick,
}: DayDetailScheduleProps) {
    if (!appointments.length) {
        return (
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-fisioblue hover:underline mb-4"
                >
                    <ChevronLeft size={20} /> Voltar ao calendário
                </button>
                <p>
                    Nenhum agendamento para {format(selectedDay, "dd/MM/yyyy")}.
                </p>
            </div>
        )
    }

    const dates = appointments.map(a => new Date(a.appointmentDate))
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())))
    const latest = new Date(Math.max(...dates.map(d => d.getTime())))
    const intervals: Date[] = []
    let current = earliest

    while (isBefore(current, addMinutes(latest, 30))) {
        intervals.push(current)
        current = addMinutes(current, 30)
    }

    return (
        <div className="mt-6">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-fisioblue hover:underline mb-4"
            >
                <ChevronLeft size={20} /> Voltar ao calendário
            </button>
            <h2 className="text-xl font-semibold mb-4">
                Agendamentos de {format(selectedDay, "dd/MM/yyyy")}
            </h2>
            <div className="grid grid-cols-[120px_1fr] gap-4">
                {/* Linha do Tempo */}
                <div className="relative">
                    {intervals.map((time, index) => (
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={index}
                            className="h-16 border-b text-right pr-2 pt-2 text-sm"
                        >
                            {format(time, "HH:mm")}
                        </div>
                    ))}
                </div>

                {/* Cards */}
                <div>
                    {intervals.map((time, index) => {
                        const slotAppointments = appointments.filter(a => {
                            const apptTime = new Date(a.appointmentDate)
                            return (
                                !isBefore(apptTime, time) &&
                                isBefore(apptTime, addMinutes(time, 30))
                            )
                        })
                        return (
                            <ul
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                className="h-16 border-b flex gap-2 items-start pt-2"
                            >
                                {slotAppointments.map(appt => (
                                    <ScheduleCard
                                        key={appt.id}
                                        appointment={appt}
                                        onAppointmentClick={onAppointmentClick}
                                    />
                                ))}
                            </ul>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

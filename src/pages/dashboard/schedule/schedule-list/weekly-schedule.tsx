// schedule-list/weekly-schedule.tsx
import { format, startOfWeek, addDays } from "date-fns"
import type { TypeAppointmentList } from "../../../../types/types"
import { ScheduleCard } from "./schedule-card/schedule-card"
import { ptBR } from "date-fns/locale"

type WeeklyScheduleProps = {
    appointments: TypeAppointmentList[]
    onAppointmentClick: (appointment: TypeAppointmentList) => void
}

export function WeeklySchedule({
    appointments,
    onAppointmentClick,
}: WeeklyScheduleProps) {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 }) // Domingo
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))

    return (
        <div className="mt-6">
            <div className="grid grid-cols-7 gap-4">
                {days.map(day => (
                    <div
                        key={day.toISOString()}
                        className="text-center pr-4 border-r border-r-black"
                    >
                        <p className="font-semibold text-lg mb-2">
                            {format(day, "EEE dd/MM", { locale: ptBR })}
                        </p>
                        <ul className="space-y-2 flex flex-col items-center">
                            {appointments
                                .filter(
                                    a =>
                                        format(
                                            new Date(a.appointmentDate),
                                            "yyyy-MM-dd"
                                        ) === format(day, "yyyy-MM-dd")
                                )
                                .map(appt => (
                                    <ScheduleCard
                                        key={appt.id}
                                        appointment={appt}
                                        onAppointmentClick={onAppointmentClick}
                                    />
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

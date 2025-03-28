// schedule-list/monthly-schedule.tsx
import { useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    addDays,
    getMonth,
    getYear,
} from "date-fns"
import type { TypeAppointmentList } from "../../../../types/types"
import { DayDetailSchedule } from "./day-detail-schedule"

type MonthlyScheduleProps = {
    appointments: TypeAppointmentList[]
    onAppointmentClick: (appointment: TypeAppointmentList) => void
}

export function MonthlySchedule({
    appointments,
    onAppointmentClick,
}: MonthlyScheduleProps) {
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)

    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    const days = eachDayOfInterval({ start, end })
    const firstDayOfWeek = startOfWeek(start, { weekStartsOn: 0 }) // Domingo
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const month = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ][getMonth(new Date())]

    const paddingDays = Array.from(
        { length: (start.getDay() + 7) % 7 },
        (_, i) => addDays(firstDayOfWeek, i)
    )

    if (selectedDay) {
        const dayAppointments = appointments.filter(
            a =>
                format(new Date(a.appointmentDate), "yyyy-MM-dd") ===
                format(selectedDay, "yyyy-MM-dd")
        )
        return (
            <DayDetailSchedule
                appointments={dayAppointments}
                selectedDay={selectedDay}
                onBack={() => setSelectedDay(null)}
                onAppointmentClick={onAppointmentClick}
            />
        )
    }

    return (
        <div className="mt-2">
            <h2 className="text-xl font-semibold mb-2">
                {month}, {getYear(new Date())}
            </h2>
            <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
                {weekDays.map(day => (
                    <div
                        key={day}
                        className="bg-fisioblue text-white rounded-md"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {paddingDays.map(day => (
                    <div
                        key={day.toISOString()}
                        className="border p-2 min-h-[100px] bg-gray-100"
                    />
                ))}
                {days.map(day => {
                    const dayAppointments = appointments.filter(
                        a =>
                            format(
                                new Date(a.appointmentDate),
                                "yyyy-MM-dd"
                            ) === format(day, "yyyy-MM-dd")
                    )
                    return (
                        <button
                            type="button"
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className="flex flex-col justify-between border p-2 min-h-[100px] hover:bg-fisioblue hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-fisioblue2"
                        >
                            <p className="font-semibold text-start">
                                {format(day, "d")}
                            </p>
                            {dayAppointments.length > 0 && (
                                <p className="mt-1 text-xs font-semibold text-center bg-fisioblue text-white rounded-md p-[2px]">
                                    {dayAppointments.length} agendamento
                                    {dayAppointments.length > 1 ? "s" : ""}
                                </p>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// schedule-list/daily-schedule.tsx
import { useState, useEffect } from "react"
import { format, addMinutes, isBefore, set } from "date-fns"
import type { TypeAppointmentList } from "../../../../types/types"
import { ScheduleCard } from "./schedule-card/schedule-card"

type DailyScheduleProps = {
    appointments: TypeAppointmentList[]
    onAppointmentClick: (appointment: TypeAppointmentList) => void
    isToday: boolean
}

export function DailySchedule({
    appointments,
    onAppointmentClick,
    isToday,
}: DailyScheduleProps) {
    const [currentTime, setCurrentTime] = useState(() => {
        const now = new Date()
        // Forçar UTC-3 independentemente do fuso do navegador
        return new Date(
            now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
        )
    })

    useEffect(() => {
        if (isToday) {
            const interval = setInterval(() => {
                const now = new Date()
                setCurrentTime(
                    new Date(
                        now.toLocaleString("en-US", {
                            timeZone: "America/Sao_Paulo",
                        })
                    )
                )
            }, 60000)
            return () => clearInterval(interval)
        }
    }, [isToday])

    // Definir o início como 06:00 e o fim como 20:00 no dia base, já em UTC-3
    const baseDate = appointments.length
        ? new Date(appointments[0].appointmentDate) // Já vem em UTC-3 do backend
        : new Date(
              new Date().toLocaleString("en-US", {
                  timeZone: "America/Sao_Paulo",
              })
          )
    const start = set(baseDate, {
        hours: 6,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    })
    const end = set(baseDate, {
        hours: 20,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    })
    const intervals: Date[] = []
    let current = start

    while (isBefore(current, addMinutes(end, 30))) {
        intervals.push(current)
        current = addMinutes(current, 30)
    }

    return (
        <div className="mt-6 grid grid-cols-[120px_1fr] gap-4">
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
                {isToday && (
                    <div
                        className="absolute left-0 flex justify-center items-center w-full text-red-700 bg-red-700 h-px"
                        style={{
                            top: `${
                                ((currentTime.getHours() * 60 +
                                    currentTime.getMinutes() -
                                    360) / // 360 minutos = 06:00
                                    30) *
                                64
                            }px`,
                        }}
                    />
                )}
            </div>

            {/* Cards */}
            <div>
                {intervals.map((time, index) => {
                    const slotAppointments = appointments.filter(a => {
                        const apptTime = new Date(a.appointmentDate) // Já em UTC-3 do backend
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
    )
}

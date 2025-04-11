import { useState, useEffect } from "react"
import { format, addMinutes, isBefore, set } from "date-fns"
import type { TypeAppointmentList } from "../../../../types/types"
import { ScheduleCard } from "./schedule-card/schedule-card"

type DailyScheduleProps = {
    appointments: TypeAppointmentList[]
    onSessionClick: (sessionId: string, appointmentId: string) => void
    isToday: boolean
}

export function DailySchedule({
    appointments,
    onSessionClick,
    isToday,
}: DailyScheduleProps) {
    const [currentTime, setCurrentTime] = useState(() => {
        const now = new Date()
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

    // Extrair todas as sessões dos agendamentos
    const allSessions = appointments.flatMap(appointment =>
        appointment.sessions.map(session => ({
            sessionId: session.id,
            appointmentId: appointment.id,
            appointmentDate: new Date(session.appointmentDate),
            duration: session.duration,
            status: session.status,
            patientName: appointment.patient.name,
            cid: appointment.appointmentReason.cid,
            sessionNumber: session.sessionNumber,
            totalSessions: appointment.totalSessions,
        }))
    )

    // Definir o início como 06:00 e o fim como 20:00 no dia base, em UTC-3
    const baseDate = allSessions.length
        ? new Date(allSessions[0].appointmentDate)
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
                        // biome-ignore lint/suspicious/noArrayIndexKey: Intervalos fixos de tempo
                        key={index}
                        className="h-[80px] border-b text-right pr-2 pt-2 text-sm"
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
                                    360) /
                                    30) *
                                80
                            }px`,
                        }}
                    />
                )}
            </div>

            {/* Cards */}
            <div>
                {intervals.map((time, index) => {
                    const slotSessions = allSessions.filter(session => {
                        const sessionTime = new Date(session.appointmentDate)
                        return (
                            !isBefore(sessionTime, time) &&
                            isBefore(sessionTime, addMinutes(time, 30))
                        )
                    })
                    return (
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: Intervalos fixos de tempo
                            key={index}
                            className="h-[80px] border-b flex gap-2 items-start pt-1"
                        >
                            {slotSessions.map(session => (
                                <ul
                                    key={session.sessionId}
                                    className="flex-1 min-w-[60px] max-w-52"
                                >
                                    <ScheduleCard
                                        sessionId={session.sessionId}
                                        appointmentId={session.appointmentId}
                                        patientName={session.patientName}
                                        status={session.status}
                                        cid={session.cid}
                                        sessionNumber={session.sessionNumber}
                                        totalSessions={session.totalSessions}
                                        onSessionClick={onSessionClick}
                                    />
                                </ul>
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

import { useState } from "react"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { TypeAppointmentList } from "../../../../types/types"
import { DayDetailSchedule } from "./day-detail-schedule"
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react"
import { useAPI } from "../../../../store/store"

type WeeklyScheduleProps = {
    appointments: TypeAppointmentList[]
    onSessionClick: (sessionId: string, appointmentId: string) => void
}

export function WeeklySchedule({
    appointments,
    onSessionClick,
}: WeeklyScheduleProps) {
    const { currentWeek, prevWeek, nextWeek, setActiveFilter } = useAPI()
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)

    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

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

    // Função para contar sessões por dia
    const getSession = (day: Date) =>
        allSessions.filter(
            session =>
                format(session.appointmentDate, "yyyy-MM-dd") ===
                format(day, "yyyy-MM-dd")
        )

    const getSessionStatus = (day: Date, status: string) => {
        const session = getSession(day)
            .filter(sessionStatus => sessionStatus.status === status)
            .map(sessionStatus => sessionStatus.status)

        return session
    }

    // Navegação semanal
    const handlePreviousWeek = () => {
        prevWeek()
        setActiveFilter("week")
    }
    const handleNextWeek = () => {
        nextWeek()
        setActiveFilter("week")
    }

    // Se um dia for selecionado, renderizar DayDetailSchedule
    if (selectedDay) {
        const dayAppointments = appointments.filter(appointment =>
            appointment.sessions.some(
                session =>
                    format(new Date(session.appointmentDate), "yyyy-MM-dd") ===
                    format(selectedDay, "yyyy-MM-dd")
            )
        )
        return (
            <DayDetailSchedule
                appointments={dayAppointments}
                selectedDay={selectedDay}
                onBack={() => setSelectedDay(null)}
                onSessionClick={onSessionClick}
            />
        )
    }

    return (
        <div className="mt-6">
            {/* Navegação */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fisiogray">
                    Semana de {format(currentWeek, "dd/MM")} a{" "}
                    {format(addDays(currentWeek, 6), "dd/MM")}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 px-3 py-1 text-slate-100 font-semibold"
                        onClick={handlePreviousWeek}
                    >
                        <ArrowLeftCircle size={20} />
                        Semana Anterior
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 px-3 py-1 text-slate-100 font-semibold"
                        onClick={handleNextWeek}
                    >
                        Próxima Semana
                        <ArrowRightCircle size={20} />
                    </button>
                </div>
            </div>

            {/* Colunas dos Dias */}
            <div className="grid grid-cols-7 gap-4">
                {days.map(day => {
                    const sessionCount = getSession(day).length
                    const solicitado = getSessionStatus(
                        day,
                        "SOLICITADO"
                    ).length
                    const confirmado = getSessionStatus(
                        day,
                        "CONFIRMADO"
                    ).length
                    const cancelado = getSessionStatus(day, "CANCELADO").length
                    const finalizado = getSessionStatus(
                        day,
                        "FINALIZADO"
                    ).length
                    return (
                        <div
                            key={day.toISOString()}
                            className="text-center pr-4 border-r border-r-black"
                        >
                            <p className="font-semibold text-lg text-slate-100 bg-fisioblue rounded-md mb-2">
                                {format(day, "eeeeee dd/MM", { locale: ptBR })}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className="w-full p-4 border rounded-md bg-slate-100 hover:bg-fisioblue hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-fisioblue2"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center bg-blue-100 text-blue-800 p-2 rounded">
                                        <span className="font-semibold text-lg">
                                            {sessionCount}
                                        </span>
                                        <span className="text-sm">
                                            {sessionCount > 1 ||
                                            sessionCount === 0
                                                ? "Sessões"
                                                : "Sessão"}
                                        </span>
                                    </div>

                                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                                    <div className="w-full flex flex-col items-center bg-yellow-100 text-yellow-800 p-2 rounded">
                                        <span className="font-semibold text-lg">
                                            {solicitado}
                                        </span>
                                        <span className="text-sm">
                                            {solicitado > 1 || solicitado === 0
                                                ? "Solicitados"
                                                : "Solicitado"}
                                        </span>
                                    </div>
                                    <div className="w-full flex flex-col items-center bg-green-100 text-green-800 p-2 rounded">
                                        <span className="font-semibold text-lg">
                                            {confirmado}
                                        </span>
                                        <span className="text-sm">
                                            {confirmado > 1 || confirmado === 0
                                                ? "Confirmados"
                                                : "Confirmado"}
                                        </span>
                                    </div>
                                    <div className="w-full flex flex-col items-center bg-gray-200 text-gray-800 p-2 rounded">
                                        <span className="font-semibold text-lg">
                                            {cancelado}
                                        </span>
                                        <span className="text-sm">
                                            {cancelado > 1 || cancelado === 0
                                                ? "Cancelados"
                                                : "Cancelado"}
                                        </span>
                                    </div>
                                    <div className="w-full flex flex-col items-center bg-red-100 text-red-800 p-2 rounded">
                                        <span className="font-semibold text-lg">
                                            {finalizado}
                                        </span>
                                        <span className="text-sm">
                                            {finalizado > 1 || finalizado === 0
                                                ? "Finalizados"
                                                : "Finalizado"}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

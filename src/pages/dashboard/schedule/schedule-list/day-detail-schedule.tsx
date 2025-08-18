import { addMinutes, isBefore } from "date-fns";
import type { TypeAppointmentList } from "../../../../types/types";
import { ScheduleCard } from "./schedule-card/schedule-card";
import { ChevronLeft } from "lucide-react";
import { formatToBrazilTime } from "../../../../utils/date";

type DayDetailScheduleProps = {
    appointments: TypeAppointmentList[];
    selectedDay: Date;
    onBack: () => void;
    onSessionClick: (sessionId: string, appointmentId: string) => void; // Ajustado para sessões
};

export function DayDetailSchedule({
    appointments,
    selectedDay,
    onBack,
    onSessionClick,
}: DayDetailScheduleProps) {
    // Extrair todas as sessões dos agendamentos e filtrar pelo dia selecionado
    const allSessions = appointments
        .flatMap((appointment) =>
            appointment.sessions.map((session) => ({
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
        .filter(
            (session) =>
                formatToBrazilTime(session.appointmentDate, "yyyy-MM-dd") ===
                formatToBrazilTime(selectedDay, "yyyy-MM-dd")
        );

    if (!allSessions.length) {
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
                    Nenhum agendamento para {formatToBrazilTime(selectedDay, "dd/MM/yyyy")}.
                </p>
            </div>
        );
    }

    const dates = allSessions.map((session) => session.appointmentDate);
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    const intervals: Date[] = [];
    let current = earliest;

    while (isBefore(current, addMinutes(latest, 30))) {
        intervals.push(current);
        current = addMinutes(current, 30);
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
                Agendamentos de {formatToBrazilTime(selectedDay, "dd/MM/yyyy")}
            </h2>
            <div className="grid grid-cols-[120px_1fr] gap-4">
                {/* Linha do Tempo */}
                <div className="relative">
                    {intervals.map((time, index) => (
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={index}
                            className="h-[80px] border-b text-right pr-2 pt-2 text-sm"
                        >
                            {formatToBrazilTime(time, "HH:mm")}
                        </div>
                    ))}
                </div>

                {/* Cards */}
                <div>
                    {intervals.map((time, index) => {
                        const slotSessions = allSessions.filter((session) => {
                            const sessionTime = session.appointmentDate;
                            return (
                                !isBefore(sessionTime, time) &&
                                isBefore(sessionTime, addMinutes(time, 30))
                            );
                        });
                        return (
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                className="h-[80px] border-b flex gap-2 items-start pt-1"
                            >
                                {slotSessions.map((session) => (
                                    <ul
                                        key={session.sessionId}
                                        className="flex-1 min-w-[60px] max-w-52"
                                    >
                                        <ScheduleCard
                                            sessionId={session.sessionId}
                                            appointmentId={
                                                session.appointmentId
                                            }
                                            patientName={session.patientName}
                                            status={session.status}
                                            cid={session.cid}
                                            sessionNumber={
                                                session.sessionNumber
                                            }
                                            totalSessions={
                                                session.totalSessions
                                            }
                                            onSessionClick={onSessionClick}
                                        />
                                    </ul>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import type { TypeAppointmentList } from "../../../../types/types";
import { ScheduleCard } from "./schedule-card/schedule-card";
import { formatToBrazilTime } from "../../../../utils/date";

interface AppointmentListProps {
    appointments: TypeAppointmentList[];
    onSessionClick: (sessionId: string, appointmentId: string) => void;
}

export function ScheduleList({
    appointments,
    onSessionClick,
}: AppointmentListProps) {
    // Extrair todas as sessões dos agendamentos
    const allSessions = appointments
        .flatMap((appointment) =>
            appointment.sessions.map((session) => ({
                sessionId: session.id,
                appointmentId: appointment.id,
                appointmentDate: formatToBrazilTime(new Date(session.appointmentDate)),
                duration: session.duration,
                status: session.status,
                patientName: appointment.patient.name,
                cid: appointment.appointmentReason.cid,
                sessionNumber: session.sessionNumber,
                totalSessions: appointment.totalSessions,
            }))
        )
        .sort((a, b) => a.patientName.localeCompare(b.patientName));

    return (
        <ul className="grid grid-cols-5 grid-rows-4 gap-4">
            {allSessions.map((session) => (
                <ScheduleCard
                    key={session.sessionId}
                    sessionId={session.sessionId}
                    appointmentId={session.appointmentId}
                    patientName={session.patientName}
                    status={session.status}
                    cid={session.cid}
                    appointmentDate={session.appointmentDate}
                    sessionNumber={session.sessionNumber}
                    totalSessions={session.totalSessions}
                    onSessionClick={onSessionClick}
                />
            ))}
        </ul>
    );
}

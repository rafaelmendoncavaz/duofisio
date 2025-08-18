import { useState } from "react";
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    addDays,
    getMonth,
    getYear,
} from "date-fns";
import type { TypeAppointmentList } from "../../../../types/types";
import { DayDetailSchedule } from "./day-detail-schedule";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useAPI } from "../../../../store/store";
import { formatToBrazilTime } from "../../../../utils/date";

interface MonthlyScheduleProps {
    appointments: TypeAppointmentList[];
    onSessionClick: (sessionId: string, appointmentId: string) => void;
}

export function MonthlySchedule({
    appointments,
    onSessionClick,
}: MonthlyScheduleProps) {
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const { setActiveFilter, prevMonth, currentMonth, nextMonth } = useAPI();

    // Extrair todas as sessões dos agendamentos
    const allSessions = appointments.flatMap((appointment) =>
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
    );

    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = startOfWeek(start, { weekStartsOn: 0 }); // Domingo
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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
    ][getMonth(currentMonth)];

    const paddingDays = Array.from(
        { length: (start.getDay() + 7) % 7 },
        (_, i) => addDays(firstDayOfWeek, i)
    );

    if (selectedDay) {
        // Filtrar agendamentos que têm sessões no dia selecionado
        const dayAppointments = appointments.filter((appointment) =>
            appointment.sessions.some(
                (session) =>
                    formatToBrazilTime(session.appointmentDate, "yyyy-MM-dd") ===
                    formatToBrazilTime(selectedDay, "yyyy-MM-dd")
            )
        );
        return (
            <DayDetailSchedule
                appointments={dayAppointments}
                selectedDay={selectedDay}
                onBack={() => setSelectedDay(null)}
                onSessionClick={onSessionClick}
            />
        );
    }

    const handlePreviousMonth = () => {
        prevMonth();
        setActiveFilter("month");
    };

    const handleNextMonth = () => {
        nextMonth();
        setActiveFilter("month");
    };

    return (
        <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
                <h2 className="text-xl text-fisiogray font-semibold mb-2">
                    {month}, {getYear(currentMonth)}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 px-3 py-1 text-slate-100 font-semibold"
                        onClick={handlePreviousMonth}
                    >
                        <ArrowLeftCircle size={20} />
                        Mês Anterior
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 px-3 py-1 text-slate-100 font-semibold"
                        onClick={handleNextMonth}
                    >
                        <ArrowRightCircle size={20} />
                        Próximo Mês
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="bg-fisioblue text-white rounded-md"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {paddingDays.map((day) => (
                    <div
                        key={formatToBrazilTime(day, "yyyy-MM-dd")}
                        className="border p-2 min-h-[100px] bg-gray-200"
                    />
                ))}
                {days.map((day) => {
                    const daySessions = allSessions.filter(
                        (session) =>
                            formatToBrazilTime(session.appointmentDate, "yyyy-MM-dd") ===
                            formatToBrazilTime(day, "yyyy-MM-dd")
                    );
                    return (
                        <button
                            type="button"
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className="flex flex-col justify-between border p-2 min-h-[100px] bg-yellow-50 hover:bg-fisioblue hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-fisioblue2"
                        >
                            <p className="font-semibold text-start">
                                {formatToBrazilTime(day, "d")}
                            </p>
                            {daySessions.length > 0 && (
                                <p className="mt-1 text-xs font-semibold text-center bg-blue-100 text-blue-800 rounded-md p-[2px]">
                                    {`${daySessions.length} ${daySessions.length > 1 ? "sessões" : "sessão"}`}
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

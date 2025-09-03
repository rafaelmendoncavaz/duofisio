import ReactPaginate from "react-paginate";
import { ScheduleList } from "./schedule-list";
import { useState } from "react";
import type { TypeAppointmentList } from "../../../../types/types";
import { useAPI } from "../../../../store/store";
import { format, parse } from "date-fns";

interface ScheduleHistoryProps {
    appointments: TypeAppointmentList[];
    onSessionClick: (sessionId: string, appointmentId: string) => void;
}

export function ScheduleHistory({
    appointments,
    onSessionClick,
}: ScheduleHistoryProps) {
    const { startDate, endDate } = useAPI();

    const start = typeof startDate === "string" ? format(parse(startDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy") : format(startDate as Date, "dd/MM/yyyy");
    const end = typeof endDate === "string" ? format(parse(endDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy") : format(endDate as Date, "dd/MM-yyyy");

    const [page, setPage] = useState(0);
    const itemsPerPage = 20;
    const pageCount = Math.ceil((appointments.length || 0) / itemsPerPage);
    const paginatedAppointments = appointments.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-semibold text-fisiogray">
                Histórico de agendamentos entre:{" "}
                <span className="font-normal italic">{`${start} a ${end}`}</span>
            </h1>
            {appointments ? (
                appointments.length > 0 ? (
                    <>
                        <ScheduleList
                            appointments={paginatedAppointments}
                            onSessionClick={onSessionClick}
                        />
                        {pageCount >= 1 && (
                            <ReactPaginate
                                pageCount={pageCount}
                                onPageChange={({ selected }) =>
                                    setPage(selected)
                                }
                                containerClassName="flex gap-2 justify-center mt-6"
                                pageClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                activeClassName="bg-fisioblue2"
                                previousClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                nextClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                disabledClassName="opacity-50 cursor-not-allowed"
                                previousLabel="Anterior"
                                nextLabel="Próximo"
                            />
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-500">
                        Nenhum agendamento encontrado.
                    </p>
                )
            ) : (
                <p className="text-center text-gray-500">
                    Carregando agendamentos...
                </p>
            )}
        </div>
    );
}

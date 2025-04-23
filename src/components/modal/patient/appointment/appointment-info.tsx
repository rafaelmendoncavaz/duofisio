import { ArrowLeftCircle, CalendarSync, CalendarX2, X } from "lucide-react";
import { useAPI, useModal } from "../../../../store/store";
import { format } from "date-fns";
import type { TypePatient } from "../../../../types/types";
import { RepeatAppointmentForm } from "../../../forms/repeat-appointment-form";
import { Input } from "../../../global/input";
import { useState } from "react";
import { SessionList } from "./session-list";
import ReactPaginate from "react-paginate";

interface AppointmentInfoProps {
    appointmentData: TypePatient["appointments"][0] | null;
    clearAppointmentData: () => void;
}

export function AppointmentInfo({
    appointmentData,
    clearAppointmentData,
}: AppointmentInfoProps) {
    const {
        patientData,
        getSingleAppointment,
        deleteAppointment,
        clearRecord,
        clearRecords,
    } = useAPI();
    const { closeModal } = useModal();

    if (!appointmentData || !patientData) {
        return <p>Nenhum dado disponível</p>;
    }

    const [isRepeating, setIsRepeating] = useState(false);

    const [page, setPage] = useState(0);
    const itemsPerPage = 2;
    const pageCount = Math.ceil(
        (appointmentData.sessions.length || 0) / itemsPerPage
    );
    const orderedSessions = appointmentData.sessions.sort(
        (a, b) => b.sessionNumber - a.sessionNumber
    );
    const paginatedSessions =
        orderedSessions.slice(page * itemsPerPage, (page + 1) * itemsPerPage) ||
        [];

    const createdAt = format(
        new Date(appointmentData.createdAt).toISOString().split("T")[0],
        "dd-MM-yyyy"
    );
    const updatedAt = format(
        new Date(appointmentData.updatedAt).toISOString().split("T")[0],
        "dd-MM-yyyy"
    );
    const formattedPhone =
        patientData.phone
            ?.replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2") || "Não Informado";

    const handleDelete = async () => {
        const confirmation = window.confirm(
            "Você está prestes a deletar este agendamento.\nEsta ação não pode ser desfeita!"
        );
        if (!confirmation) return;

        await deleteAppointment(appointmentData.id);
        clearRecord();
        clearRecords();
        closeModal();
    };

    const checkForUnfinishedSessions = appointmentData.sessions.some(
        (check) => check.status !== "FINALIZADO"
    );

    const toggleRepeat = async () => {
        if (checkForUnfinishedSessions) {
            alert("Você só pode repetir agendamentos finalizados!");
            return;
        }
        await getSingleAppointment(appointmentData.sessions[0].id);
        setIsRepeating((prev) => !prev);
    };

    const currentSession =
        appointmentData.totalSessions > 1
            ? `${appointmentData.totalSessions} sessões`
            : `${appointmentData.totalSessions} sessão`;

    return (
        <div className="flex flex-col gap-4 py-2 w-full mx-auto overflow-hidden scrollbar-hidden overflow-y-auto text-fisiogray">
            <div className="flex flex-col">
                <p className="text-xs text-slate-500 italic">
                    Criado em: {createdAt} | Atualizado em: {updatedAt}
                </p>
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">
                        {`Informações do Agendamento: (${currentSession})`}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                            onClick={() => clearAppointmentData()}
                        >
                            <ArrowLeftCircle size={18} />
                            Voltar
                        </button>

                        <button
                            title="Repetir Agendamento"
                            type="button"
                            onClick={toggleRepeat}
                            className={`rounded-md p-2 text-white ${isRepeating ? "bg-red-500 hover:bg-red-600" : "bg-emerald-800 hover:bg-emerald-900"}`}
                        >
                            {isRepeating ? (
                                <X size={20} />
                            ) : (
                                <CalendarSync size={20} />
                            )}
                        </button>

                        <button
                            title="Excluir Sessão"
                            type="button"
                            onClick={handleDelete}
                            className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                        >
                            <CalendarX2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block" htmlFor="patientName">
                    Paciente
                </label>
                <Input
                    colorVariant="disabled"
                    id="patientName"
                    type="text"
                    disabled={true}
                    value={patientData.name}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block" htmlFor="patientPhone">
                        Telefone
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="patientPhone"
                        type="text"
                        disabled={true}
                        value={formattedPhone}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="patientEmail">
                        Email
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="patientEmail"
                        type="text"
                        disabled={true}
                        value={patientData.email || "Não Informado"}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="appointmentCID">
                        CID
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="appointmentCID"
                        type="text"
                        disabled={true}
                        value={appointmentData.clinicalRecord.cid}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="appointmentAllegation">
                        Queixa do Paciente
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="appointmentAllegation"
                        type="text"
                        disabled={true}
                        value={appointmentData.clinicalRecord.allegation}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block" htmlFor="diagnosis">
                    Diagnóstico
                </label>
                <textarea
                    rows={1}
                    className="w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape"
                    disabled={true}
                    value={appointmentData.clinicalRecord.diagnosis}
                />
            </div>

            <h1 className="text-lg font-semibold">
                {isRepeating ? "Repetir Agendamento" : "Sessões"}
            </h1>

            <div className="w-full h-px bg-black shadow-shape" />

            {isRepeating ? (
                <RepeatAppointmentForm />
            ) : appointmentData.sessions.length ? (
                <>
                    <SessionList sessions={paginatedSessions} />
                    {pageCount >= 1 && (
                        <ReactPaginate
                            pageCount={pageCount}
                            onPageChange={({ selected }) => setPage(selected)}
                            containerClassName="flex gap-2 justify-center mt-4"
                            pageClassName="px-3 py-1 bg-fisioblue text-white rounded"
                            activeClassName="bg-fisioblue2"
                            previousClassName="px-3 py-1 bg-fisioblue text-white rounded"
                            previousLabel="Anterior"
                            nextClassName="px-3 py-1 bg-fisioblue text-white rounded"
                            nextLabel="Próximo"
                            disabledClassName="opacity-50 cursor-not-allowed"
                        />
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500">
                    Nenhum agendamento encontrado.
                </p>
            )}
        </div>
    );
}

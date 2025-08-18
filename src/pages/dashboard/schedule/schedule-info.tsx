import {
    CalendarCheck,
    CalendarCog,
    CalendarSync,
    CalendarX2,
    X,
} from "lucide-react";
import { useAPI, useModal } from "../../../store/store";
import { EditAppointmentForm } from "../../../components/forms/edit-appointment-form";
import { Input } from "../../../components/global/input";
import { useState } from "react";
import { RepeatAppointmentForm } from "../../../components/forms/repeat-appointment-form";
import { isBefore, format } from "date-fns";
import type { TypeAppointmentUpdate } from "../../../types/types";

export function ScheduleInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);

    const {
        filteredAppointments,
        sessionData,
        getAppointments,
        updateAppointment,
        deleteAppointment,
    } = useAPI();
    const { closeModal } = useModal();

    if (!sessionData) return null;

    const currentDate = new Date();
    const appointmentDate = new Date(sessionData.appointmentDate);
    const isPastAppointment = isBefore(appointmentDate, currentDate);
    const createdAt = format(new Date(sessionData.appointment.createdAt), "dd-MM-yyyy");
    const updatedAt = format(new Date(sessionData.appointment.updatedAt), "dd-MM-yyyy");


    const formattedPhone =
        sessionData.appointment.patient.phone
            ?.replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2") || "Não Informado";

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const checkForUnfinishedSessions = filteredAppointments
        ?.filter((appointment) => appointment.id === sessionData.appointment.id)
        .some((check) => {
            const sessions = check.sessions.some(
                (checkStatus) => checkStatus.status !== "FINALIZADO"
            );
            return sessions;
        });

    const toggleRepeat = () => {
        if (checkForUnfinishedSessions) {
            alert("Você só pode repetir atendimentos finalizados!");
            return;
        }
        setIsRepeating((prev) => !prev);
    };

    const terminateAppointment = async () => {
        if (!isPastAppointment) return;

        const updateData: TypeAppointmentUpdate = {
            status: "FINALIZADO",
        };

        const confirmation = window.confirm(
            "Marcar esta sessão como: FINALIZADO.\nEsta ação não pode ser desfeita!"
        );

        if (confirmation) {
            const result = await updateAppointment(
                updateData,
                sessionData.id // sessionId
            );
            if (result.success) {
                await getAppointments(); // Atualiza a lista de agendamentos
                closeModal();
            }
        }
    };

    const handleDelete = async () => {
        if (!sessionData) return;
        const confirmation = window.confirm(
            "Você está prestes a excluir o Agendamento.\nIsto apagará todas as sessões relacionadas! \nEsta ação não pode ser desfeita!"
        );

        if (confirmation) {
            const result = await deleteAppointment(sessionData.appointment.id); // appointmentId
            if (result.success) {
                await getAppointments(); // Atualiza a lista de agendamentos
                closeModal();
            }
        }
    };

    const currentSession = `sessão ${sessionData.sessionNumber} de ${sessionData.appointment.totalSessions}`;

    return (
        <div className="flex flex-col gap-4 py-2 w-full mx-auto max-h-[70vh] overflow-hidden scrollbar-hidden overflow-y-auto">
            <div className="flex flex-col">
                <p className="text-xs text-slate-500 italic">
                    Criado em: {createdAt} | Atualizado em: {updatedAt}
                </p>

                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">
                        {`Informações do Agendamento: (${currentSession})`}
                    </h1>
                    <div className="flex items-center gap-4">
                        {isPastAppointment &&
                        sessionData.status !== "FINALIZADO" ? (
                            <button
                                title="Finalizar Sessão"
                                type="button"
                                onClick={terminateAppointment}
                                className="rounded-md bg-slate-600 text-white p-2 hover:bg-slate-700"
                            >
                                <CalendarCheck size={20} />
                            </button>
                        ) : null}
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
                            title="Editar Sessão"
                            type="button"
                            onClick={toggleEdit}
                            className={`rounded-md p-2 text-white ${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            {isEditing ? (
                                <X size={20} />
                            ) : (
                                <CalendarCog size={20} />
                            )}
                        </button>
                        <button
                            title="Excluir Sessão"
                            type="button"
                            onClick={handleDelete}
                            className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                        >
                            <CalendarX2 size={20} />
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
                    value={sessionData.appointment.patient.name}
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
                        value={
                            sessionData.appointment.patient.email ||
                            "Não Informado"
                        }
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
                        value={sessionData.appointment.appointmentReason.cid}
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
                        value={
                            sessionData.appointment.appointmentReason.allegation
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block" htmlFor="diagnosis">
                    Diagnóstico
                </label>
                <textarea
                    rows={3}
                    className="w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape"
                    disabled={true}
                    value={sessionData.appointment.appointmentReason.diagnosis}
                />
            </div>

            <div className="w-full h-px bg-black shadow-shape" />

            <h1 className="text-lg font-semibold">
                {isRepeating ? "Repetir Agendamento" : "Informações da Sessão"}
            </h1>

            {isRepeating ? (
                <RepeatAppointmentForm />
            ) : (
                <EditAppointmentForm isEditing={isEditing} />
            )}
        </div>
    );
}

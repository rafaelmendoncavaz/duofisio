import { format, isBefore } from "date-fns";
import type {
    TypeAppointmentUpdate,
    TypePatient,
} from "../../../../types/types";
import { useAPI } from "../../../../store/store";
import {
    AlarmClock,
    CalendarCheck,
    CalendarCheck2,
    CalendarX,
    ChartNoAxesCombined,
    Flag,
    ListOrdered,
} from "lucide-react";

interface SessionCardProps {
    session: TypePatient["appointments"][0]["sessions"][0];
}

export function SessionCard({ session }: SessionCardProps) {
    const {
        patientData,
        getSinglePatient,
        updateAppointment,
        getAppointments,
    } = useAPI();

    if (!patientData) {
        return <p>Não foram encontrados dados deste paciente</p>;
    }

    const currentDate = new Date();
    const appointmentDate = new Date(session.appointmentDate);
    const currentAppointment = isBefore(appointmentDate, currentDate);

    const confirmAppointment = async () => {
        const updateData: TypeAppointmentUpdate = {
            status: "CONFIRMADO",
        };

        const confirmation = window.confirm(
            "Deseja marcar esta sessão como: CONFIRMADO?"
        );

        if (confirmation) {
            const result = await updateAppointment(updateData, session.id);

            if (result.success) {
                await getAppointments();
                await getSinglePatient(patientData.id);
            }
        }
    };

    const terminateAppointment = async () => {
        if (!currentAppointment) {
            alert("Você só pode finalizar sessões anteriores a hoje!");
            return;
        }

        const updateData: TypeAppointmentUpdate = {
            status: "FINALIZADO",
        };

        const confirmation = window.confirm(
            "Marcar esta sessão como: FINALIZADO.\nEsta ação não pode ser desfeita!"
        );

        if (confirmation) {
            const result = await updateAppointment(updateData, session.id);
            if (result.success) {
                await getAppointments();
                await getSinglePatient(patientData.id);
            }
        }
    };

    const sessionDate = format(session.appointmentDate, "dd/MM/yyyy");

    const styleGuides = {
        solicitado:
            session.status === "SOLICITADO" &&
            "border-yellow-800 bg-yellow-100 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-100",
        confirmado:
            session.status === "CONFIRMADO" &&
            "border-green-800 bg-green-100 text-green-800 hover:bg-green-800 hover:text-green-100",
        cancelado:
            session.status === "CANCELADO" &&
            "border-gray-800 bg-gray-200 text-gray-800 hover:bg-gray-800 hover:text-gray-200",
        finalizado:
            session.status === "FINALIZADO" &&
            "border-red-800 bg-red-100 text-red-800 hover:bg-red-800 hover:text-red-100",
    };

    return (
        <li
            tabIndex={0}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Componente funcional como botão
            // biome-ignore lint/a11y/useSemanticElements: Mantido como li para consistência com lista
            role="button"
            className={`${styleGuides.solicitado || styleGuides.confirmado || styleGuides.cancelado || styleGuides.finalizado} flex flex-col gap-1 border rounded-md shadow-shape cursor-pointer p-2 transition-colors focus:outline-none focus:ring-2 overflow-hidden `}
            title={`Ver detalhes da sessão ${session.sessionNumber} de ${patientData.name}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <CalendarCheck2 size={16} />
                    <span className="text-xs font-semibold">{sessionDate}</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="text-sm">
                        Sessão {session.sessionNumber}
                    </span>
                    <ListOrdered size={16} />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <AlarmClock size={16} />
                    <span className="text-sm italic">
                        {session.duration} min
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="text-xs font-normal truncate">
                        {session.status}
                    </span>
                    <Flag size={16} />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <ChartNoAxesCombined size={16} />
                    <span className="text-sm truncate">
                        {session.progress || "Nenhum progresso registrado"}
                    </span>
                </div>
                {session.status === "SOLICITADO" && !currentAppointment ? (
                    <button
                        type="button"
                        title="Confirmar Sessão"
                        className="rounded-md bg-green-600 text-white p-2 hover:bg-green-700"
                        onClick={confirmAppointment}
                    >
                        <CalendarCheck size={12} />
                    </button>
                ) : session.status !== "FINALIZADO" ? (
                    <button
                        type="button"
                        title="Finalizar Sessão"
                        className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                        onClick={terminateAppointment}
                    >
                        <CalendarX size={12} />
                    </button>
                ) : null}
            </div>
        </li>
    );
}

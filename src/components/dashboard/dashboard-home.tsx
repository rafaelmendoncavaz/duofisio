import { isSameDay, format, isBefore, startOfDay } from "date-fns";
import { DashboardTemplate } from "./dashboard-template";
import { useAPI, useModal } from "../../store/store";
import {
    AlarmClock,
    BriefcaseMedical,
    CalendarCheck,
    CalendarX,
    CircleUserRound,
    Clock,
    Flag,
    ListOrdered,
    Settings,
    Settings2,
    CircleAlert,
    Smile,
} from "lucide-react";
import { AppointmentInfoModal } from "../../pages/dashboard/schedule/modal/appointment-info-modal";
import { GetPatientInfoModal } from "../modal/patient/get-patient-info-modal";

export function DashboardHome() {
    const {
        user,
        verifyAuth,
        getAppointments,
        getSingleAppointment,
        updateAppointment,
        getSinglePatient,
    } = useAPI();
    const {
        isSingleAppointmentModalOpen,
        isSinglePatientModalOpen,
        openSingleAppointmentModal,
        openSinglePatientModal,
    } = useModal();

    if (!user) return null;

    const currentDate = new Date();
    const todaysAppointments = user.appointments
        .flatMap((appointment) =>
            appointment.sessions
                .filter((session) =>
                    isSameDay(new Date(session.appointmentDate), currentDate)
                )
                .map((session) => ({
                    ...session,
                    patientId: appointment.patient.id,
                    appointmentId: appointment.id,
                    patientName: appointment.patient.name,
                    totalSessions: appointment.totalSessions,
                    cid: appointment.clinicalRecord.cid,
                }))
        )
        .sort(
            (a, b) =>
                new Date(a.appointmentDate).getTime() -
                new Date(b.appointmentDate).getTime()
        );

    const pastPending = user.appointments.flatMap((appointment) =>
        appointment.sessions.filter((session) => {
            const sessionDate = startOfDay(new Date(session.appointmentDate));
            const today = startOfDay(currentDate);

            return (
                isBefore(sessionDate, today) &&
                ["SOLICITADO", "CONFIRMADO"].includes(session.status)
            );
        })
    ).length;

    const statusCounts = {
        CONFIRMADO: todaysAppointments.filter((s) => s.status === "CONFIRMADO")
            .length,
        SOLICITADO: todaysAppointments.filter((s) => s.status === "SOLICITADO")
            .length,
        FINALIZADO: todaysAppointments.filter((s) => s.status === "FINALIZADO")
            .length,
        CANCELADO: todaysAppointments.filter((s) => s.status === "CANCELADO")
            .length,
    };

    const handleConfirmOrFinalize = async (
        sessionId: string,
        status: "CONFIRMADO" | "FINALIZADO"
    ) => {
        const updateData = { status };

        const confirmation = window.confirm(
            status === "FINALIZADO"
                ? "Marcar esta sessão como: FINALIZADO.\nEsta ação não pode ser desfeita!"
                : "Deseja marcar esta sessão como CONFIRMADO?"
        );

        if (confirmation) {
            const result = await updateAppointment(updateData, sessionId);

            if (result.success) {
                await getAppointments();
                await verifyAuth();
            }
        }
    };

    async function openEditModal(sessionId: string) {
        await getSingleAppointment(sessionId);
        openSingleAppointmentModal();
    }

    async function openPatientModal(patientId: string) {
        await getSinglePatient(patientId);
        openSinglePatientModal();
    }

    return (
        <DashboardTemplate>
            {/* Seção 1: Dados e Estatísticas */}
            <section className="space-y-2">
                <h1 className="text-2xl text-fisiogray font-bold">
                    Bem-vindo, {user.name}
                </h1>
                <p className="text-gray-600">
                    Hoje, {format(currentDate, "dd 'de' MMMM 'de' yyyy")}
                </p>
                <h1 className="text-xl text-fisiogray font-bold italic">
                    Seus agendamentos de hoje
                </h1>

                <div className="w-full h-px bg-fisioblue shadow-shape" />

                <div className="mt-4 flex gap-4">
                    <div className="p-3 bg-blue-100 text-blue-800 rounded">
                        Total do dia: {todaysAppointments.length}
                    </div>
                    <div className="p-3 bg-green-100 text-green-800 rounded">
                        Confirmados: {statusCounts.CONFIRMADO}
                    </div>
                    <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
                        Solicitados: {statusCounts.SOLICITADO}
                    </div>
                    <div className="p-3 bg-gray-100 text-gray-800 rounded">
                        Finalizados: {statusCounts.FINALIZADO}
                    </div>
                </div>
                {pastPending > 0 ? (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded flex items-center gap-2">
                        <CircleAlert size={16} />{" "}
                        <span>
                            Atenção: {pastPending} agendamento(s) passado(s) não
                            finalizado(s)!
                        </span>
                    </div>
                ) : (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded flex items-center gap-2">
                        <Smile size={16} />{" "}
                        <span>
                            Parabéns! Seus agendamentos estão em em dia.
                        </span>
                    </div>
                )}
            </section>

            {/* Seção 2: Tabela de Agendamentos */}
            <section>
                <h2 className="text-lg font-semibold mb-2">
                    Agendamentos de Hoje
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-fisioblue">
                            <tr className="bg-fisioblue text-slate-100">
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <CircleUserRound size={16} />
                                        Paciente
                                    </div>
                                </th>
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <ListOrdered size={16} />
                                        Sessão
                                    </div>
                                </th>
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        Horário
                                    </div>
                                </th>
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <AlarmClock size={16} />
                                        Duração
                                    </div>
                                </th>
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <BriefcaseMedical size={16} />
                                        Motivo
                                    </div>
                                </th>
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <Flag size={16} />
                                        Status
                                    </div>
                                </th>
                                <th className="p-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <Settings2 size={16} />
                                        Ações
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="shadow-shape">
                            {todaysAppointments.map((session) => (
                                <tr
                                    key={session.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-2 font-semibold truncate">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPatientModal(
                                                    session.patientId
                                                )
                                            }
                                            className="flex items-center gap-2 bg-fisiolightgray/20 hover:bg-fisiolightgray/10 px-1 rounded-md"
                                        >
                                            <CircleUserRound size={16} />
                                            {session.patientName}
                                        </button>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <ListOrdered size={16} />
                                            {`${session.sessionNumber} de ${session.totalSessions}`}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {format(
                                                new Date(
                                                    session.appointmentDate
                                                ),
                                                "HH:mm"
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <AlarmClock size={16} />
                                            {session.duration} min
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <BriefcaseMedical size={16} />
                                            {session.cid}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${
                                                session.status === "CONFIRMADO"
                                                    ? "bg-green-100 text-green-800"
                                                    : session.status ===
                                                        "SOLICITADO"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : session.status ===
                                                          "FINALIZADO"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="p-2 flex gap-2">
                                        {session.status === "SOLICITADO" && (
                                            <button
                                                type="button"
                                                title="Confirmar"
                                                onClick={() =>
                                                    handleConfirmOrFinalize(
                                                        session.id,
                                                        "CONFIRMADO"
                                                    )
                                                }
                                                className="px-2 py-1 bg-green-700 text-white rounded"
                                            >
                                                <CalendarCheck size={18} />
                                            </button>
                                        )}
                                        {session.status !== "FINALIZADO" && (
                                            <button
                                                type="button"
                                                title="Finalizar"
                                                onClick={() =>
                                                    handleConfirmOrFinalize(
                                                        session.id,
                                                        "FINALIZADO"
                                                    )
                                                }
                                                className="px-2 py-1 bg-red-700 text-white rounded"
                                            >
                                                <CalendarX size={18} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            title="Editar"
                                            onClick={() =>
                                                openEditModal(session.id)
                                            }
                                            className="px-2 py-1  text-fisiogray bg-fisiolightgray/20 rounded"
                                        >
                                            <Settings size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {isSingleAppointmentModalOpen && <AppointmentInfoModal />}
            {isSinglePatientModalOpen && <GetPatientInfoModal />}
        </DashboardTemplate>
    );
}

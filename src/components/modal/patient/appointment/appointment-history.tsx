import { ArrowLeftCircle, ClipboardPlus } from "lucide-react";
import { useAPI } from "../../../../store/store";
import { AppointmentList } from "./appointment-list";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { AppointmentInfo } from "./appointment-info";
import type { TypePatient } from "../../../../types/types";
import { CreateAppointmentForm } from "../../../forms/create-appointment-form";

interface AppointmentHistoryProps {
    appointmentHistory: boolean;
    setAppointmentHistory: (isOpen: boolean) => void;
}

export function AppointmentHistory({
    appointmentHistory,
    setAppointmentHistory,
}: AppointmentHistoryProps) {
    const {
        patientData,
        getClinicalRecords,
        clinicalRecords,
        selectedAppointmentData,
        setSelectedAppointmentData,
        clearSelectedAppointmentData,
    } = useAPI();

    if (!patientData) {
        return <p>Dados do paciente não encontrados</p>;
    }

    const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] =
        useState(false);
    const [isSelectedAppointmentOpen, setIsSelectedAppointmentOpen] =
        useState(false);

    const [page, setPage] = useState(0);
    const itemsPerPage = 4;
    const pageCount = Math.ceil(
        (patientData.appointments.length || 0) / itemsPerPage
    );
    const paginatedAppointments =
        patientData.appointments.slice(
            page * itemsPerPage,
            (page + 1) * itemsPerPage
        ) || [];

    const setAppointmentData = (
        appointment: TypePatient["appointments"][0]
    ) => {
        setIsSelectedAppointmentOpen(true);
        setSelectedAppointmentData(appointment);
    };

    const clearAppointmentData = () => {
        setIsSelectedAppointmentOpen(false);
        clearSelectedAppointmentData();
    };

    const openCreateAppointmentForm = async () => {
        if (!clinicalRecords) {
            await getClinicalRecords(patientData.id);
        }
        setIsCreateAppointmentOpen(true);
    };

    const closeCreateAppointmentForm = () => {
        setIsCreateAppointmentOpen(false);
    };

    if (isSelectedAppointmentOpen) {
        return (
            <AppointmentInfo
                appointmentData={selectedAppointmentData}
                clearAppointmentData={clearAppointmentData}
            />
        );
    }

    return (
        <section className="flex flex-col gap-4 text-fisiogray">
            {appointmentHistory && !isCreateAppointmentOpen && (
                <>
                    <div className="flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                                onClick={() => setAppointmentHistory(false)}
                            >
                                <ArrowLeftCircle size={20} />
                                Voltar
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                                onClick={openCreateAppointmentForm}
                            >
                                <ClipboardPlus size={20} />
                                Novo Agendamento
                            </button>
                        </div>

                        <div className="truncate">
                            <h2 className="text-lg font-semibold truncate">
                                Agendamentos de{" "}
                                {patientData?.name ?? "Paciente"}
                            </h2>
                        </div>
                    </div>

                    <div className="w-full h-px bg-black shadow-shape" />

                    {patientData?.appointments.length ? (
                        <>
                            <AppointmentList
                                appointments={paginatedAppointments}
                                setAppointmentData={setAppointmentData}
                            />
                            {pageCount >= 1 && (
                                <ReactPaginate
                                    pageCount={pageCount}
                                    onPageChange={({ selected }) =>
                                        setPage(selected)
                                    }
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
                </>
            )}
            {isCreateAppointmentOpen && (
                <CreateAppointmentForm
                    closeCreateAppointment={closeCreateAppointmentForm}
                />
            )}
        </section>
    );
}

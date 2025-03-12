import { useEffect } from "react"
import { AppointmentFilter } from "../../../components/appointment-filter/appointment-filter"
import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { useAPI, useModal } from "../../../store/store"
import { AppointmentInfoModal } from "./modal/appointment-info-modal"
import { CreateAppointmentModal } from "./modal/create-appointment-modal"
import type { TypeAppointmentList } from "../../../types/types"
import { ScheduleList } from "./schedule-list/schedule-list"

export function DashboardSchedule() {
    const {
        isCreateAppointmentModalOpen,
        isSingleAppointmentModalOpen,
        openSingleAppointmentModal,
    } = useModal()
    const { appointmentList, getAppointments, getSingleAppointment } = useAPI()

    // Carregamento da lista de agendamentos no componente
    useEffect(() => {
        if (!appointmentList) {
            getAppointments()
        }
    }, [appointmentList, getAppointments])

    // console.log(appointmentList)

    // Função de carregamento dos dados do agendamento no modal
    async function handleClick(appointment: TypeAppointmentList) {
        await getSingleAppointment(appointment.id)
        openSingleAppointmentModal()
    }

    return (
        <DashboardTemplate>
            <AppointmentFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <h1>Os agendamentos/calendário renderizarão aqui</h1>

            {appointmentList ? (
                <ScheduleList
                    appointments={appointmentList}
                    handleClick={handleClick}
                />
            ) : (
                <p>Nenhum agendamento encontrado</p>
            )}

            {isCreateAppointmentModalOpen && <CreateAppointmentModal />}
            {isSingleAppointmentModalOpen && <AppointmentInfoModal />}
        </DashboardTemplate>
    )
}

import { useEffect } from "react"
import { AppointmentFilter } from "../../../components/appointment-filter/appointment-filter"
import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { useAPI, useModal } from "../../../store/store"
import { AppointmentInfoModal } from "./modal/appointment-info-modal"
import type { TypeAppointmentList } from "../../../types/types"
import { MonthlySchedule } from "./schedule-list/monthly-schedule"
import { WeeklySchedule } from "./schedule-list/weekly-schedule"
import { DailySchedule } from "./schedule-list/daily-schedule"

export function DashboardSchedule() {
    const { isSingleAppointmentModalOpen, openSingleAppointmentModal } =
        useModal()
    const {
        appointmentList,
        getAppointments,
        getSingleAppointment,
        activeFilter,
        setActiveFilter,
    } = useAPI()

    // Carregamento da lista de agendamentos no componente
    useEffect(() => {
        const loadTodaysAppointments = async () => {
            if (!appointmentList && !activeFilter) {
                setActiveFilter("today")
                await getAppointments({ filter: "today" })
            }
        }
        loadTodaysAppointments()
    }, [appointmentList, getAppointments, activeFilter, setActiveFilter])

    // Função de carregamento dos dados do agendamento no modal
    async function onAppointmentClick(appointment: TypeAppointmentList) {
        await getSingleAppointment(appointment.id)
        openSingleAppointmentModal()
    }

    return (
        <DashboardTemplate>
            <AppointmentFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            {appointmentList ? (
                <div className="overflow-hidden scrollbar-hidden overflow-y-auto flex-1">
                    {activeFilter === "today" || activeFilter === "tomorrow" ? (
                        <DailySchedule
                            appointments={appointmentList}
                            onAppointmentClick={onAppointmentClick}
                            isToday={activeFilter === "today"}
                        />
                    ) : activeFilter === "week" ? (
                        <WeeklySchedule
                            appointments={appointmentList}
                            onAppointmentClick={onAppointmentClick}
                        />
                    ) : activeFilter === "month" ? (
                        <MonthlySchedule
                            appointments={appointmentList}
                            onAppointmentClick={onAppointmentClick}
                        />
                    ) : (
                        <p>
                            Selecione um filtro para visualizar os agendamentos
                            em formato de calendário.
                        </p>
                    )}
                </div>
            ) : (
                <p>Nenhum agendamento encontrado</p>
            )}

            {isSingleAppointmentModalOpen && <AppointmentInfoModal />}
        </DashboardTemplate>
    )
}

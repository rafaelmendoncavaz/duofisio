import { useEffect } from "react"
import { ScheduleFilter } from "./schedule-filter/schedule-filter"
import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { useAPI, useModal } from "../../../store/store"
import { AppointmentInfoModal } from "./modal/appointment-info-modal"
import { MonthlySchedule } from "./schedule-list/monthly-schedule"
import { WeeklySchedule } from "./schedule-list/weekly-schedule"
import { DailySchedule } from "./schedule-list/daily-schedule"
import { ScheduleHistory } from "./schedule-list/schedule-history"
import { TimespanModal } from "./schedule-filter/timespan-modal"

export function DashboardSchedule() {
    const {
        isFilterByTimespanModalOpen,
        isSingleAppointmentModalOpen,
        openSingleAppointmentModal,
    } = useModal()
    const {
        appointmentList,
        filteredAppointments,
        getAppointments,
        getSingleAppointment,
        activeFilter,
    } = useAPI()

    // Carregamento da lista de agendamentos no componente
    useEffect(() => {
        const loadTodaysAppointments = async () => {
            if (!appointmentList) {
                await getAppointments()
            }
        }
        loadTodaysAppointments()
    }, [appointmentList, getAppointments])

    // Função de carregamento dos dados da sessão no modal
    async function onSessionClick(sessionId: string, appointmentId: string) {
        await getSingleAppointment(sessionId)
        openSingleAppointmentModal()
    }

    return (
        <DashboardTemplate>
            <ScheduleFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            {filteredAppointments ? (
                <div className="overflow-hidden scrollbar-hidden overflow-y-auto overflow-x-auto flex-1">
                    {activeFilter === "history" ? (
                        <ScheduleHistory
                            appointments={filteredAppointments}
                            onSessionClick={onSessionClick}
                        />
                    ) : activeFilter === "today" ||
                      activeFilter === "tomorrow" ? (
                        <DailySchedule
                            appointments={filteredAppointments}
                            onSessionClick={onSessionClick}
                            isToday={activeFilter === "today"}
                        />
                    ) : activeFilter === "week" ? (
                        <WeeklySchedule
                            appointments={filteredAppointments}
                            onSessionClick={onSessionClick}
                        />
                    ) : activeFilter === "month" ? (
                        <MonthlySchedule
                            appointments={filteredAppointments}
                            onSessionClick={onSessionClick}
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
            {isFilterByTimespanModalOpen && <TimespanModal />}
        </DashboardTemplate>
    )
}

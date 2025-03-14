import { isSameDay } from "date-fns"
import { DashboardTemplate } from "../../components/dashboard/dashboard-template"
import { useAPI } from "../../store/store"

export function DashboardHome() {
    const { user } = useAPI()
    if (!user) return
    const { appointments } = user
    const currentDate = new Date()
    const todaysAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        if (isSameDay(currentDate, appointmentDate)) return appointmentDate
    }).length

    console.log(todaysAppointments)

    return (
        <DashboardTemplate>
            <h1>Seja bem-vindo, {user.name}</h1>
            <p>Há {todaysAppointments} atendimento(s) para hoje!</p>
        </DashboardTemplate>
    )
}

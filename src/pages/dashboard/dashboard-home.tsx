import { DashboardTemplate } from "../../components/dashboard/dashboard-template"
import { useAPI } from "../../store/store"

export function DashboardHome() {
    const { user } = useAPI()
    if (!user) return
    const { appointments } = user
    const currentDate = new Date()
    const futureAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        return appointmentDate === currentDate
    }).length
    console.log(user)

    return (
        <DashboardTemplate>
            <h1>Seja bem-vindo, {user.name}</h1>
            <p>Há {futureAppointments} atendimento(s) para hoje!</p>
        </DashboardTemplate>
    )
}

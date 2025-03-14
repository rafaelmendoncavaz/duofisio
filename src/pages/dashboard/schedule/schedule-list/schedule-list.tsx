import type { TypeAppointmentList } from "../../../../types/types"
import { ScheduleCard } from "./schedule-card/schedule-card"

interface AppointmentListProps {
    appointments: TypeAppointmentList[]
    onAppointmentClick: (appointment: TypeAppointmentList) => void
}

export function ScheduleList({
    appointments,
    onAppointmentClick,
}: AppointmentListProps) {
    return (
        <ul className="grid grid-cols-5 grid-rows-4 gap-4">
            {appointments.map(appointment => (
                <ScheduleCard
                    key={appointment.id}
                    appointment={appointment}
                    onAppointmentClick={onAppointmentClick}
                />
            ))}
        </ul>
    )
}

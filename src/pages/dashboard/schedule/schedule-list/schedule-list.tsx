import type { TypeAppointmentList } from "../../../../types/types"
import { ScheduleCard } from "./schedule-card/schedule-card"

interface AppointmentListProps {
    appointments: TypeAppointmentList[]
    handleClick: (appointment: TypeAppointmentList) => void
}

export function ScheduleList({
    appointments,
    handleClick,
}: AppointmentListProps) {
    return (
        <ul className="grid grid-cols-5 grid-rows-4 gap-4">
            {appointments.map(appointment => (
                <ScheduleCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={handleClick}
                />
            ))}
        </ul>
    )
}

import type { TypePatient } from "../../../../types/types";
import { AppointmentCard } from "./appointment-card";

interface AppointmentListProps {
    appointments: TypePatient["appointments"];
    setAppointmentData: (appointment: TypePatient["appointments"][0]) => void;
}

export function AppointmentList({
    appointments,
    setAppointmentData,
}: AppointmentListProps) {
    return (
        <ul className="grid grid-cols-2 gap-4 max-h-72 overflow-hidden scrollbar-hidden overflow-y-auto">
            {appointments.map((appointment) => (
                <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={setAppointmentData}
                />
            ))}
        </ul>
    );
}

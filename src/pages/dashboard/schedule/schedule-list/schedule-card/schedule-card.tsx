import { ClipboardList, Flag } from "lucide-react"
import type { TypeAppointmentList } from "../../../../../types/types"

interface PatientCardProps {
    appointment: TypeAppointmentList
    onClick: (appointment: TypeAppointmentList) => void
}

export function ScheduleCard({ appointment, onClick }: PatientCardProps) {
    return (
        <li
            onClick={() => onClick(appointment)}
            onKeyDown={e => e.key === "Enter" && onClick(appointment)}
            tabIndex={0}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            className="border border-fisioblue rounded-md shadow-shape cursor-pointer p-2 hover:bg-fisioblue hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fisioblue2"
            aria-label={`Ver detalhes do agendamento de ${appointment.patient.name}`}
        >
            <div className="flex items-center gap-2">
                <ClipboardList size={20} />
                <span className="font-semibold truncate">
                    {appointment.patient.name}
                </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
                <Flag size={20} />
                <span className="font-normal">{appointment.status}</span>
            </div>

            <div className="flex items-center justify-between mt-1 px-2 py-1 text-sm bg-fisioblue text-slate-100 rounded">
                <span className="font-semibold">CID: </span>
                <span>{appointment.appointmentReason.cid}</span>
            </div>
        </li>
    )
}

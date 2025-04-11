import type { TypePatient } from "../../../../types/types"

interface AppointmentCardProps {
    appointment: TypePatient["appointments"][0]
    onClick: (appointment: TypePatient["appointments"][0]) => void
}

export function AppointmentCard({
    appointment,
    onClick,
}: AppointmentCardProps) {
    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <li
            className="border border-green-800 bg-green-100 text-green-800 rounded-md shadow-shape p-2 hover:bg-green-800 hover:text-green-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-900"
            tabIndex={0}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            title="Ver detalhes do agendamento"
            onClick={() => onClick(appointment)}
        >
            <h1 className="font-medium truncate">
                <span className="font-bold">Data de criação: </span>
                {new Date(appointment.createdAt).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })}
            </h1>
            <p className="font-medium truncate">
                <span className="font-bold">CID: </span>
                {appointment.clinicalRecord.cid}
            </p>
            <p className="font-medium truncate">
                <span className="font-bold">Total de sessões: </span>
                {appointment.totalSessions}
            </p>
        </li>
    )
}

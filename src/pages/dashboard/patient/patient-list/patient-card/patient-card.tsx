import { CircleUser, Phone } from "lucide-react";
import type { TypePatientList } from "../../../../../types/types";

interface PatientCardProps {
    patient: TypePatientList;
    onClick: (patient: TypePatientList) => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
    const formattedPhone = patient.phone?.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    );

    const currentDate = new Date();
    const futureSessions = patient.appointments.flatMap((appointment) => {
        const sessions = appointment.sessions.filter((session) => {
            const sessionDate = new Date(session.appointmentDate);
            return sessionDate >= currentDate;
        });
        return sessions;
    }).length;

    return (
        <li
            onClick={() => onClick(patient)}
            onKeyDown={(e) => e.key === "Enter" && onClick(patient)}
            tabIndex={0}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            className="border border-fisiolightgray rounded-md shadow-shape cursor-pointer p-2 text-fisiogray hover:bg-fisiolightgray hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fisioblue2"
            title={`Ver detalhes de ${patient.name}`}
        >
            <div className="flex items-center gap-2">
                {patient.sex === "Masculino" ? (
                    <CircleUser className="text-blue-600" size={20} />
                ) : patient.sex === "Feminino" ? (
                    <CircleUser className="text-pink-600" size={20} />
                ) : null}
                <span className="font-semibold truncate">{patient.name}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
                <Phone size={20} />
                <span className="font-normal">
                    {formattedPhone || "Não Informado"}
                </span>
            </div>

            <div className="flex items-center justify-between mt-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                <span className="font-semibold">Sessões: </span>
                <span>{futureSessions}</span>
            </div>
        </li>
    );
}

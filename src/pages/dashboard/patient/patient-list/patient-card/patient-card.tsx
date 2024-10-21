import { CircleUser, Phone } from "lucide-react"
import type { TypePatientList } from "../../../../../types/types"

interface PatientCardProps {
    patient: TypePatientList
}

export function PatientCard({ patient }: PatientCardProps) {
    const formattedPhone = patient.phone?.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    )
    const appointments =
        patient.appointments.length > 0 ? patient.appointments.length : 0

    return (
        <li
            tabIndex={0}
            className="border border-fisioblue rounded-md shadow-shape cursor-pointer"
        >
            <div className="flex items-center gap-2 px-1">
                {patient.sex === "Masculino" && (
                    <CircleUser className="text-blue-600" size={20} />
                )}
                {patient.sex === "Feminino" && (
                    <CircleUser className="text-pink-600" size={20} />
                )}

                <span className="font-bold truncate">
                    <span className="font-semibold">{patient.name}</span>
                </span>
            </div>

            <div className="flex items-center gap-2 px-1">
                <Phone size={20} />
                <span className="font-bold">
                    {" "}
                    <span className="font-normal">
                        {formattedPhone ? (
                            formattedPhone
                        ) : (
                            <span>Sem número</span>
                        )}
                    </span>
                </span>
            </div>

            <div className="flex items-center justify-between px-1 text-sm bg-fisioblue text-slate-100">
                <span className="font-semibold">Agendamentos: </span>
                <span>{appointments}</span>
            </div>
        </li>
    )
}

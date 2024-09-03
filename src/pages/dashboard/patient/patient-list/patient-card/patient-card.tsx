import { Phone, User } from "lucide-react";
import type { Patient } from "../../../../../types/types";

interface PatientCardProps {
  patient: Patient
}

export function PatientCard({ patient }: PatientCardProps) {

  const formattedPhone = patient.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")

  return (
    <li tabIndex={0} className="border border-fisioblue rounded-md shadow-shape cursor-pointer hover:bg-fisioblue hover:text-slate-100">
      <div className="flex items-center gap-2">
        <User size={20} />
        <span className="font-bold truncate">
          Nome: <span className="font-normal">{patient.name}</span>
        </span>

      </div>

      <div className="flex items-center gap-2">
        <Phone size={20} />
        <span className="font-bold">
          Telefone: <span className="font-normal">{formattedPhone}</span>
        </span>
      </div>
    </li>
  )
}
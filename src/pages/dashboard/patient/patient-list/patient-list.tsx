import type { Patient } from "../../../../types/types";
import { PatientCard } from "./patient-card/patient-card";

interface PatientListProps {
  searchParam: Patient[]
}

export function PatientList({ searchParam }: PatientListProps) {

  return (
    <ul className="grid grid-cols-5 gap-10">
      {

        searchParam.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))
      }
    </ul>
  )
}
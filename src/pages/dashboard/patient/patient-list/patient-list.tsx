import type { TypePatientList } from "../../../../types/types";
import { PatientCard } from "./patient-card/patient-card";

interface PatientListProps {
    filteredPatients: TypePatientList[];
    handleClick: (patient: TypePatientList) => void;
}

export function PatientList({
    filteredPatients,
    handleClick,
}: PatientListProps) {
    return (
        <ul className="grid grid-cols-5 grid-rows-4 gap-4">
            {filteredPatients.map((patient) => (
                <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={handleClick}
                />
            ))}
        </ul>
    );
}

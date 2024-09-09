import { useSearchFilter } from "../../../../context/context";
import { patientData } from "../../../../data/data";
import { PatientCard } from "./patient-card/patient-card";

export function PatientList() {

  const {
    searchName,
    searchPhone,
    searchCPF
  } = useSearchFilter((store) => store)

  const search = searchName.length || searchPhone.length || searchCPF.length > 0
    ? patientData.filter(patient => {
      const matchName = patient.name.toLowerCase().includes(searchName.toLowerCase())
      const matchPhone = patient.phone.includes(searchPhone)
      const matchCPF = patient.cpf.includes(searchCPF)

      return matchName && matchPhone && matchCPF
    })
    : patientData

  return (
    <ul className="grid grid-cols-5 gap-10">
      {
        search.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))
      }
    </ul>
  )
}
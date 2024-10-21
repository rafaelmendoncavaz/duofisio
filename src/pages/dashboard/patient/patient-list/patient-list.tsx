import { useAPI, useSearchFilter } from "../../../../context/context"
import { PatientCard } from "./patient-card/patient-card"

export function PatientList() {
    const { searchName, searchPhone, searchCPF } = useSearchFilter(
        store => store
    )

    const { getPatients, patientList } = useAPI(store => store)

    const search =
        searchName.length || searchPhone.length || searchCPF.length > 0
            ? patientList.filter(patient => {
                  const matchName = patient.name
                      .toLowerCase()
                      .includes(searchName.toLowerCase())
                  const matchPhone = patient.phone?.includes(searchPhone)
                  const matchCPF = patient.cpf.includes(searchCPF)

                  return matchName && matchPhone && matchCPF
              })
            : patientList

    return (
        <ul className="grid grid-cols-5 gap-10">
            {search.map(patient => (
                <PatientCard key={patient.id} patient={patient} />
            ))}
            <button type="button" onClick={() => getPatients()}>
                GetPatients
            </button>
        </ul>
    )
}

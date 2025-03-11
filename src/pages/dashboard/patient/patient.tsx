import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { PatientList } from "./patient-list/patient-list"
import { useAPI, useModal, useSearchFilter } from "../../../store/store"
import { CreatePatientModal } from "../../../components/modal/patient/create-patient-modal"
import { SearchFilter } from "../../../components/search-filter/search-filter"
import { GetPatientInfoModal } from "../../../components/modal/patient/get-patient-info-modal"
import type { TypePatientList } from "../../../types/types"
import { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"

export function DashboardPatients() {
    const {
        isCreatePatientModalOpen,
        isSinglePatientModalOpen,
        openSinglePatientModal,
    } = useModal()

    const { getSinglePatient, getPatients, patientList } = useAPI()
    const { searchName, searchPhone, searchCPF } = useSearchFilter()

    const [filteredPatients, setFilteredPatients] = useState<TypePatientList[]>(
        []
    )
    const [page, setPage] = useState(0)
    const itemsPerPage = 20
    const pageCount = Math.ceil((filteredPatients.length || 0) / itemsPerPage)
    const paginatedPatients = filteredPatients.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    )

    // Carregamento da lista de pacientes no componente
    useEffect(() => {
        if (patientList.length === 0) {
            getPatients()
        }
    }, [patientList, getPatients])

    // Lógica do filtro de busca da lista de pacientes
    useEffect(() => {
        if (patientList) {
            const search =
                searchName.length || searchPhone.length || searchCPF.length > 0
                    ? patientList.filter(patient => {
                          const matchName = patient.name
                              .toLowerCase()
                              .includes(searchName.toLowerCase())
                          const matchPhone =
                              patient.phone?.includes(searchPhone)
                          const matchCPF = patient.cpf.includes(searchCPF)

                          return matchName && matchPhone && matchCPF
                      })
                    : patientList

            setFilteredPatients(search)
        }
    }, [searchName, searchPhone, searchCPF, patientList])

    // Função de carregamento dos dados do paciente no modal
    async function handleClick(patient: TypePatientList) {
        await getSinglePatient(patient.id)
        openSinglePatientModal()
    }

    return (
        <DashboardTemplate>
            <SearchFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            {patientList ? (
                filteredPatients.length > 0 ? (
                    <>
                        <PatientList
                            handleClick={handleClick}
                            filteredPatients={paginatedPatients}
                        />
                        {pageCount >= 1 && (
                            <ReactPaginate
                                pageCount={pageCount}
                                onPageChange={({ selected }) =>
                                    setPage(selected)
                                }
                                containerClassName="flex gap-2 justify-center mt-6"
                                pageClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                activeClassName="bg-fisioblue2"
                                previousClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                nextClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                disabledClassName="opacity-50 cursor-not-allowed"
                                previousLabel="Anterior"
                                nextLabel="Próximo"
                            />
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-500">
                        Nenhum paciente encontrado.
                    </p>
                )
            ) : (
                <p className="text-center text-gray-500">
                    Carregando pacientes...
                </p>
            )}

            {isCreatePatientModalOpen && <CreatePatientModal />}
            {isSinglePatientModalOpen && <GetPatientInfoModal />}
        </DashboardTemplate>
    )
}

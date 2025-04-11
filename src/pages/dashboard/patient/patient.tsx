import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { PatientList } from "./patient-list/patient-list"
import { useAPI, useModal, useSearchFilter } from "../../../store/store"
import { CreatePatientModal } from "../../../components/modal/patient/create-patient-modal"
import { PatientFilter } from "./patient-filter/patient-filter"
import { GetPatientInfoModal } from "../../../components/modal/patient/get-patient-info-modal"
import type { TypePatientList } from "../../../types/types"
import { useEffect, useMemo, useState } from "react"
import ReactPaginate from "react-paginate"

export function DashboardPatients() {
    const {
        isCreatePatientModalOpen,
        isSinglePatientModalOpen,
        openSinglePatientModal,
    } = useModal()

    const { getSinglePatient, getPatients, patientList } = useAPI()
    const { searchName, searchPhone, searchCPF } = useSearchFilter()

    // Carregamento da lista de pacientes no componente
    useEffect(() => {
        if (patientList.length === 0) {
            getPatients()
        }
    }, [patientList, getPatients])

    // Filtragem com useMemo
    const filteredPatients = useMemo(() => {
        if (!patientList) return []
        if (!(searchName.length || searchPhone.length || searchCPF.length)) {
            return patientList
        }
        return patientList.filter(patient => {
            const normalizedPatientName = patient.name
                .normalize("NFD")
                // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            const normalizedSearchName = searchName
                .normalize("NFD")
                // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            const matchName =
                normalizedPatientName.includes(normalizedSearchName)
            const matchPhone = patient.phone?.includes(searchPhone) ?? true
            const matchCPF = patient.cpf.includes(searchCPF) ?? true
            return matchName && matchPhone && matchCPF
        })
    }, [patientList, searchName, searchPhone, searchCPF])

    const [page, setPage] = useState(0)
    const itemsPerPage = 20
    const pageCount = Math.ceil((filteredPatients.length || 0) / itemsPerPage)
    const paginatedPatients = filteredPatients.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    )

    // Função de carregamento dos dados do paciente no modal
    async function handleClick(patient: TypePatientList) {
        await getSinglePatient(patient.id)
        openSinglePatientModal()
    }

    return (
        <DashboardTemplate>
            <PatientFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <h1 className="text-xl text-fisiogray font-semibold">
                {`Exibindo ${filteredPatients.length} de ${patientList.length} Pacientes`}
            </h1>

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

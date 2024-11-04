import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { PatientList } from "./patient-list/patient-list"
import { useAPI, useModal, useSearchFilter } from "../../../context/context"
import { CreatePatientModal } from "../../../components/modal/create-patient/create-patient-modal"
import { SearchFilter } from "../../../components/search-filter/search-filter"
import { GetPatientInfoModal } from "../../../components/modal/get-patient-infro/get-patient-info-modal"
import { CreateRecordModal } from "../../../components/modal/create-record/create-record-modal"
import type { TypePatientList } from "../../../types/types"

export function DashboardPatients() {
    const {
        isCreatePatientModalOpen,
        isSinglePatientModalOpen,
        isCreateRecordModalOpen,
        openSinglePatientModal,
    } = useModal(store => store)

    const { getSinglePatient } = useAPI(store => store)

    const { searchName, searchPhone, searchCPF } = useSearchFilter(
        store => store
    )

    async function handleClick(patient: TypePatientList) {
        await getSinglePatient(patient.id)
        openSinglePatientModal()
    }

    return (
        <DashboardTemplate>
            <SearchFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <PatientList
                handleClick={handleClick}
                searchName={searchName}
                searchPhone={searchPhone}
                searchCPF={searchCPF}
            />

            {isCreatePatientModalOpen && <CreatePatientModal />}
            {isSinglePatientModalOpen && <GetPatientInfoModal />}
            {isCreateRecordModalOpen && <CreateRecordModal />}
        </DashboardTemplate>
    )
}

import { DashboardTemplate } from "../../../components/dashboard/dashboard-template"
import { PatientList } from "./patient-list/patient-list"
import { useModal } from "../../../context/context"
import { CreatePatientModal } from "../../../components/modal/create-patient/create-patient-modal"
import { SearchFilter } from "../../../components/search-filter/search-filter"

export function DashboardPatients() {
    const { isCreatePatientModalOpen } = useModal(store => store)

    return (
        <DashboardTemplate>
            <SearchFilter />

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <PatientList />

            {isCreatePatientModalOpen && <CreatePatientModal />}
        </DashboardTemplate>
    )
}

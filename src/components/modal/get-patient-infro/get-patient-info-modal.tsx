import { PatientInfoForm } from "../../forms/patient-info-form"
import { Modal } from "../../global/modal"

export function GetPatientInfoModal() {
    return (
        <Modal title="Dados do Paciente">
            <PatientInfoForm />
        </Modal>
    )
}

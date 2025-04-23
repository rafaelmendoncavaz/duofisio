import { Modal } from "../../global/modal";
import { PatientInfo } from "./patient-info";

export function GetPatientInfoModal() {
    return (
        <Modal title="Dados do Paciente">
            <PatientInfo />
        </Modal>
    );
}

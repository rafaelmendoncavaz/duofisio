import { CreatePatientForm } from "../../forms/create-patient-form";
import { Modal } from "../../global/modal";

export function CreatePatientModal() {
    return (
        <Modal title="Cadastrar Paciente">
            <CreatePatientForm />
        </Modal>
    );
}

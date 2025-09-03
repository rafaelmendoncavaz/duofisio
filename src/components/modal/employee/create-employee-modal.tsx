import { CreateEmployeeForm } from "../../forms/create-employee-form";
import { Modal } from "../../global/modal";

export function CreateEmployeeModal() {
    return (
        <Modal title="Cadastrar usuário">
            <CreateEmployeeForm />
        </Modal>
    )
}
import { UpdateEmployeeForm } from "../../forms/update-employee-form";
import { Modal } from "../../global/modal";

export function UpdateEmployeeModal() {
    return (
        <Modal title="Editar usuário">
            <UpdateEmployeeForm />
        </Modal>
    )
}
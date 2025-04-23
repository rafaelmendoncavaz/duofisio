import { Modal } from "../../../../components/global/modal";
import { ScheduleInfo } from "../schedule-info";

export function AppointmentInfoModal() {
    return (
        <Modal title="Dados do Agendamento">
            <ScheduleInfo />
        </Modal>
    );
}

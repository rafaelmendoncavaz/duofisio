import { useAPI } from "../../../context/context"
import { CreateRecordForm } from "../../forms/create-record-form"
import { Modal } from "../../global/modal"
import { RecordSearch } from "./record-search"

export function CreateRecordModal() {
    const { clinicalRecords } = useAPI(store => store)

    return (
        <Modal title="Criar novo registro clínico">
            {clinicalRecords !== null ? <CreateRecordForm /> : <RecordSearch />}
        </Modal>
    )
}

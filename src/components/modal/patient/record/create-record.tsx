import { useState } from "react"
import { useAPI } from "../../../../store/store"
import { CreateRecordForm } from "../../../forms/create-record-form"
import { RecordHistory } from "./record-history"

interface CreateRecordProps {
    setIsClinicalHistoryOpen: (isOpen: boolean) => void
}

export function CreateRecord({ setIsClinicalHistoryOpen }: CreateRecordProps) {
    const { clearRecords } = useAPI()
    const [isCreateRecord, setIsCreateRecord] = useState(false)

    const openCreateRecord = () => setIsCreateRecord(true)

    const closeCreateRecord = () => setIsCreateRecord(false)

    const closeClinicalHistory = () => {
        clearRecords()
        setIsClinicalHistoryOpen(false)
    }

    return (
        <section className="flex flex-col gap-4">
            {isCreateRecord ? (
                <CreateRecordForm closeCreateRecord={closeCreateRecord} />
            ) : (
                <RecordHistory
                    openCreateRecord={openCreateRecord}
                    closeClinicalHistory={closeClinicalHistory}
                />
            )}
        </section>
    )
}

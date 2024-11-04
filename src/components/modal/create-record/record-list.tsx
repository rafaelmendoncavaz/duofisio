import { useAPI } from "../../../context/context"
import { RecordCard } from "./record-card"

export function RecordList() {
    const { clinicalRecords, getSingleClinicalRecord } = useAPI(store => store)

    if (!clinicalRecords) return

    const { clinicalRecordList } = clinicalRecords

    async function handleClick(id: string, recordId: string) {
        await getSingleClinicalRecord(id, recordId)
    }

    return (
        <ul className="grid grid-cols-2 gap-10 max-h-24 overflow-hidden scrollbar-hidden overflow-y-auto">
            {clinicalRecordList.map(record => (
                <RecordCard
                    key={record.id}
                    record={record}
                    handleClick={handleClick}
                    patientId={clinicalRecords.patientId}
                />
            ))}
        </ul>
    )
}

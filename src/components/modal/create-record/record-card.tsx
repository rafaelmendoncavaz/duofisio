import type { ClinicalData } from "../../../types/types"

interface RecordCardProps {
    record: ClinicalData
    patientId: string
    handleClick: (id: string, recordId: string) => Promise<void>
}

export function RecordCard({
    record,
    handleClick,
    patientId,
}: RecordCardProps) {
    return (
        <li
            className="border border-fisioblue rounded-md shadow-shape cursor-pointer px-1 hover:bg-fisioblue hover:text-slate-100"
            onClick={() => handleClick(patientId, record.id)}
        >
            <h1 className="font-medium">
                <span className="font-bold">CID: </span>
                <span>{record.cid}</span>
            </h1>
            <p className="font-medium">
                <span className="font-bold">Queixa: </span>
                <span className="truncate">{record.allegation}</span>
            </p>
            <p className="font-medium">
                <span className="font-bold">Diagnóstico: </span>
                <span className="truncate">{record.diagnosis}</span>
            </p>
        </li>
    )
}

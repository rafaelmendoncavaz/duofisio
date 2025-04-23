import type { ClinicalData } from "../../../../types/types";
import { RecordCard } from "./record-card";

interface RecordListProps {
    records: ClinicalData[];
    patientId: string;
    onRecordClick: (patientId: string, recordId: string) => Promise<void>;
}

export function RecordList({
    records,
    patientId,
    onRecordClick,
}: RecordListProps) {
    return (
        <ul className="grid grid-cols-2 gap-10 max-h-72 overflow-hidden scrollbar-hidden overflow-y-auto">
            {records.map((record) => (
                <RecordCard
                    key={record.id}
                    record={record}
                    patientId={patientId}
                    handleClick={onRecordClick}
                />
            ))}
        </ul>
    );
}

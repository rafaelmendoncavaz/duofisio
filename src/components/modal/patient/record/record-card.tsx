import type { ClinicalData } from "../../../../types/types";

interface RecordCardProps {
    record: ClinicalData;
    patientId: string;
    handleClick: (patientId: string, recordId: string) => Promise<void>;
}

export function RecordCard({
    record,
    handleClick,
    patientId,
}: RecordCardProps) {
    return (
        <li
            className="border border-red-800 bg-red-100 text-red-800 rounded-md shadow-shape p-2 hover:bg-red-800 hover:text-red-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-900"
            onClick={() => handleClick(patientId, record.id)}
            onKeyDown={(e) =>
                e.key === "Enter" && handleClick(patientId, record.id)
            }
            tabIndex={0}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
            title={`Ver detalhes do registro ${record.cid}`}
        >
            <h1 className="font-medium truncate">
                <span className="font-bold">CID: </span>
                {record.cid}
            </h1>
            <p className="font-medium truncate">
                <span className="font-bold">Queixa: </span>
                {record.allegation}
            </p>
            <p className="font-medium truncate">
                <span className="font-bold">Diagnóstico: </span>
                {record.diagnosis}
            </p>
        </li>
    );
}

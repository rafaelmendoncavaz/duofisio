import { ArrowLeftCircle, X } from "lucide-react";
import { useAPI, useModal } from "../../../../store/store";
import { format } from "date-fns";
import { Input } from "../../../global/input";

export function RecordInfo() {
    const {
        clinicalRecord,
        clinicalRecords,
        clearRecord,
        clearRecords,
        deleteClinicalRecord,
    } = useAPI();
    const { closeModal } = useModal();

    if (!clinicalRecords || !clinicalRecord) {
        return <p>Nenhum histórico clínico encontrado</p>;
    }

    const date = clinicalRecord.expires?.split("T")[0];
    const formattedDate = date && format(date, "dd-MM-yyyy");

    const handleDeleteRecord = async () => {
        const confirmation = window.confirm(
            "Você está prestes a deletar este registro.\nEsta ação não pode ser desfeita!"
        );
        if (confirmation) {
            await deleteClinicalRecord(
                clinicalRecords.patientId,
                clinicalRecord.id
            );
            clearRecord();
            clearRecords();
            closeModal();
        }
    };

    return (
        <div className="flex flex-col gap-4 py-2 w-full mx-auto max-h-[70vh] overflow-hidden scrollbar-hidden overflow-y-auto text-fisiogray">
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">
                        {`Informações do CID: ${clinicalRecord.cid}`}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            title="Voltar ao menu anterior"
                            type="button"
                            className="rounded-md bg-fisioblue text-slate-100 p-2 flex items-center gap-2"
                            onClick={clearRecord}
                        >
                            <ArrowLeftCircle size={20} />
                        </button>
                        <button
                            title="Excluir CID"
                            type="button"
                            onClick={handleDeleteRecord}
                            className="rounded-md bg-red-700 text-white p-2 hover:bg-red-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block font-semibold" htmlFor="patientName">
                    Paciente
                </label>
                <Input
                    colorVariant="disabled"
                    id="patientName"
                    type="text"
                    disabled={true}
                    value={clinicalRecords.patientName}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label
                        className="block font-semibold"
                        htmlFor="patientPhone"
                    >
                        Cartão SUS
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="patientCNS"
                        type="text"
                        disabled={true}
                        value={clinicalRecord.CNS || "Não Informado"}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        className="block font-semibold"
                        htmlFor="patientEmail"
                    >
                        Convênio
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="patientCovenant"
                        type="text"
                        disabled={true}
                        value={clinicalRecord.covenant || "Não Informado"}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        className="block font-semibold"
                        htmlFor="appointmentCID"
                    >
                        Vencimento
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="covenantDue"
                        type="text"
                        disabled={true}
                        value={formattedDate || "N/A"}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        className="block font-semibold"
                        htmlFor="appointmentAllegation"
                    >
                        Queixa do Paciente
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="cidAllegation"
                        type="text"
                        disabled={true}
                        value={clinicalRecord.allegation}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block font-semibold" htmlFor="diagnosis">
                    Diagnóstico
                </label>
                <textarea
                    rows={3}
                    className="w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape"
                    disabled={true}
                    value={clinicalRecord.diagnosis}
                />
            </div>
        </div>
    );
}

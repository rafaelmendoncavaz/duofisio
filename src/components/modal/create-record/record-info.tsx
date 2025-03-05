import { ArrowLeftCircle, X } from "lucide-react"
import { useAPI, useModal } from "../../../context/context"

export function RecordInfo() {
    const {
        clinicalRecord,
        clinicalRecords,
        clearRecord,
        clearRecords,
        deleteClinicalRecord,
    } = useAPI(store => store)

    const { closeModal } = useModal(store => store)

    async function handleDeleteRecord() {
        const confirmation = confirm(
            "Você está prestes a deletar este registro.\nEsta ação não pode ser desfeita!"
        )

        if (!confirmation) return

        if (clinicalRecords && clinicalRecord)
            await deleteClinicalRecord(
                clinicalRecords.patientId,
                clinicalRecord.id
            )

        clearRecord()
        clearRecords()
        closeModal()
    }

    return (
        <div className="flex flex-col space-y-6 border border-fisioblue rounded-md shadow-shape cursor-pointer px-1 py-2">
            <div className="space-y-2">
                <h1 className="font-medium">
                    <span className="font-bold">Paciente: </span>
                    <span>{clinicalRecords?.patientName}</span>
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Cartão SUS: </span>
                    <span>{clinicalRecord?.CNS}</span>
                </h1>

                <div className="w-full h-px bg-fisioblue shadow-shape" />

                <h1 className="font-medium">
                    <span className="font-bold">Convênio: </span>
                    <span>{clinicalRecord?.covenant}</span>
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Vencimento do Convênio: </span>
                    <span>{clinicalRecord?.expires}</span>
                </h1>

                <div className="w-full h-px bg-fisioblue shadow-shape" />

                <h1 className="font-medium">
                    <span className="font-bold">CID: </span>
                    <span>{clinicalRecord?.cid}</span>
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Queixa: </span>
                    <span className="truncate">
                        {clinicalRecord?.allegation}
                    </span>
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Diagnóstico: </span>
                    <div className="border border-fisioblue rounded-md px-2 py-1 mx-2">
                        <span className="truncate">
                            {clinicalRecord?.diagnosis}
                        </span>
                    </div>
                </h1>
            </div>

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={clearRecord}
                    className="w-1/2 flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 p-1 text-slate-100 font-semibold"
                >
                    <ArrowLeftCircle size={20} />
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handleDeleteRecord}
                    className="w-1/2 flex items-center gap-2 rounded-md bg-red-500 hover:bg-red-600 p-1 text-slate-100 font-semibold"
                >
                    <X size={20} />
                    Apagar Registro
                </button>
            </div>
        </div>
    )
}

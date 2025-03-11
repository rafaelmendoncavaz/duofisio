import { ArrowLeftCircle, X } from "lucide-react"
import { useAPI, useModal } from "../../../../store/store"
import { format } from "date-fns"

export function RecordInfo() {
    const {
        clinicalRecord,
        clinicalRecords,
        clearRecord,
        clearRecords,
        deleteClinicalRecord,
    } = useAPI()
    const { closeModal } = useModal()

    const date = clinicalRecord?.expires?.split("T")[0]
    const formattedDate = date && format(date, "dd-MM-yyyy")

    const handleDeleteRecord = async () => {
        const confirmation = window.confirm(
            "Você está prestes a deletar este registro.\nEsta ação não pode ser desfeita!"
        )
        if (!confirmation) return

        if (clinicalRecords && clinicalRecord) {
            try {
                await deleteClinicalRecord(
                    clinicalRecords.patientId,
                    clinicalRecord.id
                )
                clearRecord()
                clearRecords()
                closeModal()
            } catch (error) {
                console.error("Erro ao deletar registro:", error)
            }
        }
    }

    return (
        <div className="flex flex-col gap-6 border border-fisioblue rounded-md shadow-shape p-4">
            <div className="space-y-3">
                <h1 className="font-medium">
                    <span className="font-bold">Paciente: </span>
                    {clinicalRecords?.patientName ?? "Desconhecido"}
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Cartão SUS: </span>
                    {clinicalRecord?.CNS || "N/A"}
                </h1>
                <hr className="w-full border-fisioblue" />

                <h1 className="font-medium">
                    <span className="font-bold">Convênio: </span>
                    {clinicalRecord?.covenant || "N/A"}
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Vencimento do Convênio: </span>
                    {formattedDate || "N/A"}
                </h1>
                <hr className="w-full border-fisioblue" />

                <h1 className="font-medium">
                    <span className="font-bold">CID: </span>
                    {clinicalRecord?.cid || "N/A"}
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Queixa: </span>
                    <span className="truncate">
                        {clinicalRecord?.allegation || "N/A"}
                    </span>
                </h1>
                <h1 className="font-medium">
                    <span className="font-bold">Diagnóstico: </span>
                    <span className="truncate italic block ml-2">
                        {clinicalRecord?.diagnosis || "N/A"}
                    </span>
                </h1>
            </div>
            <hr className="w-full border-fisioblue" />

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={clearRecord}
                    className="flex-1 flex items-center justify-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-2 shadow-shape font-semibold transition-colors"
                    aria-label="Voltar para lista de registros"
                >
                    <ArrowLeftCircle size={20} />
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handleDeleteRecord}
                    className="flex-1 flex items-center justify-center gap-2 rounded-md bg-red-500 text-slate-100 hover:bg-red-600 px-3 py-2 shadow-shape font-semibold transition-colors"
                    aria-label="Apagar este registro"
                >
                    <X size={20} />
                    Apagar Registro
                </button>
            </div>
        </div>
    )
}

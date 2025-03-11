import { ArrowLeftCircle, ClipboardPlus } from "lucide-react"
import { useAPI } from "../../../../store/store"
import { RecordList } from "./record-list"
import { RecordInfo } from "./record-info"
import { useState } from "react"
import ReactPaginate from "react-paginate"

interface RecordHistoryProps {
    closeClinicalHistory: () => void
    openCreateRecord: () => void
}

export function RecordHistory({
    closeClinicalHistory,
    openCreateRecord,
}: RecordHistoryProps) {
    const { clinicalRecords, clinicalRecord, getSingleClinicalRecord } =
        useAPI()
    const [page, setPage] = useState(0)
    const itemsPerPage = 4
    const pageCount = Math.ceil(
        (clinicalRecords?.clinicalRecordList.length || 0) / itemsPerPage
    )
    const paginatedRecords =
        clinicalRecords?.clinicalRecordList.slice(
            page * itemsPerPage,
            (page + 1) * itemsPerPage
        ) || []

    const handleRecordClick = async (patientId: string, recordId: string) => {
        await getSingleClinicalRecord(patientId, recordId)
    }

    return (
        <section className="flex flex-col gap-4">
            {!clinicalRecord && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Prontuários de{" "}
                            {clinicalRecords?.patientName ?? "Paciente"}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={closeClinicalHistory}
                                className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                            >
                                <ArrowLeftCircle size={20} />
                                Voltar
                            </button>
                            <button
                                type="button"
                                onClick={openCreateRecord}
                                className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                            >
                                <ClipboardPlus size={20} />
                                Novo Registro
                            </button>
                        </div>
                    </div>
                    {clinicalRecords?.clinicalRecordList.length ? (
                        <>
                            <RecordList
                                records={paginatedRecords}
                                patientId={clinicalRecords.patientId}
                                onRecordClick={handleRecordClick}
                            />
                            {pageCount >= 1 && (
                                <ReactPaginate
                                    pageCount={pageCount}
                                    onPageChange={({ selected }) =>
                                        setPage(selected)
                                    }
                                    containerClassName="flex gap-2 justify-center mt-4"
                                    pageClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                    activeClassName="bg-fisioblue2"
                                    previousClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                    previousLabel="Anterior"
                                    nextClassName="px-3 py-1 bg-fisioblue text-white rounded"
                                    nextLabel="Próximo"
                                    disabledClassName="opacity-50 cursor-not-allowed"
                                />
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-500">
                            Nenhum registro encontrado.
                        </p>
                    )}
                </>
            )}
            {clinicalRecord && <RecordInfo />}
        </section>
    )
}

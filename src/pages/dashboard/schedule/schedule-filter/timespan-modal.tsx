import { startOfYesterday } from "date-fns"
import { Input } from "../../../../components/global/input"
import { Modal } from "../../../../components/global/modal"
import { useAPI, useModal } from "../../../../store/store"
import { useState } from "react"

export function TimespanModal() {
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState(
        startOfYesterday().toISOString().slice(0, 10)
    )

    const { setDateRangeFilter, setActiveFilter } = useAPI()
    const { closeModal } = useModal()

    const handleDateRangeFilter = () => {
        setDateRangeFilter(fromDate, toDate)
        setActiveFilter("history")
        closeModal()
    }

    return (
        <Modal title="Filtrar por Data">
            <div className="flex flex-col gap-4 py-2 w-full mx-auto max-h-[70vh] overflow-hidden scrollbar-hidden overflow-y-auto">
                <div className="flex items-center gap-2">
                    <div className="space-y-2 w-full">
                        <label className="block font-semibold" htmlFor="">
                            De
                        </label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 w-full">
                        <label className="block font-semibold" htmlFor="">
                            Até
                        </label>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                            max={startOfYesterday().toISOString().slice(0, 10)}
                        />
                    </div>
                </div>

                <div className="w-full h-px bg-black shadow-shape" />

                <button
                    type="button"
                    className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                    onClick={handleDateRangeFilter}
                >
                    Filtrar Datas Selecionadas
                </button>
            </div>
        </Modal>
    )
}

import { ArrowLeftCircle } from "lucide-react"
import { useState } from "react"
import { CreateRecord } from "./record/create-record"
import { AppointmentHistory } from "./appointment/appointment-history"
import { useAPI } from "../../../store/store"

interface PatientHistoryProps {
    setIsClinicalHistoryOpen: (isOpen: boolean) => void
}

export function PatientHistory({
    setIsClinicalHistoryOpen,
}: PatientHistoryProps) {
    const {
        getClinicalRecords,
        clinicalRecords,
        clearRecords,
        clearRecord,
        patientData,
    } = useAPI()

    if (!patientData) {
        return <p>Dados do paciente não encontrados</p>
    }

    const [clinicalHistory, setClinicalHistory] = useState(false)
    const [appointmentHistory, setAppointmentHistory] = useState(false)

    const handleClinicalHistory = async () => {
        if (!clinicalRecords) {
            await getClinicalRecords(patientData.id)
        }

        setClinicalHistory(true)
        setAppointmentHistory(false)
    }

    const handleAppointmentHistory = () => {
        setClinicalHistory(false)
        setAppointmentHistory(true)
        clearRecords()
        clearRecord()
    }

    return (
        <>
            {clinicalHistory ? (
                <CreateRecord setClinicalHistory={setClinicalHistory} />
            ) : appointmentHistory ? (
                <AppointmentHistory
                    appointmentHistory={appointmentHistory}
                    setAppointmentHistory={setAppointmentHistory}
                />
            ) : (
                <section className="flex flex-col gap-4 text-fisiogray">
                    <div className="flex items-center justify-between">
                        <h1 className="flex-1 font-semibold text-lg">
                            Escolha uma ação...
                        </h1>
                        <button
                            type="button"
                            onClick={() => setIsClinicalHistoryOpen(false)}
                            className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                        >
                            <ArrowLeftCircle size={20} />
                            Voltar
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="border border-green-800 bg-green-100 text-green-800 hover:bg-green-800 hover:text-green-100 rounded-md h-36 transition-colors"
                            onClick={handleAppointmentHistory}
                        >
                            <h1 className="text-xl font-bold">
                                Histórico de Agendamentos
                            </h1>
                            <p className="text-sm italic">
                                Todos os agendamentos, e informações de cada
                                sessão
                            </p>
                        </button>
                        <button
                            type="button"
                            className="border border-red-800 bg-red-100 text-red-800 hover:bg-red-800 hover:text-red-100 rounded-md h-36 transition-colors"
                            onClick={handleClinicalHistory}
                        >
                            <h1 className="text-xl font-bold">
                                Histórico Clínico
                            </h1>
                            <p className="text-sm italic">
                                Todos os registros clínicos, com CID e
                                informações de diagnóstico
                            </p>
                        </button>
                    </div>
                </section>
            )}
        </>
    )
}

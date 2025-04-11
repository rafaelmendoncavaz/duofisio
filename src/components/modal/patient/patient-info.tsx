import { useForm } from "react-hook-form"
import { useAPI, useModal } from "../../../store/store"
import type { TypeUpdatePatient } from "../../../types/types"
import { useState } from "react"
import { Hospital, UserRoundPen, UserRoundX, X } from "lucide-react"
import { EditPatientForm } from "../../forms/edit-patient-form"
import { PatientHistory } from "./patient-history"

export function PatientInfo() {
    const { patientData, deletePatient } = useAPI()
    const { closeModal } = useModal()
    const [isEditing, setIsEditing] = useState(false)

    const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false)

    const { reset } = useForm<TypeUpdatePatient>()

    const handleDelete = async () => {
        if (!patientData?.id) return
        const confirmation = window.confirm(
            "Você está prestes a deletar este paciente.\nEsta ação não pode ser desfeita!"
        )
        if (confirmation) {
            await deletePatient(patientData.id)
            closeModal()
        }
    }

    const openClinicalHistory = () => {
        setIsClinicalHistoryOpen(true)
    }

    const toggleEdit = () => {
        if (isEditing) {
            reset() // Restaura os valores originais ao cancelar
        }
        setIsEditing(prev => !prev)
    }

    if (!patientData) {
        return (
            <div className="p-4 text-center">Nenhum paciente selecionado.</div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center gap-2 text-fisiogray">
            <div className="max-h-[70vh] w-full overflow-hidden scrollbar-hidden overflow-y-auto space-y-6">
                {isClinicalHistoryOpen ? null : (
                    <div className="flex items-center justify-between">
                        <p className="text-sm">
                            <span className="font-bold text-red-500">*</span>{" "}
                            indica campos obrigatórios
                        </p>

                        <div className="flex items-center gap-4">
                            <button
                                title="Abrir Histórico Clínico"
                                onClick={openClinicalHistory}
                                type="button"
                                className="rounded-md  bg-emerald-800 text-slate-100 hover:bg-emerald-900 p-2"
                            >
                                <Hospital size={20} />
                            </button>
                            <button
                                title="Editar Paciente"
                                type="button"
                                onClick={toggleEdit}
                                className={`rounded-md p-2 text-white ${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                            >
                                {isEditing ? (
                                    <X size={20} />
                                ) : (
                                    <UserRoundPen size={20} />
                                )}
                            </button>
                            <button
                                title="Deletar Paciente"
                                type="button"
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                            >
                                <UserRoundX size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {isClinicalHistoryOpen ? (
                    <PatientHistory
                        setIsClinicalHistoryOpen={setIsClinicalHistoryOpen}
                    />
                ) : (
                    <EditPatientForm
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                )}
            </div>
        </div>
    )
}

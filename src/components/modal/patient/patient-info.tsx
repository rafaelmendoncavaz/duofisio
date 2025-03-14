import { useForm } from "react-hook-form"
import { useAPI, useModal } from "../../../store/store"
import type { TypeUpdatePatient } from "../../../types/types"
import { useState } from "react"
import {
    CalendarPlus,
    Hospital,
    UserRoundPen,
    UserRoundX,
    X,
} from "lucide-react"
import { CreateRecord } from "../../modal/patient/record/create-record"
import { EditPatientForm } from "../../forms/edit-patient-form"
import { CreateAppointmentForm } from "../../forms/create-appointment-form"

export function PatientInfo() {
    const {
        patientData,
        getClinicalRecords,
        deletePatient,
        clinicalRecord,
        clinicalRecords,
        clearRecords,
    } = useAPI()
    const { closeModal } = useModal()
    const [isEditing, setIsEditing] = useState(false)

    const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false)
    const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] =
        useState(false)

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

    const openClinicalHistory = async () => {
        if (!isClinicalHistoryOpen) {
            if (!patientData?.id) return
            await getClinicalRecords(patientData.id)
            setIsClinicalHistoryOpen(true)
        }
    }

    const openCreateAppointment = async () => {
        if (!isCreateAppointmentOpen) {
            if (!patientData?.id) return
            await getClinicalRecords(patientData.id)
            setIsCreateAppointmentOpen(true)
        }
    }

    const closeCreateAppointment = () => {
        clearRecords()
        setIsCreateAppointmentOpen(false)
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
        <div className="w-full flex flex-col items-center gap-2">
            <div className="max-h-[70vh] w-full overflow-hidden scrollbar-hidden overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                    {clinicalRecord || clinicalRecords ? null : (
                        <p className="text-sm">
                            <span className="font-bold text-red-500">*</span>{" "}
                            indica campos obrigatórios
                        </p>
                    )}

                    {isClinicalHistoryOpen || isCreateAppointmentOpen ? null : (
                        <>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={openCreateAppointment}
                                    type="button"
                                    className="rounded-md bg-emerald-800 text-slate-100 hover:bg-emerald-900 p-2"
                                >
                                    <CalendarPlus size={20} />
                                </button>
                                <button
                                    onClick={openClinicalHistory}
                                    type="button"
                                    className="rounded-md bg-fisioblue text-slate-100 hover:bg-sky-900 p-2"
                                >
                                    <Hospital size={20} />
                                </button>
                                <button
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
                                    type="button"
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                                >
                                    <UserRoundX size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {isClinicalHistoryOpen ? (
                    <CreateRecord
                        setIsClinicalHistoryOpen={setIsClinicalHistoryOpen}
                    />
                ) : isCreateAppointmentOpen ? (
                    <CreateAppointmentForm
                        closeCreateAppointment={closeCreateAppointment}
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

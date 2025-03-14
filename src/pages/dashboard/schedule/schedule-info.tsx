import {
    CalendarCheck,
    CalendarCog,
    CalendarSync,
    CalendarX2,
    X,
} from "lucide-react"
import { useAPI, useModal } from "../../../store/store"
import { EditAppointmentForm } from "../../../components/forms/edit-appointment-form"
import { Input } from "../../../components/global/input"
import { useState } from "react"
import { RepeatAppointmentForm } from "../../../components/forms/repeat-appointment-form"
import { isBefore, format } from "date-fns"
import type { TypeAppointmentUpdate } from "../../../types/types"

export function ScheduleInfo() {
    const [isEditing, setIsEditing] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)

    const {
        appointmentData,
        getAppointments,
        updateAppointment,
        deleteAppointment,
    } = useAPI()
    const { closeModal } = useModal()

    if (!appointmentData) return

    const currentDate = new Date()
    const appointmentDate = new Date(appointmentData?.appointmentDate)
    const currentAppointment = isBefore(appointmentDate, currentDate)
    const createdAt = format(
        new Date(appointmentData.createdAt).toISOString().split("T")[0],
        "dd-MM-yyyy"
    )
    const updatedAt = format(
        new Date(appointmentData.updatedAt).toISOString().split("T")[0],
        "dd-MM-yyyy"
    )

    const formattedPhone =
        appointmentData?.patient.phone
            ?.replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2") || "Não Informado"

    const toggleEdit = () => {
        if (isEditing) {
            // reset() // Restaura os valores originais ao cancelar
        }
        setIsEditing(prev => !prev)
    }

    const toggleRepeat = () => {
        if (appointmentData?.status !== "FINALIZADO") {
            alert("Você só pode repetir atendimentos finalizados!")
            return
        }
        if (isRepeating) {
            // reset() // Restaura os valores originais ao cancelar
        }
        setIsRepeating(prev => !prev)
    }

    const terminateAppointment = async () => {
        if (!currentAppointment) return

        const formattedDate = new Date(
            appointmentData.appointmentDate
        ).toISOString()
        const updateData: TypeAppointmentUpdate = {
            appointmentDate: formattedDate,
            status: "FINALIZADO",
        }

        const confirmation = window.confirm(
            "Marcar este agendamento como: FINALIZADO.\nEsta ação não pode ser desfeita!"
        )

        if (confirmation) {
            const result = await updateAppointment(
                updateData,
                appointmentData.id
            )
            if (result.success) {
                await getAppointments() // Atualiza a lista de agendamentos para refletir o novo agendamento
                closeModal()
            }
        }
    }

    const handleDelete = async () => {
        if (!appointmentData) return
        const confirmation = window.confirm(
            "Você está prestes a excluir este agendamento.\nEsta ação não pode ser desfeita!"
        )

        if (confirmation) {
            const result = await deleteAppointment(appointmentData.id)
            if (result.success) {
                await getAppointments() // Atualiza a lista de agendamentos para refletir o novo agendamento
                closeModal()
            }
        }
    }

    return (
        <div className="flex flex-col gap-4 py-2 w-full mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">
                        Informações do Agendamento
                    </h1>
                    <p className="text-xs text-slate-500 italic">
                        Criado em: {`${createdAt}`}
                    </p>
                    <p className="text-xs text-slate-500 italic">
                        Atualizado em: {`${updatedAt}`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {currentAppointment &&
                    appointmentData.status !== "FINALIZADO" ? (
                        <button
                            type="button"
                            onClick={terminateAppointment}
                            className="rounded-md bg-slate-600 text-white p-2 hover:bg-slate-700"
                        >
                            <CalendarCheck size={20} />
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={toggleRepeat}
                        className={`rounded-md p-2 text-white ${isRepeating ? "bg-red-500 hover:bg-red-600" : "bg-emerald-800 hover:bg-emerald-900"}`}
                    >
                        {isRepeating ? (
                            <X size={20} />
                        ) : (
                            <CalendarSync size={20} />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={toggleEdit}
                        className={`rounded-md p-2 text-white ${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {isEditing ? (
                            <X size={20} />
                        ) : (
                            <CalendarCog size={20} />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                    >
                        <CalendarX2 size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block" htmlFor="patientName">
                    Paciente
                </label>
                <Input
                    colorVariant="disabled"
                    id="patientName"
                    type="text"
                    disabled={true}
                    value={`${appointmentData?.patient.name}`}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block" htmlFor="patientPhone">
                        Telefone
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="patientPhone"
                        type="text"
                        disabled={true}
                        value={`${formattedPhone}`}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="patientEmail">
                        Email
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="patientEmail"
                        type="text"
                        disabled={true}
                        value={`${appointmentData?.patient.email}`}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="appointmentCID">
                        CID
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="appointmentCID"
                        type="text"
                        disabled={true}
                        value={`${appointmentData?.appointmentReason.cid}`}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="appointmentAllegation">
                        Queixa do Paciente
                    </label>
                    <Input
                        colorVariant="disabled"
                        id="appointmentAllegation"
                        type="text"
                        disabled={true}
                        value={`${appointmentData?.appointmentReason.allegation}`}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block" htmlFor="">
                    Diagnóstico
                </label>
                <textarea
                    rows={4}
                    className="w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape"
                    disabled={true}
                    value={`${appointmentData?.appointmentReason.diagnosis}`}
                />
            </div>

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <p className="text-sm">
                <span className="font-bold text-red-500">*</span> indica campos
                obrigatórios
            </p>
            {isRepeating ? (
                <RepeatAppointmentForm />
            ) : (
                <EditAppointmentForm isEditing={isEditing} />
            )}
        </div>
    )
}

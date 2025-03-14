import { useAPI, useModal } from "../../store/store"
import { useForm } from "react-hook-form"
import type { TypeAppointmentUpdate } from "../../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateAppointmentSchema } from "../../schema/schema"
import { Input } from "../global/input"
import { startOfDay, isBefore, isSameDay } from "date-fns"

interface EditAppointmentFormProps {
    isEditing: boolean
}

export function EditAppointmentForm({ isEditing }: EditAppointmentFormProps) {
    const { updateAppointment, getAppointments, employees, appointmentData } =
        useAPI()
    const { closeModal } = useModal()

    // Formata a data ISO para datetime-local (remove segundos e timezone)
    const formatToDateTimeLocal = (isoString: string) => isoString.slice(0, 16)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TypeAppointmentUpdate>({
        resolver: zodResolver(updateAppointmentSchema),
        defaultValues: {
            appointmentDate: appointmentData?.appointmentDate
                ? formatToDateTimeLocal(appointmentData.appointmentDate)
                : "",
            duration: appointmentData?.duration,
            status: appointmentData?.status,
            employeeId: appointmentData?.employee.employeeId,
        },
    })

    const onSubmit = async (data: TypeAppointmentUpdate) => {
        if (!appointmentData) return

        // Converte appointmentDate para ISO com timezone local
        const formattedDate = new Date(data.appointmentDate).toISOString()

        const now = new Date()
        if (
            isBefore(new Date(formattedDate), now) &&
            !isSameDay(new Date(formattedDate), now)
        ) {
            alert("A data do agendamento deve ser hoje ou no futuro")
            return
        }

        const updateData: TypeAppointmentUpdate = {
            ...data,
            appointmentDate: formattedDate,
        }

        const result = await updateAppointment(updateData, appointmentData.id)
        if (result.success) {
            await getAppointments() // Atualiza a lista de agendamentos para refletir o novo agendamento
            closeModal()
        }
    }

    if (!appointmentData) {
        return (
            <div className="p-4 text-center">
                Nenhum agendamento selecionado.
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block" htmlFor="employeeId">
                        Funcionário <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={
                            isEditing
                                ? "w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                                : "w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape cursor-not-allowed"
                        }
                        {...register("employeeId")}
                        defaultValue={appointmentData?.employee.employeeId}
                        disabled={!isEditing}
                    >
                        <option value="">Selecione um Funcionário</option>
                        {employees?.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                    {errors.employeeId && (
                        <span className="text-sm text-red-500">
                            {errors.employeeId.message}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="appointmentDate">
                        Data e Hora <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="datetime-local"
                        {...register("appointmentDate")}
                        min={startOfDay(new Date()).toISOString().slice(0, 16)} // Hoje em diante
                        colorVariant={isEditing ? "enabled" : "disabled"}
                    />
                    {errors.appointmentDate && (
                        <span className="text-sm text-red-500">
                            {errors.appointmentDate.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block" htmlFor="duration">
                        Duração (minutos){" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={
                            isEditing
                                ? "w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                                : "w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape cursor-not-allowed"
                        }
                        {...register("duration", { valueAsNumber: true })}
                        disabled={!isEditing}
                    >
                        <option value={30}>30</option>
                        <option value={60}>60</option>
                        <option value={90}>90</option>
                        <option value={120}>120</option>
                    </select>
                    {errors.duration && (
                        <span className="text-sm text-red-500">
                            {errors.duration.message}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="clinicalRecordId">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={
                            isEditing
                                ? "w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                                : "w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape cursor-not-allowed"
                        }
                        {...register("status")}
                        disabled={!isEditing}
                    >
                        <option value="">Selecione um Status</option>
                        <option value="SOLICITADO">SOLICITADO</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                    </select>
                    {errors.status && (
                        <span className="text-sm text-red-500">
                            {errors.status.message}
                        </span>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                disabled={isSubmitting || !isEditing}
            >
                {isSubmitting ? "Agendando..." : "Atualizar Agendamento"}
            </button>
        </form>
    )
}

import { ArrowLeftCircle } from "lucide-react"
import { useAPI, useModal } from "../../store/store"
import { useForm } from "react-hook-form"
import type { TypeCreateAppointment } from "../../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAppointmentSchema } from "../../schema/schema"
import { Input } from "../global/input"
import { startOfDay, isBefore, isSameDay } from "date-fns"

interface CreateAppointmentFormProps {
    closeCreateAppointment: () => void
}

export function CreateAppointmentForm({
    closeCreateAppointment,
}: CreateAppointmentFormProps) {
    const {
        createAppointment,
        patientData,
        clinicalRecords,
        getAppointments,
        employees,
        user,
    } = useAPI()
    const { closeModal } = useModal()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TypeCreateAppointment>({
        resolver: zodResolver(createAppointmentSchema),
        defaultValues: {
            patientId: patientData?.id,
            employeeId: user?.id,
            appointmentDate: "",
            duration: 30, // Valor padrão
            clinicalRecordId: "",
        },
    })

    if (!patientData || !clinicalRecords || !employees) {
        return (
            <div className="p-4 text-center">
                Nenhum paciente ou registros clínicos selecionados.
            </div>
        )
    }

    const onSubmit = async (data: TypeCreateAppointment) => {
        if (!patientData?.id) return

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

        const createData = {
            ...data,
            appointmentDate: formattedDate,
        }

        const result = await createAppointment(createData)
        if (result.success) {
            await getAppointments() // Atualiza a lista de pacientes para refletir o novo agendamento
            closeModal()
        }
    }

    return (
        <div className="flex flex-col gap-6 py-2 w-full mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-lg">
                    <span className="font-semibold">
                        Novo Agendamento para:{" "}
                    </span>
                    <span>{patientData.name}</span>
                </h1>
                <button
                    type="button"
                    onClick={closeCreateAppointment}
                    className="flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 px-3 py-1 text-slate-100 font-semibold"
                >
                    <ArrowLeftCircle size={20} />
                    Voltar
                </button>
            </div>

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <p className="text-sm">
                <span className="font-bold text-red-500">*</span> indica campos
                obrigatórios
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block" htmlFor="employeeId">
                            Funcionário <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                            {...register("employeeId")}
                            defaultValue={user?.id}
                        >
                            <option value="">Selecione um Funcionário</option>
                            {employees.map(employee => (
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
                            min={startOfDay(new Date())
                                .toISOString()
                                .slice(0, 16)} // Hoje em diante
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
                            className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                            {...register("duration", { valueAsNumber: true })}
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
                            CID <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                            {...register("clinicalRecordId")}
                        >
                            <option value="">Selecione um CID</option>
                            {clinicalRecords.clinicalRecordList.map(record => (
                                <option key={record.id} value={record.id}>
                                    {record.cid}
                                </option>
                            ))}
                        </select>
                        {errors.clinicalRecordId && (
                            <span className="text-sm text-red-500">
                                {errors.clinicalRecordId.message}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Agendando..." : "Criar Agendamento"}
                </button>
            </form>
        </div>
    )
}

import { ArrowLeftCircle } from "lucide-react";
import { useAPI, useModal } from "../../store/store";
import { Controller, useForm } from "react-hook-form";
import type { TypeCreateAppointment } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointmentSchema } from "../../schema/schema";
import { Input } from "../global/input";
import { startOfDay } from "date-fns";
import { formatToBrazilTime, parseBrazilTimeToUTC } from "../../utils/date";

interface CreateAppointmentFormProps {
    closeCreateAppointment: () => void;
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
    } = useAPI();
    const { closeModal } = useModal();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TypeCreateAppointment>({
        resolver: zodResolver(createAppointmentSchema),
        defaultValues: {
            patientId: patientData?.id,
            employeeId: user?.id,
            clinicalRecordId: "",
            appointmentDate: "",
            duration: 30,
            daysOfWeek: undefined,
            totalSessions: 1,
        },
    });

    if (!patientData || !clinicalRecords || !employees) {
        return (
            <div className="p-4 text-center">
                Nenhum paciente ou registros clínicos selecionados.
            </div>
        );
    }

    const onSubmit = async (data: TypeCreateAppointment) => {
        if (!patientData?.id) return;

        const appointmentDateUTC = parseBrazilTimeToUTC(data.appointmentDate);
        
        const payload = {
            ...data,
            appointmentDate: appointmentDateUTC,
        }

        const result = await createAppointment(payload);
        if (result.success) {
            await getAppointments(); // Atualiza a lista de agendamentos com o novo agendamento criado
            closeModal();
        }
    };

    // Ajustar o min para UTC-3 no formato correto
    const minDateTime = formatToBrazilTime(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm");

    const days = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Segunda" },
        { value: 2, label: "Terça" },
        { value: 3, label: "Quarta" },
        { value: 4, label: "Quinta" },
        { value: 5, label: "Sexta" },
        { value: 6, label: "Sábado" },
    ];

    const totalSessions = watch("totalSessions");

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
                <section className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <label className="block" htmlFor="employeeId">
                            Funcionário <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                            {...register("employeeId")}
                            defaultValue={user?.id}
                        >
                            <option value="" disabled>
                                Selecione um Funcionário
                            </option>
                            {employees.map((employee) => (
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
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block" htmlFor="appointmentDate">
                            Data e Hora <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="datetime-local"
                            {...register("appointmentDate")}
                            min={minDateTime}
                        />
                        {errors.appointmentDate && (
                            <span className="text-sm text-red-500">
                                {errors.appointmentDate.message}
                            </span>
                        )}
                    </div>

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
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block" htmlFor="clinicalRecordId">
                            CID <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                            {...register("clinicalRecordId")}
                        >
                            <option value="" disabled>
                                Selecione um CID
                            </option>
                            {clinicalRecords.clinicalRecordList.map(
                                (record) => (
                                    <option key={record.id} value={record.id}>
                                        {record.cid}
                                    </option>
                                )
                            )}
                        </select>
                        {errors.clinicalRecordId && (
                            <span className="text-sm text-red-500">
                                {errors.clinicalRecordId.message}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block" htmlFor="sessionCount">
                            Quantidade de Sessões{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            {...register("totalSessions", {
                                valueAsNumber: true,
                            })}
                            min={1}
                        />
                        {errors.totalSessions && (
                            <span className="text-sm text-red-500">
                                {errors.totalSessions.message}
                            </span>
                        )}
                    </div>
                </section>

                {totalSessions > 1 && (
                    <section className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="daysOfWeek">
                                Dias da Semana{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            {errors.daysOfWeek && (
                                <span className="text-sm text-red-500">
                                    {errors.daysOfWeek.message}
                                </span>
                            )}
                            <div className="flex justify-center items-center gap-4">
                                <Controller
                                    name="daysOfWeek"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {days.map((day) => (
                                                <label
                                                    htmlFor="daysOfWeek"
                                                    key={day.value}
                                                    className="flex items-center gap-1"
                                                >
                                                    <div>
                                                        <span>{day.label}</span>
                                                        <Input
                                                            type="checkbox"
                                                            value={day.value}
                                                            checked={
                                                                field.value?.includes(
                                                                    day.value
                                                                ) || false
                                                            }
                                                            onChange={(e) => {
                                                                const currentValue =
                                                                    field.value ||
                                                                    []; // Garante que seja um array
                                                                const newValue =
                                                                    e.target
                                                                        .checked
                                                                        ? [
                                                                              ...currentValue,
                                                                              day.value,
                                                                          ]
                                                                        : currentValue.filter(
                                                                              (
                                                                                  d: number
                                                                              ) =>
                                                                                  d !==
                                                                                  day.value
                                                                          );
                                                                field.onChange(
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </label>
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </section>
                )}

                <button
                    type="submit"
                    className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Agendando..." : "Criar Agendamento"}
                </button>
            </form>
        </div>
    );
}

import { useAPI, useModal } from "../../store/store";
import { useForm, Controller } from "react-hook-form";
import type { TypeAppointmentRepeat } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { repeatAppointmentSchema } from "../../schema/schema";
import { Input } from "../global/input";

export function RepeatAppointmentForm() {
    const { repeatAppointment, getAppointments, sessionData } = useAPI();
    const { closeModal } = useModal();

    const {
        register,
        control, // Substitui register para campos controlados
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TypeAppointmentRepeat>({
        resolver: zodResolver(repeatAppointmentSchema),
        defaultValues: {
            daysOfWeek: [],
            totalSessions: 1,
        },
    });

    if (!sessionData) {
        return (
            <div className="p-4 text-center">
                Nenhum agendamento selecionado.
            </div>
        );
    }

    const days = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Segunda" },
        { value: 2, label: "Terça" },
        { value: 3, label: "Quarta" },
        { value: 4, label: "Quinta" },
        { value: 5, label: "Sexta" },
        { value: 6, label: "Sábado" },
    ];

    const onSubmit = async (data: TypeAppointmentRepeat) => {
        const result = await repeatAppointment(
            data,
            sessionData.appointment.id
        );
        if (result.success) {
            await getAppointments();
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="space-y-2 w-full">
                    <label className="block" htmlFor="daysOfWeek">
                        Dias da Semana <span className="text-red-500">*</span>
                    </label>
                    {errors.daysOfWeek && (
                        <span className="text-sm text-red-500">
                            {errors.daysOfWeek.message}
                        </span>
                    )}
                    <div className="flex items-center gap-4">
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
                                                    checked={field.value.includes(
                                                        day.value
                                                    )}
                                                    onChange={(e) => {
                                                        const newValue = e
                                                            .target.checked
                                                            ? [
                                                                  ...field.value,
                                                                  day.value,
                                                              ]
                                                            : field.value.filter(
                                                                  (d: number) =>
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

                <div className="space-y-2 w-full">
                    <label className="block" htmlFor="sessionCount">
                        Quantidade de Sessões{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="number"
                        {...register("totalSessions", { valueAsNumber: true })}
                        min={1}
                    />
                    {errors.totalSessions && (
                        <span className="text-sm text-red-500">
                            {errors.totalSessions.message}
                        </span>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Agendando..." : "Repetir Agendamento"}
            </button>
        </form>
    );
}

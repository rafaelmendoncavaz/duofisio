import { useAPI, useModal } from "../../store/store";
import { useForm } from "react-hook-form";
import type { TypeUpdateEmployee } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateEmployeeSchema } from "../../schema/schema";
import { Input } from "../global/input";

export function UpdateEmployeeForm() {
    const { employee, updateEmployee, verifyAuth } =
        useAPI();
    const { closeModal } = useModal();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TypeUpdateEmployee>({
        resolver: zodResolver(updateEmployeeSchema),
        defaultValues: {
            email: undefined,
            password: undefined,
            isAdmin: undefined,
        },
    });

    const onSubmit = async (data: TypeUpdateEmployee) => {
        if (!employee) return;
        const { success } = await updateEmployee(employee.id, data);
        if (success) {
            await verifyAuth();
            closeModal();
        }
    };

    if (!employee) {
        return (
            <div className="p-4 text-center">Nenhum funcionário encontrado.</div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-2 w-full mx-auto text-fisiogray">
            <div className="flex items-center justify-between">
                <h1 className="text-lg">
                    <span className="font-semibold">
                        Atualizar dados de:{" "}
                    </span>
                    <span>{employee.name}</span>
                </h1>
            </div>

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block font-semibold" htmlFor="">
                            Novo e-mail
                        </label>
                        <Input type="email" {...register("email")} placeholder="exemplo@email.com" />
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block font-semibold" htmlFor="">
                            Senha
                        </label>
                        <Input type="password" {...register("password")} placeholder="Insira uma senha segura..." />
                        {errors.password && (
                            <span className="text-sm text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                        <label className="block font-semibold" htmlFor="">
                            Deseja dar privilégios a este usuário?
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Input type="radio" value="true" {...register("isAdmin", {
                                    setValueAs: (v) => v === "true"
                                })} />
                                <span>Sim</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input type="radio" value="false" {...register("isAdmin", {
                                    setValueAs: (v) => v === "true"
                                })} />
                                <span>Não</span>
                            </div>
                        </div>
                        {errors.isAdmin && (
                            <span className="text-sm text-red-500">
                                {errors.isAdmin.message}
                            </span>
                        )}
                    </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Atualizando..." : "Atualizar"}
                </button>
            </form>
        </div>
    );
}

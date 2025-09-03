import { useAPI, useModal } from "../../store/store";
import { useForm } from "react-hook-form";
import type { TypeCreateEmployee } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployeeSchema } from "../../schema/schema";
import { Input } from "../global/input";

export function CreateEmployeeForm() {
    const { createEmployee } =
        useAPI();
    const { closeModal } = useModal();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TypeCreateEmployee>({
        resolver: zodResolver(createEmployeeSchema),
        defaultValues: {
            name: undefined,
            email: undefined,
            password: undefined,
            isAdmin: undefined,
        },
    });

    const onSubmit = async (data: TypeCreateEmployee) => {
        const { success } = await createEmployee(data);
        if (success) closeModal();
    };

    return (
        <div className="flex flex-col gap-6 py-2 w-full mx-auto text-fisiogray">
            <div className="flex items-center justify-between">
                <h1 className="text-lg">
                    <span className="font-semibold">
                        Criação de um novo usuário
                    </span>
                </h1>
            </div>

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <p className="text-sm">
                <span className="font-bold text-red-500">*</span> indica campos
                obrigatórios
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block font-semibold" htmlFor="">
                            Nome completo <span className="text-red-500">*</span>
                        </label>
                        <Input type="text" {...register("name")} placeholder="Nome completo..." />
                        {errors.name && (
                            <span className="text-sm text-red-500">
                                {errors.name.message}
                            </span>
                        )}
                    </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block font-semibold" htmlFor="">
                            E-mail <span className="text-red-500">*</span>
                        </label>
                        <Input type="email" {...register("email")} placeholder="exemplo@duofisio.com" />
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block font-semibold" htmlFor="">
                            Senha <span className="text-red-500">*</span>
                        </label>
                        <Input type="password" {...register("password")} placeholder="Insira uma senha segura" />
                        {errors.password && (
                            <span className="text-sm text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold" htmlFor="">
                        Deseja dar privilégios a este usuário? <span className="text-red-500">*</span>
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
                    {isSubmitting ? "Criando usuário..." : "Cadastrar usuário"}
                </button>
            </form>
        </div>
    );
}

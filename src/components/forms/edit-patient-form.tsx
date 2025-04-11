import { useForm } from "react-hook-form"
import { useAPI } from "../../store/store"
import { updatePatientSchema } from "../../schema/schema"
import type { TypeUpdatePatient } from "../../types/types"
import { Input } from "../global/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useCallback, useEffect } from "react"
import { viacep } from "../../api/api"

interface EditPatientFormProps {
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditPatientForm({
    isEditing,
    setIsEditing,
}: EditPatientFormProps) {
    const { verifyAuth, patientData, getSinglePatient, updatePatient } =
        useAPI()

    const [isLoadingCEP, setIsLoadingCEP] = useState({
        patient: false,
        adult: false,
    })

    const birthDate =
        patientData && new Date(patientData.dateOfBirth).toISOString()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TypeUpdatePatient>({
        resolver: zodResolver(updatePatientSchema),
        defaultValues: patientData
            ? {
                  name: patientData.name,
                  cpf: patientData.cpf,
                  dateOfBirth: birthDate ? birthDate.split("T")[0] : "", // Formato YYYY-MM-DD para input date
                  phone: patientData.phone || null,
                  email: patientData.email || null,
                  sex: patientData.sex || null,
                  profession: patientData.profession || null,
                  address: {
                      cep: patientData.address.cep,
                      street: patientData.address.street,
                      number: patientData.address.number,
                      complement: patientData.address.complement || null,
                      neighborhood: patientData.address.neighborhood,
                      city: patientData.address.city,
                      state: patientData.address.state,
                  },
                  adultResponsible: patientData.adultResponsible
                      ? {
                            name: patientData.adultResponsible.name,
                            cpf: patientData.adultResponsible.cpf,
                            phone: patientData.adultResponsible.phone,
                            email: patientData.adultResponsible.email,
                            address: {
                                cep: patientData.adultResponsible.address.cep,
                                street: patientData.adultResponsible.address
                                    .street,
                                number: patientData.adultResponsible.address
                                    .number,
                                complement:
                                    patientData.adultResponsible.address
                                        .complement || null,
                                neighborhood:
                                    patientData.adultResponsible.address
                                        .neighborhood,
                                city: patientData.adultResponsible.address.city,
                                state: patientData.adultResponsible.address
                                    .state,
                            },
                        }
                      : null,
              }
            : undefined,
    })

    useEffect(() => {
        if (!isEditing) {
            reset()
        }
    }, [isEditing, reset])

    const fetchAddress = useCallback(
        async (cep: string, type: "patient" | "adult") => {
            if (cep.length !== 8) return
            setIsLoadingCEP(prev => ({ ...prev, [type]: true }))
            try {
                const { data } = await viacep.get(`/${cep}/json`)
                const prefix =
                    type === "patient" ? "address" : "adultResponsible.address"
                setValue(`${prefix}.street`, data.logradouro || "")
                setValue(`${prefix}.neighborhood`, data.bairro || "")
                setValue(`${prefix}.city`, data.localidade || "")
                setValue(`${prefix}.state`, data.uf || "")
            } catch (error) {
                console.error(`Erro ao buscar endereço do ${type}`, error)
            } finally {
                setIsLoadingCEP(prev => ({ ...prev, [type]: false }))
            }
        },
        [setValue]
    )

    const onSubmit = async (data: TypeUpdatePatient) => {
        if (!patientData?.id) return

        const result = await updatePatient(data, patientData.id)
        if (result.success) {
            setIsEditing(false)
            getSinglePatient(patientData.id)
            verifyAuth()
        }
    }

    if (!patientData) {
        return (
            <div className="p-4 text-center">Nenhum paciente selecionado.</div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center gap-4"
        >
            <div className="w-full space-y-6">
                {/* Dados Pessoais */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div className="space-y-2">
                        <label className="block" htmlFor="">
                            Nome <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            {...register("name")}
                            disabled={!isEditing}
                            colorVariant={isEditing ? "enabled" : "disabled"}
                        />
                        {errors.name && (
                            <span className="text-sm text-red-500">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                CPF <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("cpf")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.cpf && (
                                <span className="text-sm text-red-500">
                                    {errors.cpf.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Data de Nascimento
                            </label>
                            <Input
                                type="date"
                                {...register("dateOfBirth")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.dateOfBirth && (
                                <span className="text-sm text-red-500">
                                    {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Telefone
                            </label>
                            <Input
                                type="text"
                                {...register("phone")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Email
                            </label>
                            <Input
                                type="email"
                                {...register("email")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.email && (
                                <span className="text-sm text-red-500">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Sexo
                            </label>
                            <select
                                {...register("sex")}
                                className={
                                    isEditing
                                        ? "w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                                        : "w-full bg-slate-200 text-gray-500 border rounded-md p-2 shadow-shape cursor-not-allowed"
                                }
                                disabled={!isEditing}
                            >
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Ocupação
                            </label>
                            <Input
                                type="text"
                                {...register("profession")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* Endereço do Paciente */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Endereço</h2>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div className="space-y-2">
                        <label className="block" htmlFor="">
                            CEP <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            {...register("address.cep", {
                                onChange: e =>
                                    isEditing &&
                                    fetchAddress(e.target.value, "patient"),
                            })}
                            disabled={!isEditing || isLoadingCEP.patient}
                            colorVariant={isEditing ? "enabled" : "disabled"}
                        />
                        {errors.address?.cep && (
                            <span className="text-sm text-red-500">
                                {errors.address.cep.message}
                            </span>
                        )}
                        {isLoadingCEP.patient && (
                            <span className="text-sm text-gray-500">
                                Buscando...
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Rua <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("address.street")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.address?.street && (
                                <span className="text-sm text-red-500">
                                    {errors.address.street.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Número <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                {...register("address.number")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.address?.number && (
                                <span className="text-sm text-red-500">
                                    {errors.address.number.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Complemento
                            </label>
                            <Input
                                type="text"
                                {...register("address.complement")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Bairro <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("address.neighborhood")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.address?.neighborhood && (
                                <span className="text-sm text-red-500">
                                    {errors.address.neighborhood.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Cidade <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("address.city")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("address.state")}
                                disabled={!isEditing}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* Responsável Adulto */}
                {patientData.adultResponsible && (
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            Dados do Responsável
                        </h2>
                        <div className="w-full h-px bg-fisioblue shadow-shape" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.name")}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.name && (
                                    <span className="text-sm text-red-500">
                                        {errors.adultResponsible.name.message}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    CPF <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.cpf")}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.cpf && (
                                    <span className="text-sm text-red-500">
                                        {errors.adultResponsible.cpf.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Telefone{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.phone")}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.phone && (
                                    <span className="text-sm text-red-500">
                                        {errors.adultResponsible.phone.message}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    {...register("adultResponsible.email")}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.email && (
                                    <span className="text-sm text-red-500">
                                        {errors.adultResponsible.email.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                CEP <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("adultResponsible.address.cep", {
                                    onChange: e =>
                                        isEditing &&
                                        fetchAddress(e.target.value, "adult"),
                                })}
                                disabled={!isEditing || isLoadingCEP.adult}
                                colorVariant={
                                    isEditing ? "enabled" : "disabled"
                                }
                            />
                            {errors.adultResponsible?.address?.cep && (
                                <span className="text-sm text-red-500">
                                    {
                                        errors.adultResponsible.address.cep
                                            .message
                                    }
                                </span>
                            )}
                            {isLoadingCEP.adult && (
                                <span className="text-sm text-gray-500">
                                    Buscando...
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Rua <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.street"
                                    )}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.address?.street && (
                                    <span className="text-sm text-red-500">
                                        {
                                            errors.adultResponsible.address
                                                .street.message
                                        }
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Número{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    {...register(
                                        "adultResponsible.address.number"
                                    )}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.address?.number && (
                                    <span className="text-sm text-red-500">
                                        {
                                            errors.adultResponsible.address
                                                .number.message
                                        }
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Complemento
                                </label>
                                <Input
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.complement"
                                    )}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Bairro{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.neighborhood"
                                    )}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                                {errors.adultResponsible?.address
                                    ?.neighborhood && (
                                    <span className="text-sm text-red-500">
                                        {
                                            errors.adultResponsible.address
                                                .neighborhood.message
                                        }
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Cidade{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.city"
                                    )}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Estado{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.state"
                                    )}
                                    disabled={!isEditing}
                                    colorVariant={
                                        isEditing ? "enabled" : "disabled"
                                    }
                                />
                            </div>
                        </div>
                    </section>
                )}
            </div>

            <button
                type="submit"
                className={`w-full rounded-md py-2 text-white font-semibold ${isEditing ? "bg-fisioblue hover:bg-fisioblue2" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isEditing || isSubmitting}
            >
                {isSubmitting ? "Atualizando..." : "Atualizar Paciente"}
            </button>
        </form>
    )
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { viacep } from "../../api/api"
import { createPatientSchema } from "../../schema/schema"
import type { TypeCreatePatient } from "../../types/types"
import { Input } from "../global/input"
import { useAPI, useModal } from "../../store/store"

export function CreatePatientForm() {
    const [hasAdultResponsible, setHasAdultResponsible] = useState(false)
    const [isLoadingCEP, setIsLoadingCEP] = useState({
        patient: false,
        adult: false,
    })

    const { createPatient } = useAPI()
    const { closeModal } = useModal()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TypeCreatePatient>({
        resolver: zodResolver(createPatientSchema),
        defaultValues: {
            address: { cep: "" },
            clinicalData: { expires: null },
            adultResponsible: null,
        },
    })

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

    const onSubmit = async (data: TypeCreatePatient) => {
        const payload = hasAdultResponsible
            ? data
            : { ...data, adultResponsible: null }
        const response = await createPatient(payload)
        if (response?.success && response.status === 201) {
            reset()
            closeModal()
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center gap-2"
        >
            <div className="max-h-[70vh] w-full overflow-hidden scrollbar-hidden overflow-y-auto space-y-6">
                <p className="text-sm">
                    <span className="font-bold text-red-500">*</span> indica
                    campos obrigatórios
                </p>

                {/* Dados Pessoais */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div className="space-y-2">
                        <label className="block" htmlFor="">
                            Nome <span className="text-red-500">*</span>
                        </label>
                        <Input type="text" {...register("name")} />
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
                            <Input type="text" {...register("cpf")} />
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
                            <Input type="date" {...register("dateOfBirth")} />
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
                            <Input type="text" {...register("phone")} />
                            {errors.phone && (
                                <span className="text-sm text-red-500">
                                    {errors.phone.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Email
                            </label>
                            <Input type="email" {...register("email")} />
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
                                className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                            >
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                            {errors.sex && (
                                <span className="text-sm text-red-500">
                                    {errors.sex.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Ocupação
                            </label>
                            <Input type="text" {...register("profession")} />
                            {errors.profession && (
                                <span className="text-sm text-red-500">
                                    {errors.profession.message}
                                </span>
                            )}
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
                                    fetchAddress(e.target.value, "patient"),
                            })}
                            disabled={isLoadingCEP.patient}
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
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Bairro <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("address.neighborhood")}
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
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("address.state")}
                                disabled
                            />
                        </div>
                    </div>
                </section>

                {/* Dados Clínicos */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Dados Clínicos</h2>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                CID <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("clinicalData.cid")}
                            />
                            {errors.clinicalData?.cid && (
                                <span className="text-sm text-red-500">
                                    {errors.clinicalData.cid.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                CNS
                            </label>
                            <Input
                                type="text"
                                {...register("clinicalData.CNS")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Convênio
                            </label>
                            <Input
                                type="text"
                                {...register("clinicalData.covenant")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Data de Vencimento
                            </label>
                            <Input
                                type="date"
                                {...register("clinicalData.expires")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Queixa <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("clinicalData.allegation")}
                            />
                            {errors.clinicalData?.allegation && (
                                <span className="text-sm text-red-500">
                                    {errors.clinicalData.allegation.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block" htmlFor="">
                                Diagnóstico{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                {...register("clinicalData.diagnosis")}
                            />
                            {errors.clinicalData?.diagnosis && (
                                <span className="text-sm text-red-500">
                                    {errors.clinicalData.diagnosis.message}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Responsável Adulto */}
                <fieldset className="space-y-2">
                    <legend className="italic font-semibold">
                        Possui responsável?
                    </legend>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={hasAdultResponsible}
                            onChange={() =>
                                setHasAdultResponsible(prev => !prev)
                            }
                        />
                        Sim
                    </label>
                </fieldset>

                {hasAdultResponsible && (
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
                                        fetchAddress(e.target.value, "adult"),
                                })}
                                disabled={isLoadingCEP.adult}
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
                                    disabled
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
                                    disabled
                                />
                            </div>
                        </div>
                    </section>
                )}
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                disabled={
                    isSubmitting || isLoadingCEP.patient || isLoadingCEP.adult
                }
            >
                {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
            </button>
        </form>
    )
}

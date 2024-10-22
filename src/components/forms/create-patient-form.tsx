import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { viacep } from "../../api/api"
import { createPatientSchema } from "../../schema/schema"
import type { TypeAddress, TypeCreatePatient, TypeCep } from "../../types/types"
import { Input } from "../global/input"
import { useAPI, useModal } from "../../context/context"

export function CreatePatientForm() {
    const [hasAdultResponsible, setHasAdultResponsible] =
        useState<boolean>(false)
    const [adultCEP, setAdultCEP] = useState<string>("")
    const [adultAddress, setAdultAddress] = useState<TypeAddress | null>(null)
    const [patientCEP, setPatientCEP] = useState<string>("")
    const [patientAddress, setPatientAddress] = useState<TypeAddress | null>(
        null
    )

    const { createPatient } = useAPI(store => store)
    const { closeModal } = useModal(store => store)

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm<TypeCreatePatient>({
        resolver: zodResolver(createPatientSchema),
    })

    async function getPatientAddress(cep: TypeCep) {
        try {
            const { data } = await viacep.get(`/${cep}/json`)
            setPatientAddress(data)
        } catch (error) {
            console.error("Erro ao buscar endereço do adulto", error)
        }
    }

    async function getAdultAddress(cep: TypeCep) {
        try {
            const { data } = await viacep.get(`/${cep}/json`)
            setAdultAddress(data)
        } catch (error) {
            console.error("Erro ao buscar endereço do adulto", error)
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <Function re-renders>
    useEffect(() => {
        if (patientCEP && patientCEP.length === 8) {
            getPatientAddress(patientCEP)
        }
        if (adultCEP && adultCEP.length === 8) {
            getAdultAddress(adultCEP)
        }
    }, [patientCEP, adultCEP])

    async function handleCreatePatient(data: TypeCreatePatient) {
        const { adultResponsible, clinicalData, address, ...rest } = data
        const patient = {
            ...rest,
            address,
            clinicalData,
        }
        const patientWithAdult = {
            ...rest,
            address,
            clinicalData,
            adultResponsible,
        }

        if (!hasAdultResponsible) {
            const response = await createPatient(patient)
            if (response) {
                if (response.status === 201) {
                    reset()
                    closeModal()
                    return response.id
                }
            }
        }
        if (hasAdultResponsible) {
            const response = await createPatient(patientWithAdult)
            if (response) {
                if (response.status === 201) {
                    reset()
                    closeModal()
                    return response.id
                }
            }
        }
    }

    if (patientAddress) {
        setValue("address.street", patientAddress?.logradouro)
        setValue("address.neighborhood", patientAddress?.bairro)
        setValue("address.city", patientAddress?.localidade)
        setValue("address.state", patientAddress?.estado)
    }
    if (adultAddress) {
        setValue("adultResponsible.address.street", adultAddress?.logradouro)
        setValue("adultResponsible.address.neighborhood", adultAddress?.bairro)
        setValue("adultResponsible.address.city", adultAddress?.localidade)
        setValue("adultResponsible.address.state", adultAddress?.estado)
    }

    return (
        <form
            onSubmit={handleSubmit(handleCreatePatient)}
            className="flex flex-col items-center gap-2"
        >
            <div className="flex flex-col gap-2 w-full max-h-[500px] overflow-hidden scrollbar-hidden overflow-y-auto">
                <p className="text-sm text-left">
                    <span className="font-bold text-red-500">*</span> indica
                    campos obrigatórios
                </p>
                <div className="flex flex-col py-2 gap-2">
                    <h1>Dados Pessoais</h1>

                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div>
                        <label htmlFor="">
                            Nome{" "}
                            <span className="font-bold text-red-500">*</span>
                        </label>
                        <Input type="text" {...register("name")} />
                        {errors.name && (
                            <span className="text-sm text-red-500">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* CPF / Birth DIV */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <label htmlFor="">
                                CPF{" "}
                                <span className="font-bold text-red-500">
                                    *
                                </span>
                            </label>
                            <Input type="text" {...register("cpf")} />
                            {errors.cpf && (
                                <span className="text-sm text-red-500">
                                    {errors.cpf.message}
                                </span>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="">Data de Nascimento</label>
                            <Input type="date" {...register("dateOfBirth")} />
                        </div>
                    </div>

                    {/* Phone / Email DIV */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <label htmlFor="">Telefone</label>
                            <Input type="text" {...register("phone")} />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="">Email</label>
                            <Input type="text" {...register("email")} />
                        </div>
                    </div>

                    {/* Sex / Occupation DIV */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="">Sexo</label>
                            <select
                                {...register("sex")}
                                defaultValue={""}
                                className="bg-transparent outline-none border rounded-md focus:border-fisioblue py-1 px-3 shadow-shape"
                            >
                                <option value="" disabled>
                                    Selecione uma opção
                                </option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="">Ocupação</label>
                            <Input type="text" {...register("profession")} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col py-2 gap-2">
                    <h1>Endereço</h1>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div>
                        <label htmlFor="">
                            CEP{" "}
                            <span className="font-bold text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            {...register("address.cep")}
                            onChange={e => setPatientCEP(e.target.value)}
                            value={patientCEP}
                        />
                        {errors.address?.cep && (
                            <span className="text-sm text-red-500">
                                {errors.address.cep.message}
                            </span>
                        )}
                    </div>

                    {patientAddress ? (
                        <>
                            {/* Street / Number DIV */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="w-full">
                                    <label htmlFor="">
                                        Rua{" "}
                                        <span className="font-bold text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.street")}
                                        defaultValue={patientAddress.logradouro}
                                    />
                                    {errors.address?.street && (
                                        <span className="text-sm text-red-500">
                                            {errors.address.street.message}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">
                                        Número{" "}
                                        <span className="font-bold text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        sizeVariant="small"
                                        type="text"
                                        {...register("address.number")}
                                    />
                                    {errors.address?.number && (
                                        <span className="text-sm text-red-500">
                                            {errors.address.number.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Complement / Neighborhood DIV */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="w-1/2">
                                    <label htmlFor="">Complemento</label>
                                    <Input
                                        type="text"
                                        {...register("address.complement")}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="">
                                        Bairro{" "}
                                        <span className="font-bold text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.neighborhood")}
                                        defaultValue={patientAddress.bairro}
                                    />
                                    {errors.address?.neighborhood && (
                                        <span className="text-sm text-red-500">
                                            {
                                                errors.address.neighborhood
                                                    .message
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* City / State DIV */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="w-1/2">
                                    <label htmlFor="">
                                        Cidade{" "}
                                        <span className="font-bold text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.city")}
                                        value={patientAddress.localidade}
                                        disabled
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="">
                                        Estado{" "}
                                        <span className="font-bold text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.state")}
                                        value={patientAddress.estado}
                                        disabled
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="flex flex-col py-2 gap-2">
                    <h1>Dados Clínicos</h1>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    {/* CID / CNS DIV */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <label htmlFor="">
                                CID{" "}
                                <span className="font-bold text-red-500">
                                    *
                                </span>
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
                        <div className="w-1/2">
                            <label htmlFor="">CNS</label>
                            <Input
                                type="text"
                                {...register("clinicalData.CNS")}
                            />
                        </div>
                    </div>

                    {/* Covenant / Expires */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <label htmlFor="">Convênio</label>
                            <Input
                                type="text"
                                {...register("clinicalData.covenant")}
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="">Data de vencimento</label>
                            <Input
                                type="date"
                                defaultValue="0001-01-01"
                                {...register("clinicalData.expires")}
                            />
                        </div>
                    </div>

                    {/* Allegation / Diagnosis */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <label htmlFor="">
                                Queixa do paciente{" "}
                                <span className="font-bold text-red-500">
                                    *
                                </span>
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
                        <div className="w-1/2">
                            <label htmlFor="">Diagnóstico Inicial</label>
                            <Input
                                type="text"
                                {...register("clinicalData.diagnosis")}
                            />
                        </div>
                    </div>
                </div>

                <fieldset className="flex flex-col gap-1">
                    <legend className="italic font-semibold">
                        Possui adulto responsável?
                    </legend>
                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            id="sim"
                            name="sim"
                            onChange={() =>
                                setHasAdultResponsible(!hasAdultResponsible)
                            }
                            checked={hasAdultResponsible}
                        />
                        <label htmlFor="sim" className="text-sm">
                            Possui
                        </label>
                    </div>
                </fieldset>

                {hasAdultResponsible ? (
                    <div className="flex flex-col py-2 gap-2">
                        <h1>Dados do Adulto</h1>

                        <div className="w-full h-px bg-fisioblue shadow-shape" />

                        {/* Adult Name / Adult CPF DIV */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="w-1/2">
                                <label htmlFor="">
                                    Nome{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
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
                            <div className="w-1/2">
                                <label htmlFor="">
                                    CPF{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
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

                        {/* Adult Phone / Adult Email DIV */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="w-1/2">
                                <label htmlFor="">
                                    Telefone{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
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
                            <div className="w-1/2">
                                <label htmlFor="">
                                    Email{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.email")}
                                />
                                {errors.adultResponsible?.email && (
                                    <span className="text-sm text-red-500">
                                        {errors.adultResponsible.email.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col py-2 gap-2">
                            <h1>Endereço do Adulto</h1>
                            <div className="w-full h-px bg-fisioblue shadow-shape" />

                            <div>
                                <label htmlFor="">
                                    CEP{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </label>
                                <Input
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.cep"
                                    )}
                                    onChange={e => setAdultCEP(e.target.value)}
                                    value={adultCEP}
                                />
                                {errors.adultResponsible?.address?.cep && (
                                    <span className="text-sm text-red-500">
                                        {
                                            errors.adultResponsible?.address
                                                ?.cep.message
                                        }
                                    </span>
                                )}
                            </div>
                            {adultAddress ? (
                                <>
                                    {/* Adult Address Street / Adult Address Number  DIV */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="w-full">
                                            <label htmlFor="">
                                                Rua{" "}
                                                <span className="font-bold text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.street"
                                                )}
                                                defaultValue={
                                                    adultAddress?.logradouro
                                                }
                                            />
                                            {errors.adultResponsible?.address
                                                ?.street && (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors.adultResponsible
                                                            ?.address?.street
                                                            .message
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="">
                                                Número{" "}
                                                <span className="font-bold text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.number"
                                                )}
                                            />
                                            {errors.adultResponsible?.address
                                                ?.number && (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors.adultResponsible
                                                            ?.address?.number
                                                            .message
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Adult Address Complement / Adult Address Neighborhood DIV */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="w-1/2">
                                            <label htmlFor="">
                                                Complemento
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.complement"
                                                )}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label htmlFor="">
                                                Bairro{" "}
                                                <span className="font-bold text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.neighborhood"
                                                )}
                                                defaultValue={
                                                    adultAddress?.bairro
                                                }
                                            />
                                            {errors.adultResponsible?.address
                                                ?.neighborhood && (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors.adultResponsible
                                                            ?.address
                                                            ?.neighborhood
                                                            .message
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Adult Address City / Adult Address State DIV */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="w-1/2">
                                            <label htmlFor="">
                                                Cidade{" "}
                                                <span className="font-bold text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.city"
                                                )}
                                                value={adultAddress?.localidade}
                                                disabled
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label htmlFor="">
                                                Estado{" "}
                                                <span className="font-bold text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.state"
                                                )}
                                                value={adultAddress?.estado}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
            <button
                type="submit"
                className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-1 hover:bg-fisiolightgray"
            >
                Cadastrar Paciente
            </button>
        </form>
    )
}

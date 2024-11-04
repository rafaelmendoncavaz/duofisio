import { useForm } from "react-hook-form"
import { useAPI, useModal } from "../../context/context"
import { updatePatientSchema } from "../../schema/schema"
import { Input } from "../global/input"
import type {
    TypeAddress,
    TypeCep,
    TypeCreatePatient,
    TypeUpdatePatient,
} from "../../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { UserRoundPen, UserRoundX, X } from "lucide-react"
import { viacep } from "../../api/api"
// import { getInputValues } from "../../utils/utils"

export function PatientInfoForm() {
    const { patientData, deletePatient } = useAPI(store => store)
    const { closeModal } = useModal(store => store)

    const [editPatient, setEditPatient] = useState<boolean>(true)

    const [hasAdultResponsible, setHasAdultResponsible] =
        useState<boolean>(false)

    const [patientCEP, setPatientCEP] = useState<string>("")
    const [adultCEP, setAdultCEP] = useState<string>("")
    const [adultStreet, setAdultStreet] = useState<string>("")
    const [adultNeighborhood, setAdultNeighborhood] = useState<string>("")
    const [patientAddress, setPatientAddress] = useState<TypeAddress | null>(
        null
    )
    const [adultAddress, setAdultAddress] = useState<TypeAddress | null>(null)

    useEffect(() => {
        patientData?.adultResponsible
            ? setHasAdultResponsible(true)
            : setHasAdultResponsible(false)

        patientData?.adultResponsible
            ? setAdultCEP(patientData.adultResponsible.address.cep)
            : setAdultCEP("")

        patientData?.adultResponsible
            ? setAdultStreet(patientData.adultResponsible.address.street)
            : setAdultStreet("")

        patientData?.adultResponsible
            ? setAdultNeighborhood(
                  patientData.adultResponsible.address.neighborhood
              )
            : setAdultNeighborhood("")

        if (patientCEP && patientCEP.length === 8) {
            getPatientAddress(patientCEP)
        }
        if (adultCEP && adultCEP.length === 8) {
            getAdultAddress(adultCEP)
        }
    }, [patientData, patientCEP, adultCEP])

    async function getPatientAddress(cep: TypeCep) {
        try {
            const { data } = await viacep.get(`/${cep}/json`)
            setPatientAddress(data)
        } catch (error) {
            console.error("Erro ao buscar endereço do paciente", error)
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

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<TypeCreatePatient>({
        resolver: zodResolver(updatePatientSchema),
    })

    async function handleDeletion() {
        const confirmation = confirm(
            "Você está prestes a deletar este paciente.\nEsta ação não pode ser desfeita!"
        )

        if (!confirmation) return

        if (patientData) await deletePatient(patientData.id)

        closeModal()
    }

    function handleUpdatePatient(data: TypeUpdatePatient) {
        if (data) {
            // setValue("name", getInputValues.patientName)
            // setValue("cpf", getInputValues.patientCPF)
            // setValue("dateOfBirth", getInputValues.patientDoB)
            // setValue("phone", getInputValues.patientPhone)
            // setValue("email", getInputValues.patientEmail)
            // setValue("sex", getInputValues.patientSex)
            // setValue("profession", getInputValues.patientOccupation)
            // setValue("address.cep", getInputValues.patientCEP)
            // setValue("address.street", getInputValues.patientSt)
            // setValue("address.number", getInputValues.patientNumber)
            // setValue("address.complement", getInputValues.patientComplement)
            // setValue("address.neighborhood", getInputValues.patientNeighborhood)
            // setValue("address.city", getInputValues.patientCity)
            // setValue("address.state", getInputValues.patientState)
            // setValue("adultResponsible.name", getInputValues.adultName)
            // setValue("adultResponsible.cpf", getInputValues.adultCPF)
            // setValue("adultResponsible.phone", getInputValues.adultPhone)
            // setValue("adultResponsible.email", getInputValues.adultEmail)
            // setValue("adultResponsible.address.cep", getInputValues.adultCEP)
            // setValue("adultResponsible.address.street", getInputValues.adultSt)
            // setValue(
            //     "adultResponsible.address.number",
            //     getInputValues.adultNumber
            // )
            // setValue(
            //     "adultResponsible.address.complement",
            //     getInputValues.adultComplement
            // )
            // setValue(
            //     "adultResponsible.address.neighborhood",
            //     getInputValues.adultNeighborhood
            // )
            // setValue("adultResponsible.address.city", getInputValues.adultCity)
            // setValue(
            //     "adultResponsible.address.state",
            //     getInputValues.adultState
            // )
        }
        console.log(data)
    }

    return (
        <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit(handleUpdatePatient)}
        >
            <div className="flex flex-col gap-2 w-full max-h-[500px] overflow-hidden scrollbar-hidden overflow-y-auto">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-left">
                        <span className="font-bold text-red-500">*</span> indica
                        campos obrigatórios
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className={`rounded-md ${editPatient ? "bg-blue-500" : "bg-red-400"} text-zinc-100 p-2`}
                            onClick={() => setEditPatient(!editPatient)}
                        >
                            {editPatient ? (
                                <UserRoundPen size={20} />
                            ) : (
                                <X size={20} />
                            )}
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-red-600 text-zinc-100 p-2"
                            onClick={() => handleDeletion()}
                        >
                            <UserRoundX size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col py-2 gap-2">
                    <h1>Dados Pessoais</h1>
                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <div>
                        <label htmlFor="">
                            Nome{" "}
                            <span className="font-bold text-red-500">*</span>
                        </label>
                        <Input
                            id="patientName"
                            colorVariant={editPatient ? "disabled" : "enabled"}
                            type="text"
                            {...register("name")}
                            defaultValue={patientData?.name}
                            disabled={editPatient}
                        />
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
                            <Input
                                id="patientCPF"
                                colorVariant={
                                    editPatient ? "disabled" : "enabled"
                                }
                                type="text"
                                {...register("cpf")}
                                defaultValue={patientData?.cpf}
                                disabled={editPatient}
                            />
                            {errors.cpf && (
                                <span className="text-sm text-red-500">
                                    {errors.cpf.message}
                                </span>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="">Data de Nascimento</label>
                            <Input
                                id="patientDoB"
                                colorVariant={
                                    editPatient ? "disabled" : "enabled"
                                }
                                type="date"
                                {...register("dateOfBirth")}
                                defaultValue={patientData?.dateOfBirth}
                                disabled={editPatient}
                            />
                        </div>
                    </div>

                    {/* Phone / Email DIV */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <label htmlFor="">Telefone</label>
                            <Input
                                id="patientPhone"
                                colorVariant={
                                    editPatient ? "disabled" : "enabled"
                                }
                                type="text"
                                {...register("phone")}
                                defaultValue={patientData?.phone}
                                disabled={editPatient}
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="">Email</label>
                            <Input
                                id="patientEmail"
                                colorVariant={
                                    editPatient ? "disabled" : "enabled"
                                }
                                type="text"
                                {...register("email")}
                                defaultValue={patientData?.email}
                                disabled={editPatient}
                            />
                        </div>
                    </div>

                    {/* Sex / Occupation DIV */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="">Sexo</label>
                            <select
                                id="patientSex"
                                {...register("sex")}
                                defaultValue={patientData?.sex}
                                disabled={editPatient}
                                className={`${editPatient ? "bg-slate-200 cursor-text" : "bg-transparent"} outline-none border rounded-md focus:border-fisioblue py-1 px-3 shadow-shape`}
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
                            <Input
                                id="patientOccupation"
                                colorVariant={
                                    editPatient ? "disabled" : "enabled"
                                }
                                type="text"
                                {...register("profession")}
                                defaultValue={patientData?.profession}
                                disabled={editPatient}
                            />
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
                            id="patientCEP"
                            colorVariant={editPatient ? "disabled" : "enabled"}
                            type="text"
                            {...register("address.cep")}
                            defaultValue={patientData?.address.cep}
                            onChange={e => setPatientCEP(e.target.value)}
                            value={patientCEP}
                            disabled={editPatient}
                        />
                        {errors.address?.cep && (
                            <span className="text-sm text-red-500">
                                {errors.address.cep.message}
                            </span>
                        )}
                    </div>

                    {patientData?.address.cep ? (
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
                                        id="patientSt"
                                        colorVariant={
                                            editPatient ? "disabled" : "enabled"
                                        }
                                        type="text"
                                        {...register("address.street")}
                                        defaultValue={
                                            patientData.address.street
                                        }
                                        disabled={editPatient}
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
                                        id="patientNumber"
                                        colorVariant={
                                            editPatient ? "disabled" : "enabled"
                                        }
                                        sizeVariant="small"
                                        type="text"
                                        {...register("address.number")}
                                        defaultValue={
                                            patientData.address.number
                                        }
                                        disabled={editPatient}
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
                                        id="patientComplement"
                                        colorVariant={
                                            editPatient ? "disabled" : "enabled"
                                        }
                                        type="text"
                                        {...register("address.complement")}
                                        defaultValue={
                                            patientData.address.complement
                                        }
                                        disabled={editPatient}
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
                                        id="patientNeighborhood"
                                        colorVariant={
                                            editPatient ? "disabled" : "enabled"
                                        }
                                        type="text"
                                        {...register("address.neighborhood")}
                                        defaultValue={
                                            patientData.address.neighborhood
                                        }
                                        disabled={editPatient}
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
                                        id="patientCity"
                                        colorVariant={
                                            editPatient ? "disabled" : "enabled"
                                        }
                                        type="text"
                                        {...register("address.city")}
                                        defaultValue={patientData.address.city}
                                        disabled={editPatient}
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
                                        id="patientState"
                                        colorVariant={
                                            editPatient ? "disabled" : "enabled"
                                        }
                                        type="text"
                                        {...register("address.state")}
                                        defaultValue={patientData.address.state}
                                        disabled={editPatient}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}
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
                            disabled={editPatient}
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
                                    id="adultName"
                                    type="text"
                                    {...register("adultResponsible.name")}
                                    colorVariant={
                                        editPatient ? "disabled" : "enabled"
                                    }
                                    disabled={editPatient}
                                    defaultValue={
                                        patientData?.adultResponsible.name
                                    }
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
                                    id="adultCPF"
                                    type="text"
                                    {...register("adultResponsible.cpf")}
                                    colorVariant={
                                        editPatient ? "disabled" : "enabled"
                                    }
                                    disabled={editPatient}
                                    defaultValue={
                                        patientData?.adultResponsible.cpf
                                    }
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
                                    id="adultPhone"
                                    type="text"
                                    {...register("adultResponsible.phone")}
                                    colorVariant={
                                        editPatient ? "disabled" : "enabled"
                                    }
                                    disabled={editPatient}
                                    defaultValue={
                                        patientData?.adultResponsible.phone
                                    }
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
                                    id="adultEmail"
                                    type="text"
                                    {...register("adultResponsible.email")}
                                    colorVariant={
                                        editPatient ? "disabled" : "enabled"
                                    }
                                    disabled={editPatient}
                                    defaultValue={
                                        patientData?.adultResponsible.email
                                    }
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
                                    id="adultCEP"
                                    type="text"
                                    {...register(
                                        "adultResponsible.address.cep"
                                    )}
                                    colorVariant={
                                        editPatient ? "disabled" : "enabled"
                                    }
                                    disabled={editPatient}
                                    defaultValue={
                                        patientData?.adultResponsible.address
                                            .cep
                                    }
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
                            {patientData?.adultResponsible.address ? (
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
                                                id="adultSt"
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.street"
                                                )}
                                                onChange={e =>
                                                    setAdultStreet(
                                                        e.target.value
                                                    )
                                                }
                                                value={adultStreet}
                                                colorVariant={
                                                    editPatient
                                                        ? "disabled"
                                                        : "enabled"
                                                }
                                                disabled={editPatient}
                                                defaultValue={
                                                    patientData
                                                        ?.adultResponsible
                                                        .address.street
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
                                                id="adultNumber"
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.number"
                                                )}
                                                colorVariant={
                                                    editPatient
                                                        ? "disabled"
                                                        : "enabled"
                                                }
                                                disabled={editPatient}
                                                defaultValue={
                                                    patientData
                                                        ?.adultResponsible
                                                        .address.number
                                                }
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
                                                id="adultComplement"
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.complement"
                                                )}
                                                colorVariant={
                                                    editPatient
                                                        ? "disabled"
                                                        : "enabled"
                                                }
                                                disabled={editPatient}
                                                defaultValue={
                                                    patientData
                                                        ?.adultResponsible
                                                        .address.complement
                                                }
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
                                                id="adultNeighborhood"
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.neighborhood"
                                                )}
                                                onChange={e =>
                                                    setAdultNeighborhood(
                                                        e.target.value
                                                    )
                                                }
                                                value={adultNeighborhood}
                                                colorVariant={
                                                    editPatient
                                                        ? "disabled"
                                                        : "enabled"
                                                }
                                                disabled={editPatient}
                                                defaultValue={
                                                    patientData
                                                        ?.adultResponsible
                                                        .address.neighborhood
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
                                                id="adultCity"
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.city"
                                                )}
                                                colorVariant={
                                                    editPatient
                                                        ? "disabled"
                                                        : "enabled"
                                                }
                                                disabled={editPatient}
                                                defaultValue={
                                                    patientData
                                                        ?.adultResponsible
                                                        .address.city
                                                }
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
                                                id="adultState"
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.state"
                                                )}
                                                colorVariant={
                                                    editPatient
                                                        ? "disabled"
                                                        : "enabled"
                                                }
                                                disabled={editPatient}
                                                defaultValue={
                                                    patientData
                                                        ?.adultResponsible
                                                        .address.state
                                                }
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
                className={`w-full rounded-md ${editPatient ? "bg-fisiolightgray" : "bg-fisioblue hover:bg-fisioblue2"} text-slate-100 font-semibold py-1`}
                disabled={editPatient}
            >
                Atualizar dados do paciente
            </button>
        </form>
    )
}

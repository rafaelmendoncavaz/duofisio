import { useForm } from "react-hook-form"
import { useAPI, useModal } from "../../store/store"
import { updatePatientSchema } from "../../schema/schema"
import type { TypeUpdatePatient } from "../../types/types"
import { Input } from "../global/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useCallback } from "react"
import {
    CalendarPlus,
    Hospital,
    UserRoundPen,
    UserRoundX,
    X,
} from "lucide-react"
import { viacep } from "../../api/api"
import { CreateRecord } from "../modal/patient/record/create-record"

export function PatientInfoForm() {
    const {
        patientData,
        getSinglePatient,
        getClinicalRecords,
        updatePatient,
        deletePatient,
        clinicalRecord,
        clinicalRecords,
    } = useAPI()
    const { closeModal } = useModal()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoadingCEP, setIsLoadingCEP] = useState({
        patient: false,
        adult: false,
    })
    const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TypeUpdatePatient>({
        resolver: zodResolver(updatePatientSchema),
        defaultValues: {
            name: "",
            cpf: "",
            dateOfBirth: "",
            phone: null,
            email: null,
            sex: null,
            profession: null,
            address: {
                cep: "",
                street: "",
                number: 0,
                complement: null,
                neighborhood: "",
                city: "",
                state: "",
            },
            adultResponsible: null,
        },
    })

    // Carrega os dados do paciente ao montar o componente
    useEffect(() => {
        if (patientData) {
            reset({
                name: patientData.name,
                cpf: patientData.cpf,
                dateOfBirth: patientData.dateOfBirth.split("T")[0], // Formato YYYY-MM-DD para input date
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
                              state: patientData.adultResponsible.address.state,
                          },
                      }
                    : null,
            })
        }
    }, [patientData, reset])

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

        const response = await updatePatient(data, patientData.id)
        if (response.success) {
            setIsEditing(false)
            getSinglePatient(patientData.id)
        } else {
            console.error("Erro ao atualizar paciente:", response.error)
        }
    }

    const handleDelete = async () => {
        if (!patientData?.id) return
        const confirmation = window.confirm(
            "Você está prestes a deletar este paciente.\nEsta ação não pode ser desfeita!"
        )
        if (confirmation) {
            await deletePatient(patientData.id)
            closeModal()
        }
    }

    const openClinicalHistory = async () => {
        if (!isClinicalHistoryOpen) {
            if (!patientData?.id) return
            await getClinicalRecords(patientData.id)
            setIsClinicalHistoryOpen(true)
        }
    }

    const toggleEdit = () => {
        if (isEditing) {
            reset() // Restaura os valores originais ao cancelar
        }
        setIsEditing(prev => !prev)
    }

    if (!patientData) {
        return (
            <div className="p-4 text-center">Nenhum paciente selecionado.</div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center gap-2">
            <div className="max-h-[70vh] w-full overflow-hidden scrollbar-hidden overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                    {clinicalRecord || clinicalRecords ? null : (
                        <p className="text-sm">
                            <span className="font-bold text-red-500">*</span>{" "}
                            indica campos obrigatórios
                        </p>
                    )}

                    {isClinicalHistoryOpen ? null : (
                        <>
                            <div className="flex items-center gap-4">
                                <button
                                    title="Criar Agendamento"
                                    onClick={openClinicalHistory}
                                    type="button"
                                    className="rounded-md bg-emerald-800 text-slate-100 hover:bg-emerald-900 p-2"
                                >
                                    <CalendarPlus size={20} />
                                </button>
                                <button
                                    title="Abrir Histórico Clínico"
                                    onClick={openClinicalHistory}
                                    type="button"
                                    className="rounded-md bg-fisioblue text-slate-100 hover:bg-sky-900 p-2"
                                >
                                    <Hospital size={20} />
                                </button>
                                <button
                                    title="Editar Paciente"
                                    type="button"
                                    onClick={toggleEdit}
                                    className={`rounded-md p-2 text-white ${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                                >
                                    {isEditing ? (
                                        <X size={20} />
                                    ) : (
                                        <UserRoundPen size={20} />
                                    )}
                                </button>
                                <button
                                    title="Deletar Paciente"
                                    type="button"
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-600 text-white p-2 hover:bg-red-700"
                                >
                                    <UserRoundX size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {isClinicalHistoryOpen ? (
                    <CreateRecord
                        setIsClinicalHistoryOpen={setIsClinicalHistoryOpen}
                    />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-10">
                        {/* Dados Pessoais */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">
                                Dados Pessoais
                            </h2>
                            <div className="w-full h-px bg-fisioblue shadow-shape" />

                            <div className="space-y-2">
                                <label className="block" htmlFor="">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    {...register("name")}
                                    disabled={!isEditing}
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
                                        CPF{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("cpf")}
                                        disabled={!isEditing}
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
                                        className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                                        disabled={!isEditing}
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Masculino">
                                            Masculino
                                        </option>
                                        <option value="Feminino">
                                            Feminino
                                        </option>
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
                                            fetchAddress(
                                                e.target.value,
                                                "patient"
                                            ),
                                    })}
                                    disabled={
                                        !isEditing || isLoadingCEP.patient
                                    }
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
                                        Rua{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.street")}
                                        disabled={!isEditing}
                                    />
                                    {errors.address?.street && (
                                        <span className="text-sm text-red-500">
                                            {errors.address.street.message}
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
                                        {...register("address.number")}
                                        disabled={!isEditing}
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block" htmlFor="">
                                        Bairro{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.neighborhood")}
                                        disabled={!isEditing}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block" htmlFor="">
                                        Cidade{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.city")}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block" htmlFor="">
                                        Estado{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("address.state")}
                                        disabled={!isEditing}
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
                                            Nome{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.name"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.name && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible.name
                                                        .message
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            CPF{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.cpf"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.cpf && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible.cpf
                                                        .message
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            Telefone{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.phone"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.phone && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible
                                                        .phone.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            Email{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="email"
                                            {...register(
                                                "adultResponsible.email"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.email && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible
                                                        .email.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block" htmlFor="">
                                        CEP{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        {...register(
                                            "adultResponsible.address.cep",
                                            {
                                                onChange: e =>
                                                    isEditing &&
                                                    fetchAddress(
                                                        e.target.value,
                                                        "adult"
                                                    ),
                                            }
                                        )}
                                        disabled={
                                            !isEditing || isLoadingCEP.adult
                                        }
                                    />
                                    {errors.adultResponsible?.address?.cep && (
                                        <span className="text-sm text-red-500">
                                            {
                                                errors.adultResponsible.address
                                                    .cep.message
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
                                            Rua{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.address.street"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.address
                                            ?.street && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible
                                                        .address.street.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            Número{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="number"
                                            {...register(
                                                "adultResponsible.address.number"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.address
                                            ?.number && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible
                                                        .address.number.message
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
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            Bairro{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.address.neighborhood"
                                            )}
                                            disabled={!isEditing}
                                        />
                                        {errors.adultResponsible?.address
                                            ?.neighborhood && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors.adultResponsible
                                                        .address.neighborhood
                                                        .message
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            Cidade{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.address.city"
                                            )}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block" htmlFor="">
                                            Estado{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            {...register(
                                                "adultResponsible.address.state"
                                            )}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                        <button
                            type="submit"
                            className={`w-full rounded-md py-2 text-white font-semibold ${isEditing ? "bg-fisioblue hover:bg-fisioblue2" : "bg-gray-400 cursor-not-allowed"}`}
                            disabled={!isEditing || isSubmitting}
                        >
                            {isSubmitting
                                ? "Atualizando..."
                                : "Atualizar Paciente"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

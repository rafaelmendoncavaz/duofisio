import { ArrowLeftCircle } from "lucide-react"
import { useAPI, useModal } from "../../store/store"
import { useForm } from "react-hook-form"
import type { TypeCreateRecord } from "../../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { createRecordSchema } from "../../schema/schema"
import { Input } from "../global/input"

interface CreateRecordFormProps {
    closeCreateRecord: () => void
}

export function CreateRecordForm({ closeCreateRecord }: CreateRecordFormProps) {
    const { createClinicalRecord, clinicalRecords, clearRecords, clearRecord } =
        useAPI()
    const { closeModal } = useModal()

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TypeCreateRecord>({
        resolver: zodResolver(createRecordSchema),
        defaultValues: {
            cid: "",
            allegation: "",
            diagnosis: "",
            covenant: null,
            expires: null,
        },
    })

    const onSubmit = async (data: TypeCreateRecord) => {
        if (!clinicalRecords?.patientId) return

        await createClinicalRecord(clinicalRecords.patientId, data)
        reset()
        clearRecords()
        clearRecord()
        closeModal()
    }

    if (!clinicalRecords) {
        return (
            <div className="p-4 text-center">Nenhum paciente selecionado.</div>
        )
    }

    return (
        <div className="flex flex-col gap-6 py-2 w-full mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-lg">
                    <span className="font-semibold">
                        Novo Registro Clínico para:{" "}
                    </span>
                    <span>{clinicalRecords.patientName}</span>
                </h1>
                <button
                    type="button"
                    onClick={closeCreateRecord}
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
                        <label className="block" htmlFor="">
                            CID <span className="text-red-500">*</span>
                        </label>
                        <Input type="text" {...register("cid")} />
                        {errors.cid && (
                            <span className="text-sm text-red-500">
                                {errors.cid.message}
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block" htmlFor="">
                            Queixa <span className="text-red-500">*</span>
                        </label>
                        <Input type="text" {...register("allegation")} />
                        {errors.allegation && (
                            <span className="text-sm text-red-500">
                                {errors.allegation.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block" htmlFor="">
                            Convênio
                        </label>
                        <Input type="text" {...register("covenant")} />
                    </div>
                    <div className="space-y-2">
                        <label className="block" htmlFor="">
                            Vencimento
                        </label>
                        <Input type="date" {...register("expires")} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block" htmlFor="">
                        Diagnóstico <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Escreva um breve diagnóstico inicial..."
                        className="w-full bg-transparent border rounded-md p-2 focus:border-fisioblue shadow-shape"
                        {...register("diagnosis")}
                    />
                    {errors.diagnosis && (
                        <span className="text-sm text-red-500">
                            {errors.diagnosis.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Registro"}
                </button>
            </form>
        </div>
    )
}

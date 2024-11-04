import { ArrowLeftCircle } from "lucide-react"
import { useAPI, useModal } from "../../context/context"
import { RecordList } from "../modal/create-record/record-list"
import { useForm } from "react-hook-form"
import type { TypeCreateRecord } from "../../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { createRecordSchema } from "../../schema/schema"
import { Input } from "../global/input"
import { RecordInfo } from "../modal/create-record/record-info"

export function CreateRecordForm() {
    const {
        createClinicalRecord,
        clinicalRecords,
        clearRecords,
        clinicalRecord,
        clearRecord,
    } = useAPI(store => store)

    const { closeModal } = useModal(store => store)

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TypeCreateRecord>({
        resolver: zodResolver(createRecordSchema),
    })

    async function handleCreateRecord(data: TypeCreateRecord) {
        if (!clinicalRecords) return

        const { covenant, expires, ...rest } = data

        if (covenant?.length === 0) {
            const newRecord = {
                covenant: undefined,
                expires: undefined,
                ...rest,
            }
            await createClinicalRecord(clinicalRecords.patientId, newRecord)
            reset()
            clearRecords()
            clearRecord()
            closeModal()
            return
        }
        await createClinicalRecord(clinicalRecords.patientId, data)
        reset()
        clearRecords()
        clearRecord()
        closeModal()
    }

    return (
        <div className="mx-10 flex flex-col space-y-4 w-full">
            {clinicalRecord !== null ? (
                <RecordInfo />
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <h1>
                            Criar novo registro clínico para{" "}
                            {clinicalRecords?.patientName}
                        </h1>

                        <button
                            type="button"
                            onClick={clearRecords}
                            className="flex items-center gap-2 rounded-md bg-fisioblue hover:bg-fisioblue2 p-1 text-slate-100 font-semibold"
                        >
                            <ArrowLeftCircle size={20} />
                            Voltar
                        </button>
                    </div>

                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <form
                        className="flex flex-col space-y-6"
                        onSubmit={handleSubmit(handleCreateRecord)}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="w-1/2">
                                <label htmlFor="">
                                    CID{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </label>
                                <Input type="text" {...register("cid")} />
                                {errors.cid && (
                                    <span className="text-sm text-red-500">
                                        {errors.cid.message}
                                    </span>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="">
                                    Queixa{" "}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </label>
                                <Input
                                    type="text"
                                    {...register("allegation")}
                                />
                                {errors.allegation && (
                                    <span className="text-sm text-red-500">
                                        {errors.allegation.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <div className="w-1/2">
                                <label htmlFor="">Convênio</label>
                                <Input type="text" {...register("covenant")} />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="">Vencimento</label>
                                <Input
                                    type="date"
                                    {...register("expires")}
                                    defaultValue="0001-01-01"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="">
                                Diagnóstico Inicial{" "}
                                <span className="font-bold text-red-500">
                                    *
                                </span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Escreva um breve diagnóstico inicial..."
                                className="bg-transparent outline-none border rounded-md focus:border-fisioblue py-1 px-3 shadow-shape"
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
                            className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-1 hover:bg-fisioblue2"
                        >
                            Cadastrar Novo CID
                        </button>
                    </form>

                    <div className="w-full h-px bg-fisioblue shadow-shape" />

                    <h1>Prontuários de {clinicalRecords?.patientName}</h1>

                    <RecordList />
                </>
            )}
        </div>
    )
}

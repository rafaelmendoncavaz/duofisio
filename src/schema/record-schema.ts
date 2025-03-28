import { z } from "zod"

// Criar Registro Clínico (alinhado com backend createClinicalRecordSchema)
export const createRecordSchema = z.object({
    cid: z.string().min(1, "Insira o código do CID"),
    covenant: z.string().nullable(), // Nullable
    expires: z.coerce.date().nullable(), // Nullable
    allegation: z.string().min(1, "Insira a queixa do paciente"),
    diagnosis: z.string().min(1, "Forneça um diagnóstico"),
})

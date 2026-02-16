import { z } from "zod";

// Login (alinhado com backend authLoginSchema)
export const loginSchema = z.object({
    email: z
        .string()
        .email("Insira um e-mail válido")
        .min(5, "Campo obrigatório"),
    password: z
        .string()
        .min(6, "Campo obrigatório")
        .max(20, "Máximo 20 caracteres"),
});

// Dados Clínicos (alinhado com backend clinicalDataSchema)
export const clinicalDataSchema = z.object({
    cid: z.string().min(1, "Insira o código do CID"),
    covenant: z.string().nullable(), // Nullable no backend
    expires: z.preprocess((val) => val === "" ? null : val, z.coerce.date().nullable()), // Nullable e coercível
    CNS: z.string().nullable(), // Nullable no backend
    allegation: z.string().min(1, "Insira a queixa do paciente"),
    diagnosis: z.string().min(1, "Forneça um diagnóstico"),
});

// Endereço (alinhado com backend addressSchema e ViaCEP)
export const addressSchema = z.object({
    cep: z.string().length(8, "CEP deve ter 8 dígitos"),
    street: z.string().min(3, "Insira o nome da rua"),
    number: z.coerce.number().min(1, "Insira o número da casa"),
    complement: z.string().nullable(), // Backend aceita null
    neighborhood: z.string().min(1, "Insira o nome da região/bairro"),
    city: z.string().min(1, "Insira a cidade"),
    state: z.string().length(2, "Insira a UF com 2 caracteres"), // UF como no Brasil
});

// CEP para ViaCEP
export const cep = z.string().length(8, "CEP deve ter 8 dígitos");

// Responsável Adulto (alinhado com backend statusPatientDataSchema.adultResponsible)
export const adultResponsibleSchema = z
    .object({
        name: z.string().min(3, "Insira o nome do responsável"),
        cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
        phone: z.string().min(9, "Insira um número de contato válido"),
        email: z.string().email("Insira um e-mail válido"),
        address: addressSchema,
    })
    .nullable(); // Nullable no backend

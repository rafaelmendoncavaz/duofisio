import { z } from "zod"

export const loginSchema = z.object({
  email: z.string()
    .min(5, "Campo obrigatório")
    .toLowerCase(),
  password: z.string()
    .min(6, "Campo obrigatório")
    .max(20)
    .refine(password => /[A-Z]/.test(password))
    .refine(password => /[a-z]/.test(password))
    .refine(password => /\d/.test(password))
    .refine(password => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
})

export const createPatientSchema = z.object({
  name: z.string(),
  cpf: z.string(),
  rg: z.string(),
  dob: z.string(),
  phone: z.string(),
  email: z.string(),
  sex: z.enum(["Masculino", "Feminino"]),
  profession: z.string(),
  address: z.object({
    cep: z.string(),
    street: z.string(),
    number: z.coerce.number(),
    complement: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string()
  }),
  clinicalData: z.object({
    cid: z.string(),
    covenant: z.string(),
    expires: z.string(),
    CNS: z.coerce.number(),
    allegation: z.string(),
    diagnosis: z.string()
  }),
  adultResponsible: z.object({
    name: z.string(),
    cpf: z.string(),
    rg: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.object({
      cep: z.string(),
      street: z.string(),
      number: z.coerce.number(),
      complement: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string()
    })
  })
})
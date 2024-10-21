import type { z } from "zod"
import type {
    createPatientSchema,
    loginSchema,
    patientListSchema,
} from "../schema/schema"

export type LoginData = z.infer<typeof loginSchema>
export type CreatePatient = z.infer<typeof createPatientSchema>
export type TypePatientList = z.infer<typeof patientListSchema>

export interface Address {
    id: string
    cep: string
    street: string
    number: number
    complement: string
    neighborhood: string
    city: string
    state: string
}

export interface ClinicalData {
    id: string
    cid: string
    covenant: string
    expires: string
    CNS: number
    allegation: string
    diagnosis: string
}

export interface AdultResponsible {
    id: string
    name: string
    cpf: string
    rg: string
    phone: string
    email: string
    address: Address
}

export interface Modal {
    closeModal: () => void
    isCreatePatientModalOpen: boolean
    openCreatePatientModal: () => void
}

export interface SearchFilter {
    searchName: string
    searchPhone: string
    searchCPF: string
    setSearchName: (name: string) => void
    setSearchPhone: (phone: string) => void
    setSearchCPF: (cpf: string) => void
}

export interface TypeAPI {
    token: boolean | null
    patientList: TypePatientList[]
    userLogin: (loginData: LoginData) => Promise<void>
    verifyAuth: () => Promise<void>
    getPatients: () => Promise<void>
}

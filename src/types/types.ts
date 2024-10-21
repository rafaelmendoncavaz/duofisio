import type { z } from "zod"
import type {
    cep,
    createPatientSchema,
    loginSchema,
    patientListSchema,
} from "../schema/schema"

export type TypeLoginData = z.infer<typeof loginSchema>
export type TypeCreatePatient = z.infer<typeof createPatientSchema>
export type TypePatientList = z.infer<typeof patientListSchema>
export type TypeCep = z.infer<typeof cep>

export interface TypeAddress {
    bairro: string
    cep: string
    complemento: string
    ddd: string
    estado: string
    gia: string
    ibge: string
    localidade: string
    logradouro: string
    regiao: string
    siafi: string
    uf: string
    unidade: string
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
    address: TypeAddress
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
    patientCEP: string
    patientAddress: TypeAddress | undefined
    userLogin: (loginData: TypeLoginData) => Promise<void>
    verifyAuth: () => Promise<void>
    setCep: (cep: string) => void
    getAddress: (cep: string) => Promise<void>
    getPatients: () => Promise<void>
}

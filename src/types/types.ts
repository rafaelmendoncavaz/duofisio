import type { z } from "zod"
import type {
    addressSchema,
    cep,
    createPatientSchema,
    createRecordSchema,
    loginSchema,
    patientListSchema,
    updatePatientSchema,
} from "../schema/schema"

export type TypeLoginData = z.infer<typeof loginSchema>
export type TypeCreatePatient = z.infer<typeof createPatientSchema>
export type TypeUpdatePatient = z.infer<typeof updatePatientSchema>
export type TypePatientList = z.infer<typeof patientListSchema>
export type TypeCep = z.infer<typeof cep>
export type AddressSchema = z.infer<typeof addressSchema>
export type TypeCreateRecord = z.infer<typeof createRecordSchema>

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
    expires: Date
    CNS: string
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
    address: AddressSchema
}

export interface Appointments {
    id: string
    appointmentDate: string
    status: string
    createdAt: string
    updatedAt: string
}

export interface TypePatient {
    cpf: string
    createdAt: string
    dateOfBirth: string
    email: string
    id: string
    name: string
    phone: string
    sex: string
    profession: string
    updatedAt: string
    address: AddressSchema
    clinicalData: ClinicalData[]
    adultResponsible: AdultResponsible
    appointments: Appointments[]
}

export interface TypeClinicalRecord {
    patientName: string
    patientId: string
    clinicalRecordList: {
        id: string
        cid: string
        covenant: string
        expires: Date
        CNS: string
        allegation: string
        diagnosis: string
    }[]
}

export interface Modal {
    closeModal: () => void
    isCreatePatientModalOpen: boolean
    isSinglePatientModalOpen: boolean
    isCreateRecordModalOpen: boolean
    openCreatePatientModal: () => void
    openSinglePatientModal: () => void
    openCreateRecordModal: () => void
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
    user: { name: string; email: string } | null
    patientList: TypePatientList[]
    patientData: TypePatient | null
    clinicalRecords: TypeClinicalRecord | null
    clinicalRecord: ClinicalData | null
    clearRecords: () => void
    clearRecord: () => void
    userLogin: (loginData: TypeLoginData) => Promise<void>
    verifyAuth: () => Promise<void>
    createPatient: (
        data: TypeCreatePatient
    ) => Promise<{ status: number; id: string } | undefined>
    getPatients: () => Promise<void>
    getSinglePatient: (id: string) => Promise<void>
    deletePatient: (id: string) => Promise<void>
    createClinicalRecord: (id: string, data: TypeCreateRecord) => Promise<void>
    getClinicalRecords: (id: string) => Promise<void>
    getSingleClinicalRecord: (id: string, recordId: string) => Promise<void>
    deleteClinicalRecord: (id: string, recordId: string) => Promise<void>
}

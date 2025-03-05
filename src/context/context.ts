import { create } from "zustand"
import type {
    SearchFilter,
    TypeLoginData,
    Modal,
    TypeAPI,
    TypeCreatePatient,
    TypeCreateRecord,
} from "../types/types"
import { api } from "../api/api"

export const useModal = create<Modal>(set => ({
    isCreatePatientModalOpen: false,
    isSinglePatientModalOpen: false,
    isCreateRecordModalOpen: false,
    openCreatePatientModal: () => {
        set({
            isCreatePatientModalOpen: true,
        })
    },
    openSinglePatientModal: () => {
        set({
            isSinglePatientModalOpen: true,
        })
    },
    openCreateRecordModal: () => {
        set({
            isCreateRecordModalOpen: true,
        })
    },
    closeModal: () => {
        set({
            isCreatePatientModalOpen: false,
            isSinglePatientModalOpen: false,
            isCreateRecordModalOpen: false,
        })
    },
}))

export const useSearchFilter = create<SearchFilter>(set => ({
    searchName: "",
    searchPhone: "",
    searchCPF: "",
    setSearchName: (name: string) => {
        set({
            searchName: name,
        })
    },
    setSearchPhone: (phone: string) => {
        set({
            searchPhone: phone,
        })
    },
    setSearchCPF: (cpf: string) => {
        set({
            searchCPF: cpf,
        })
    },
}))

export const useAPI = create<TypeAPI>(set => ({
    // Storage states
    token: null,
    user: null,
    patientList: [],
    patientData: null,
    clinicalRecords: null,
    clinicalRecord: null,
    clearRecords: () => {
        set({ clinicalRecords: null })
    },
    clearRecord: () => {
        set({ clinicalRecord: null })
    },

    // Functions
    userLogin: async (loginData: TypeLoginData) => {
        try {
            const { data } = await api.post("/auth/login", loginData)
            if (data.token) {
                localStorage.setItem("@authToken", data.token)
            }
        } catch (error) {
            console.error("Erro ao realizar login", error)
        }
    },
    verifyAuth: async () => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            const { data } = await api.get("/auth/verify", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(data)
            set({ token: token, user: data.user })
        } catch (error) {
            set({ token: false })
            console.error("Erro ao realizar autenticação", error)
        }
    },
    createPatient: async (data: TypeCreatePatient) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            const { status, data: id } = await api.post(
                "/dashboard/patients",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return {
                status,
                id,
            }
        } catch (error) {
            console.error("Erro ao criar paciente", error)
        }
    },
    getPatients: async () => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            const { data } = await api.get("/dashboard/patients", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            set({ patientList: data.patients })
        } catch (error) {
            console.error("Erro ao realizar busca por pacientes", error)
        }
    },
    getSinglePatient: async (id: string) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            set({
                patientData: null,
            })
            const { data } = await api.get(`/dashboard/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(data)
            set({
                patientData: data.patient,
            })
        } catch (error) {
            console.error("Erro ao buscar informações deste paciente", error)
        }
    },
    deletePatient: async (id: string) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            await api.delete(`/dashboard/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {
            console.error("Erro ao deletar paciente", error)
        }
    },
    createClinicalRecord: async (id: string, data: TypeCreateRecord) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            await api.post(`/dashboard/patients/${id}/clinical`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {
            console.error("Erro ao criar novo registro clínico", error)
        }
    },
    getClinicalRecords: async (id: string) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            set({ clinicalRecords: null })
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            set({ clinicalRecords: data.patientClinicalRecord })
        } catch (error) {
            console.error(
                "Erro ao realizar busca por registros clínicos",
                error
            )
        }
    },
    getSingleClinicalRecord: async (id: string, recordId: string) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            set({ clinicalRecord: null })
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical/${recordId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log(data)
            set({ clinicalRecord: data.clinicalRecord })
        } catch (error) {
            console.error("Erro ao buscar registro específico", error)
        }
    },
    deleteClinicalRecord: async (id: string, recordId: string) => {
        try {
            const token: string = localStorage.getItem("@authToken") as string
            if (!token) throw new Error("Erro ao buscar o token")
            await api.delete(`/dashboard/patients/${id}/clinical/${recordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {
            console.error("Erro ao deletar registro específico", error)
        }
    },
}))

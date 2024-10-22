import { create } from "zustand"
import type {
    SearchFilter,
    TypeLoginData,
    Modal,
    TypeAPI,
    TypeCreatePatient,
} from "../types/types"
import { api } from "../api/api"

export const useModal = create<Modal>(set => ({
    isCreatePatientModalOpen: false,
    openCreatePatientModal: () => {
        set({
            isCreatePatientModalOpen: true,
        })
    },
    closeModal: () => {
        set({
            isCreatePatientModalOpen: false,
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
    patientList: [],

    // Functions
    userLogin: async (loginData: TypeLoginData) => {
        try {
            await api.post("/login", loginData)
        } catch (error) {
            console.error("Erro ao realizar login", error)
        }
    },
    verifyAuth: async () => {
        try {
            const { data } = await api.get("/dashboard/auth", {
                withCredentials: true,
            })
            set({ token: data.authenticated })
        } catch (error) {
            set({ token: false })
            console.error("Erro ao realizar autenticação", error)
        }
    },
    getPatients: async () => {
        try {
            const { data } = await api.get("/dashboard/patients", {
                withCredentials: true,
            })
            set({ patientList: data.patients })
        } catch (error) {
            console.error("Erro ao realizar busca por pacientes", error)
        }
    },
    createPatient: async (data: TypeCreatePatient) => {
        try {
            const { status, data: id } = await api.post(
                "/dashboard/patients",
                data,
                {
                    withCredentials: true,
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
}))

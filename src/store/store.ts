import { create } from "zustand"
import type {
    TypeSearchFilter,
    TypeLoginData,
    TypeModal,
    TypeAPI,
    TypeCreatePatient,
    TypeUpdatePatient,
    TypeCreateRecord,
    TypeCreateAppointment,
    TypeAppointmentUpdate,
    TypeAppointmentRepeat,
    TypeAppointmentList,
} from "../types/types"
import { api } from "../api/api"
import {
    addDays,
    endOfDay,
    startOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
} from "date-fns"

// Função auxiliar para aplicar o filtro
function applyFilter(
    appointments: TypeAppointmentList[] | null,
    filter: string | null,
    state: TypeAPI
) {
    if (!appointments || !filter) return null

    const now = new Date(new Date().getTime() - 3 * 60 * 60 * 1000)
    let start: Date
    let end: Date

    switch (filter) {
        case "history":
            start = startOfDay(state.startDate)
            end = endOfDay(state.endDate)
            break
        case "today":
            start = startOfDay(now)
            end = endOfDay(now)
            break
        case "tomorrow":
            start = startOfDay(addDays(now, 1))
            end = endOfDay(addDays(now, 1))
            break
        case "week":
            start = startOfWeek(state.currentWeek)
            end = endOfWeek(state.currentWeek)
            break
        case "month":
            start = startOfMonth(state.currentMonth)
            end = endOfMonth(state.currentMonth)
            break
        default:
            return null
    }

    const filteredAppointments = appointments
        .map(appointment => {
            const filteredSessions = appointment.sessions.filter(session =>
                isWithinInterval(new Date(session.appointmentDate), {
                    start,
                    end,
                })
            )
            if (filteredSessions.length > 0) {
                return {
                    ...appointment,
                    sessions: filteredSessions,
                }
            }
            return null
        })
        .filter(Boolean) as TypeAppointmentList[]

    return filteredAppointments
}

export const useModal = create<TypeModal>(set => ({
    isCreatePatientModalOpen: false,
    isSinglePatientModalOpen: false,
    isCreateAppointmentModalOpen: false,
    isSingleAppointmentModalOpen: false,
    isFilterByTimespanModalOpen: false,
    openCreatePatientModal: () => set({ isCreatePatientModalOpen: true }),
    openSinglePatientModal: () => set({ isSinglePatientModalOpen: true }),
    openSingleAppointmentModal: () =>
        set({ isSingleAppointmentModalOpen: true }),
    openFilterByTimespanModal: () => set({ isFilterByTimespanModalOpen: true }),
    closeModal: () =>
        set({
            isCreatePatientModalOpen: false,
            isSinglePatientModalOpen: false,
            isSingleAppointmentModalOpen: false,
            isFilterByTimespanModalOpen: false,
        }),
}))

export const useSearchFilter = create<TypeSearchFilter>(set => ({
    searchName: "",
    searchPhone: "",
    searchCPF: "",
    setSearchName: (name: string) => set({ searchName: name }),
    setSearchPhone: (phone: string) => set({ searchPhone: phone }),
    setSearchCPF: (cpf: string) => set({ searchCPF: cpf }),
}))

export const useAPI = create<TypeAPI>((set, get) => ({
    // Estados
    error: null,
    token: localStorage.getItem("@authToken") || null,
    user: null,
    employees: null,
    activeFilter: "today",
    startDate: "",
    endDate: "",
    currentWeek: startOfWeek(
        new Date(new Date().getTime() - 3 * 60 * 60 * 1000),
        { weekStartsOn: 0 }
    ),
    currentMonth: new Date(new Date().getTime() - 3 * 60 * 60 * 1000),

    // Armazenamento de requisições
    patientList: [],
    patientData: null,
    clinicalRecords: null,
    clinicalRecord: null,
    appointmentList: null,
    filteredAppointments: null,
    selectedAppointmentData: null,
    sessionData: null,

    // Funções de limpeza
    clearRecords: () => set({ clinicalRecords: null }),
    clearRecord: () => set({ clinicalRecord: null }),
    clearAppointment: () => set({ sessionData: null }),
    clearError: () => set({ error: null }),
    clearToken: () => set({ token: null }),

    // Funções de controle de estado
    setSelectedAppointmentData: appointment =>
        set({ selectedAppointmentData: appointment }),
    clearSelectedAppointmentData: () => set({ selectedAppointmentData: null }),
    setActiveFilter: filter => {
        set(state => {
            const filteredAppointments = applyFilter(
                state.appointmentList,
                filter,
                state
            )

            return {
                activeFilter: filter,
                filteredAppointments,
            }
        })
    },
    setDateRangeFilter: (startDate, endDate) => {
        set({ startDate, endDate })
    },

    prevWeek: () =>
        set(state => {
            const newWeek = subWeeks(state.currentWeek, 1)
            return { currentWeek: newWeek }
        }),

    nextWeek: () =>
        set(state => {
            const newWeek = addWeeks(state.currentWeek, 1)
            return { currentWeek: newWeek }
        }),

    prevMonth: () =>
        set(state => {
            const newMonth = subMonths(state.currentMonth, 1)
            return { currentMonth: newMonth }
        }),

    nextMonth: () =>
        set(state => {
            const newMonth = addMonths(state.currentMonth, 1)
            return { currentMonth: newMonth }
        }),

    // Funções assíncronas
    userLogin: async (loginData: TypeLoginData) => {
        try {
            const { data } = await api.post("/auth/login", loginData)
            const token = data.token
            localStorage.setItem("@authToken", token)
            set({ token, error: null })
            await get().verifyAuth() // Verifica usuário após login
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao realizar login" })
            return { success: false, error }
        }
    },

    verifyAuth: async () => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data } = await api.get("/auth/verify", {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({
                token,
                user: data.user,
                employees: data.employees,
                error: null,
            })
            return { success: true, user: data.user }
        } catch (error) {
            set({
                token: null,
                user: null,
                error: "Erro ao verificar autenticação",
            })
            return { success: false, error }
        }
    },

    createPatient: async (data: TypeCreatePatient) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data: response, status } = await api.post(
                "/dashboard/patients",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, patientId: response.patientId, status }
        } catch (error) {
            set({ error: "Erro ao criar paciente" })
            return { success: false, error }
        }
    },

    getPatients: async () => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data } = await api.get("/dashboard/patients", {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ patientList: data.patients, error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao buscar pacientes" })
            return { success: false, error }
        }
    },

    getSinglePatient: async (id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ patientData: null })
            const { data } = await api.get(`/dashboard/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ patientData: data.patient, error: null })
            return { success: true, patient: data.patient }
        } catch (error) {
            set({ error: "Erro ao buscar paciente" })
            return { success: false, error }
        }
    },

    updatePatient: async (data: TypeUpdatePatient, id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { status } = await api.put(
                `/dashboard/patients/${id}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, status }
        } catch (error) {
            set({ error: "Erro ao editar paciente" })
            return { success: false, error }
        }
    },

    deletePatient: async (id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.delete(`/dashboard/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao deletar paciente" })
            return { success: false, error }
        }
    },

    createClinicalRecord: async (id: string, data: TypeCreateRecord) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.post(`/dashboard/patients/${id}/clinical`, data, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao criar registro clínico" })
            return { success: false, error }
        }
    },

    getClinicalRecords: async (id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ clinicalRecords: null })
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ clinicalRecords: data.patientClinicalRecord, error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao buscar registros clínicos" })
            return { success: false, error }
        }
    },

    getSingleClinicalRecord: async (id: string, recordId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ clinicalRecord: null })
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical/${recordId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ clinicalRecord: data.clinicalRecord, error: null })
            return { success: true, record: data.clinicalRecord }
        } catch (error) {
            set({ error: "Erro ao buscar registro clínico" })
            return { success: false, error }
        }
    },

    deleteClinicalRecord: async (id: string, recordId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.delete(`/dashboard/patients/${id}/clinical/${recordId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao deletar registro clínico" })
            return { success: false, error }
        }
    },

    createAppointment: async (data: TypeCreateAppointment) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data: response, status } = await api.post(
                "/dashboard/appointments",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return {
                success: true,
                appointmentId: response.appointmentId,
                status,
            }
        } catch (error) {
            set({ error: "Erro ao criar agendamento" })
            return { success: false, error }
        }
    },

    getAppointments: async () => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data } = await api.get("/dashboard/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            })

            set(state => {
                const newAppointmentList = data.appointments
                const newFilteredAppointments = applyFilter(
                    newAppointmentList,
                    state.activeFilter,
                    state
                )

                return {
                    appointmentList: newAppointmentList,
                    filteredAppointments: newFilteredAppointments,
                    error: null,
                }
            })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao buscar agendamentos" })
            return { success: false, error }
        }
    },

    getSingleAppointment: async (appointmentId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ sessionData: null })
            const { data } = await api.get(
                `/dashboard/appointments/${appointmentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ sessionData: data.session, error: null })
            return { success: true, appointment: data.session }
        } catch (error) {
            set({ error: "Erro ao buscar agendamento" })
            return { success: false, error }
        }
    },

    repeatAppointment: async (
        data: TypeAppointmentRepeat,
        appointmentId: string
    ) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data: response } = await api.post(
                `/dashboard/appointments/${appointmentId}/repeat`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, appointmentIds: response.sessionIds }
        } catch (error) {
            set({ error: "Erro ao repetir agendamento" })
            return { success: false, error }
        }
    },

    updateAppointment: async (
        data: TypeAppointmentUpdate,
        appointmentId: string
    ) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { status } = await api.put(
                `/dashboard/appointments/${appointmentId}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, status }
        } catch (error) {
            set({ error: "Erro ao editar agendamento" })
            return { success: false, error }
        }
    },

    deleteAppointment: async (appointmentId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.delete(`/dashboard/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao deletar agendamento" })
            return { success: false, error }
        }
    },
}))

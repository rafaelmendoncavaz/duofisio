import { create } from "zustand";
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
    TypeCreateEmployee,
    TypeUpdateEmployee,
} from "../types/types";
import { api } from "../api/api";
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
} from "date-fns";
import { dateOnlyToUTC } from "../utils/date";

// Função auxiliar para aplicar o filtro
function applyFilter(
    appointments: TypeAppointmentList[] | null,
    filter: string | null,
    state: TypeAPI
) {
    if (!appointments || !filter) return null;

    const now = new Date();
    let start: Date;
    let end: Date;

    switch (filter) {
        case "history":
            start = dateOnlyToUTC(state.startDate as string, "start");
            end = dateOnlyToUTC(state.endDate as string, "end");
            break;
        case "today":
            start = startOfDay(now);
            end = endOfDay(now);
            break;
        case "tomorrow":
            start = startOfDay(addDays(now, 1));
            end = endOfDay(addDays(now, 1));
            break;
        case "week":
            start = startOfWeek(state.currentWeek);
            end = endOfWeek(state.currentWeek);
            break;
        case "month":
            start = startOfMonth(state.currentMonth);
            end = endOfMonth(state.currentMonth);
            break;
        default:
            return null;
    }

    const filteredAppointments = appointments
        .map((appointment) => {
            const filteredSessions = appointment.sessions.filter((session) => {
                const sessDate = new Date(session.appointmentDate);
            if (!(sessDate instanceof Date) || Number.isNaN(sessDate.getTime())) {
                return false;
            }
                return isWithinInterval(new Date(session.appointmentDate), {
                    start,
                    end,
                })
            }
            );
            if (filteredSessions.length > 0) {
                return {
                    ...appointment,
                    sessions: filteredSessions,
                };
            }
            return null;
        })
        .filter(Boolean) as TypeAppointmentList[];
        
    return filteredAppointments;
}

export const useModal = create<TypeModal>((set) => ({
    isCreatePatientModalOpen: false,
    isSinglePatientModalOpen: false,
    isCreateAppointmentModalOpen: false,
    isSingleAppointmentModalOpen: false,
    isFilterByTimespanModalOpen: false,
    isCreateEmployeeModalOpen: false,
    isUpdateEmployeeModalOpen: false,
    openCreatePatientModal: () => set({ isCreatePatientModalOpen: true }),
    openSinglePatientModal: () => set({ isSinglePatientModalOpen: true }),
    openSingleAppointmentModal: () =>
        set({ isSingleAppointmentModalOpen: true }),
    openFilterByTimespanModal: () => set({ isFilterByTimespanModalOpen: true }),
    openCreateEmployeeModal: () => set({ isCreateEmployeeModalOpen: true }),
    openUpdateEmployeeModal: () => set({ isUpdateEmployeeModalOpen: true }),
    closeModal: () =>
        set({
            isCreatePatientModalOpen: false,
            isSinglePatientModalOpen: false,
            isSingleAppointmentModalOpen: false,
            isFilterByTimespanModalOpen: false,
            isCreateEmployeeModalOpen: false,
            isUpdateEmployeeModalOpen: false,
        }),
}));

export const useSearchFilter = create<TypeSearchFilter>((set) => ({
    searchName: "",
    searchPhone: "",
    searchCPF: "",
    setSearchName: (name: string) => set({ searchName: name }),
    setSearchPhone: (phone: string) => set({ searchPhone: phone }),
    setSearchCPF: (cpf: string) => set({ searchCPF: cpf }),
}));

export const useAPI = create<TypeAPI>((set, get) => ({
    // Estados
    error: null,
    csrfToken: null,
    user: null,
    employees: null,
    employee: null,
    activeFilter: "today",
    startDate: "",
    endDate: "",
    currentWeek: startOfWeek(new Date(), { 
        weekStartsOn: 0 
    }
    ),
    currentMonth: new Date(),

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

    // Funções de controle de estado
    setCsrfToken: (csrfToken) => set({ csrfToken }),
    setSelectedAppointmentData: (appointment) =>
        set({ selectedAppointmentData: appointment }),
    clearSelectedAppointmentData: () => set({ selectedAppointmentData: null }),
    setActiveFilter: (filter) => {
        set((state) => {
            const filteredAppointments = applyFilter(
                state.appointmentList,
                filter,
                state
            );
            return {
                activeFilter: filter,
                filteredAppointments,
            };
        });
    },
    setDateRangeFilter: (startDate, endDate) => {
        set({ startDate, endDate });
    },

    prevWeek: () =>
        set((state) => ({
            currentWeek: subWeeks(state.currentWeek, 1),
        })),

    nextWeek: () =>
        set((state) => ({
            currentWeek: addWeeks(state.currentWeek, 1),
        })),

    prevMonth: () =>
        set((state) => ({
            currentMonth: subMonths(state.currentMonth, 1),
        })),

    nextMonth: () =>
        set((state) => ({
            currentMonth: addMonths(state.currentMonth, 1),
        })),

    // Funções assíncronas
    userLogin: async (loginData: TypeLoginData) => {
        try {
            const { getCsrfToken, setCsrfToken } = get();
            const token = await getCsrfToken();
            if (token) {
                setCsrfToken(token);
            }
            await api.post("/auth/login", loginData);
            set({ error: null });
            await get().verifyAuth(); // Verifica usuário após login
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao realizar login" });
            return { success: false, error };
        }
    },

    userLogout: async () => {
        try {
            await api.post("/auth/logout"); // CSRF tratado pelo interceptor
            set({ user: null, csrfToken: null, employees: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao fazer logout" });
            return { success: false, error };
        }
    },

    verifyAuth: async () => {
        try {
            const { csrfToken, getCsrfToken, setCsrfToken } = get();
            if (!csrfToken) {
                const token = await getCsrfToken();
                if (token) setCsrfToken(token);
            }

            const { data } = await api.get("/auth/verify");
            if (!data.user) throw new Error("Usuário não encontrado");
            set({
                user: data.user,
                employees: data.employees,
                error: null,
            });
            return { success: true, user: data.user };
        } catch (error) {
            set({
                user: null,
                error: "Erro ao verificar autenticação",
                csrfToken: null,
            });
            return { success: false, error };
        }
    },

    getCsrfToken: async () => {
        const { csrfToken } = get();
        if (csrfToken) return csrfToken;

        try {
            const response = await api.get<{ csrfToken: string }>(
                "/auth/csrf-token"
            );
            set({ csrfToken: response.data.csrfToken }); // Atualiza o estado
            return response.data.csrfToken;
        } catch (error) {
            console.error("Erro ao obter CSRF token:", error);
            return null;
        }
    },

    createPatient: async (data: TypeCreatePatient) => {
        try {
            const { data: response, status } = await api.post(
                "/dashboard/patients",
                data
            );
            set({ error: null });
            return { success: true, patientId: response.patientId, status };
        } catch (error) {
            set({ error: "Erro ao criar paciente" });
            return { success: false, error };
        }
    },

    getPatients: async () => {
        try {
            const { data } = await api.get("/dashboard/patients");
            set({ patientList: data.patients, error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao buscar pacientes" });
            return { success: false, error };
        }
    },

    getSinglePatient: async (id: string) => {
        try {
            set({ patientData: null });
            const { data } = await api.get(`/dashboard/patients/${id}`);
            set({ patientData: data.patient, error: null });
            return { success: true, patient: data.patient };
        } catch (error) {
            set({ error: "Erro ao buscar paciente" });
            return { success: false, error };
        }
    },

    updatePatient: async (data: TypeUpdatePatient, id: string) => {
        try {
            const { status } = await api.put(`/dashboard/patients/${id}`, data);
            set({ error: null });
            return { success: true, status };
        } catch (error) {
            set({ error: "Erro ao editar paciente" });
            return { success: false, error };
        }
    },

    deletePatient: async (id: string) => {
        try {
            await api.delete(`/dashboard/patients/${id}`);
            set({ error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao deletar paciente" });
            return { success: false, error };
        }
    },

    createClinicalRecord: async (id: string, data: TypeCreateRecord) => {
        try {
            await api.post(`/dashboard/patients/${id}/clinical`, data);
            set({ error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao criar registro clínico" });
            return { success: false, error };
        }
    },

    getClinicalRecords: async (id: string) => {
        try {
            set({ clinicalRecords: null });
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical`
            );
            set({ clinicalRecords: data.patientClinicalRecord, error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao buscar registros clínicos" });
            return { success: false, error };
        }
    },

    getSingleClinicalRecord: async (id: string, recordId: string) => {
        try {
            set({ clinicalRecord: null });
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical/${recordId}`
            );
            set({ clinicalRecord: data.clinicalRecord, error: null });
            return { success: true, record: data.clinicalRecord };
        } catch (error) {
            set({ error: "Erro ao buscar registro clínico" });
            return { success: false, error };
        }
    },

    deleteClinicalRecord: async (id: string, recordId: string) => {
        try {
            await api.delete(`/dashboard/patients/${id}/clinical/${recordId}`);
            set({ error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao deletar registro clínico" });
            return { success: false, error };
        }
    },

    createAppointment: async (data: TypeCreateAppointment) => {
        try {
            const { data: response, status } = await api.post(
                "/dashboard/appointments",
                data
            );
            set({ error: null });
            return {
                success: true,
                appointmentId: response.appointmentId,
                status,
            };
        } catch (error) {
            set({ error: "Erro ao criar agendamento" });
            return { success: false, error };
        }
    },

    getAppointments: async () => {
        try {
            const { data } = await api.get("/dashboard/appointments");
            set((state) => {
                const newAppointmentList = data.appointments;
                const newFilteredAppointments = applyFilter(
                    newAppointmentList,
                    state.activeFilter,
                    state
                );
                return {
                    appointmentList: newAppointmentList,
                    filteredAppointments: newFilteredAppointments,
                    error: null,
                };
            });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao buscar agendamentos" });
            return { success: false, error };
        }
    },

    getSingleAppointment: async (appointmentId: string) => {
        try {
            set({ sessionData: null });
            const { data } = await api.get(
                `/dashboard/appointments/${appointmentId}`
            );
            set({ sessionData: data.session, error: null });
            return { success: true, appointment: data.session };
        } catch (error) {
            set({ error: "Erro ao buscar agendamento" });
            return { success: false, error };
        }
    },

    repeatAppointment: async (
        data: TypeAppointmentRepeat,
        appointmentId: string
    ) => {
        try {
            const { data: response } = await api.post(
                `/dashboard/appointments/${appointmentId}/repeat`,
                data
            );
            set({ error: null });
            return { success: true, appointmentIds: response.sessionIds };
        } catch (error) {
            set({ error: "Erro ao repetir agendamento" });
            return { success: false, error };
        }
    },

    updateAppointment: async (
        data: TypeAppointmentUpdate,
        appointmentId: string
    ) => {
        try {
            const { status } = await api.put(
                `/dashboard/appointments/${appointmentId}`,
                data
            );
            set({ error: null });
            return { success: true, status };
        } catch (error) {
            set({ error: "Erro ao editar agendamento" });
            return { success: false, error };
        }
    },

    deleteAppointment: async (appointmentId: string) => {
        try {
            await api.delete(`/dashboard/appointments/${appointmentId}`);
            set({ error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao deletar agendamento" });
            return { success: false, error };
        }
    },

    createEmployee: async (data: TypeCreateEmployee) => {
        try {
            const { status } = await api.post(
                "/dashboard/employee",
                data,
            );
            set({ error: null });
            return { success: true, status };
        } catch (error) {
            set({ error: "Erro ao criar usuário" });
            return { success: false, error };
        }
    },

    getEmployees: async () => {
        try {
            const { data } = await api.get("/dashboard/employee");
            set({ employees: data.employees, error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao buscar funcionários" });
            return { success: false, error };
        }
    }, 

    getEmployee: async (id: string) => {
        try {
            const { data } = await api.get(
                `/dashboard/employee/${id}`
            );
            console.log(data)
            set({ employee: data, error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao buscar funcionário específico" });
            return { success: false, error };
        }
    },
    updateEmployee: async (id: string, data: TypeUpdateEmployee) => {
         try {
            const { status } = await api.patch(
                `/dashboard/employee/${id}`,
                data,
            );
            set({ error: null });
            return { success: true, status };
        } catch (error) {
            set({ error: "Erro ao editar funcionário" });
            return { success: false, error };
        }
    },
    deleteEmployee: async (id: string) => {
        try {
            await api.delete(`/dashboard/employee/${id}`);
            set({ error: null });
            return { success: true };
        } catch (error) {
            set({ error: "Erro ao deletar funcionário" });
            return { success: false, error };
        }
    }
}));

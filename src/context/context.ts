import { create } from "zustand"
import { SearchFilter, type Modal } from "../types/types"

export const useModal = create<Modal>((set) => ({

  isCreatePatientModalOpen: false,
  openCreatePatientModal: () => {
    set({
      isCreatePatientModalOpen: true,
    })
  },
  closeModal: () => {
    set({
      isCreatePatientModalOpen: false
    })
  }
}))

export const useSearchFilter = create<SearchFilter>((set) => ({

  searchName: "",
  searchPhone: "",
  searchCPF: "",
  setSearchName: (name: string) => {
    set({
      searchName: name
    })
  },
  setSearchPhone: (phone: string) => {
    set({
      searchPhone: phone
    })
  },
  setSearchCPF: (cpf: string) => {
    set({
      searchCPF: cpf
    })
  }
}))
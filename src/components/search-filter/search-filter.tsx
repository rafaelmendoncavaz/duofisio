import { UserPlus, UserSearch, User, Phone, IdCard } from "lucide-react"
import { Input } from "../global/input"
import { useModal, useSearchFilter } from "../../store/store"
import { useState } from "react"

export function SearchFilter() {
    const { openCreatePatientModal } = useModal()
    const { setSearchName, setSearchPhone, setSearchCPF } = useSearchFilter()

    const [nameInput, setNameInput] = useState("") // Estado local para o input

    // Formata CPF enquanto digita
    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, "").slice(0, 11)
        const formattedValue = rawValue
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        e.target.value = formattedValue
        setSearchCPF(rawValue)
    }

    // Formata Telefone enquanto digita
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, "").slice(0, 11)
        const formattedValue = rawValue
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
        e.target.value = formattedValue
        setSearchPhone(rawValue)
    }

    // Normaliza Nome para busca, mas mantém o input como digitado
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value
        setNameInput(rawValue) // Mostra o que o usuário digitou
        const normalizedValue = rawValue
            .normalize("NFD")
            // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        setSearchName(normalizedValue) // Salva normalizado para busca
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl">Lista de Pacientes</h1>
                <button
                    onClick={openCreatePatientModal}
                    type="button"
                    className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                >
                    <UserPlus size={20} />
                    Cadastrar Paciente
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <UserSearch size={20} />
                    <label
                        htmlFor="search-name"
                        className="font-semibold text-lg"
                    >
                        Pesquisar
                    </label>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                    <div className="flex items-center gap-2">
                        <User size={20} aria-hidden="true" />
                        <Input
                            id="search-name"
                            sizeVariant="small"
                            type="text"
                            placeholder="Pesquisar pelo nome..."
                            value={nameInput} // Controlado pelo estado local
                            onChange={handleNameChange}
                            aria-label="Pesquisar por nome"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={20} aria-hidden="true" />
                        <Input
                            sizeVariant="small"
                            type="text"
                            placeholder="Pesquisar pelo telefone..."
                            defaultValue=""
                            onChange={handlePhoneChange}
                            aria-label="Pesquisar por telefone"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <IdCard size={20} aria-hidden="true" />
                        <Input
                            sizeVariant="small"
                            type="text"
                            placeholder="Pesquisar pelo CPF..."
                            defaultValue=""
                            onChange={handleCPFChange}
                            aria-label="Pesquisar por CPF"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

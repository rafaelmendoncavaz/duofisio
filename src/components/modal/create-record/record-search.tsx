import { UserSearch, User, Phone, IdCard } from "lucide-react"
import { PatientList } from "../../../pages/dashboard/patient/patient-list/patient-list"
import { Input } from "../../global/input"
import { useState } from "react"
import type { TypePatientList } from "../../../types/types"
import { useAPI } from "../../../context/context"

export function RecordSearch() {
    const [searchName, setSearchName] = useState<string>("")
    const [searchPhone, setSearchPhone] = useState<string>("")
    const [searchCPF, setSearchCPF] = useState<string>("")

    const { getClinicalRecords, clinicalRecords } = useAPI(store => store)

    async function handleClick(patient: TypePatientList) {
        await getClinicalRecords(patient.id)
    }

    return (
        <div className="mx-10 flex flex-col space-y-4">
            <div>
                <div className="flex flex-col gap-2 max-w-[50%]">
                    <div className="flex items-center gap-2">
                        <UserSearch size={20} />
                        <label
                            htmlFor="search"
                            className="font-semibold text-lg"
                        >
                            Pesquisar paciente
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={20} />
                        <Input
                            sizeVariant="small"
                            name="search"
                            type="text"
                            placeholder="Pesquisar pelo nome..."
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                        />
                        <Phone size={20} />
                        <Input
                            sizeVariant="small"
                            name="search"
                            type="text"
                            placeholder="Pesquisar pelo telefone..."
                            value={searchPhone}
                            onChange={e => setSearchPhone(e.target.value)}
                        />
                        <IdCard size={20} />
                        <Input
                            sizeVariant="small"
                            name="search"
                            type="text"
                            placeholder="Pesquisar pelo CPF..."
                            value={searchCPF}
                            onChange={e => setSearchCPF(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-fisioblue shadow-shape" />

            <PatientList
                searchName={searchName}
                searchPhone={searchPhone}
                searchCPF={searchCPF}
                handleClick={handleClick}
            />
        </div>
    )
}

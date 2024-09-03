import { IdCard, Phone, User, UserPlus, UserSearch } from "lucide-react";
import { DashboardTemplate } from "../../../components/dashboard/dashboard-template";
import { Input } from "../../../components/global/input";
import { PatientList } from "./patient-list/patient-list";
import { useState } from "react";
import { patientData } from "../../../data/data";

export function DashboardPatients() {

  const [searchName, setSearchName] = useState("")
  const [searchPhone, setSearchPhone] = useState("")
  const [searchCPF, setSearchCPF] = useState("")

  const search = searchName.length || searchPhone.length || searchCPF.length > 0
    ? patientData.filter(patient => {
      const matchName = patient.name.toLowerCase().includes(searchName.toLowerCase())
      const matchPhone = patient.phone.includes(searchPhone)
      const matchCPF = patient.cpf.includes(searchCPF)

      return matchName && matchPhone && matchCPF
    })
    : patientData

  return (
    <DashboardTemplate>
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-2xl">
          Lista de pacientes
        </h1>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisiolightgray px-2 py-[0.125rem] shadow-shape font-semibold"
        >
          <UserPlus size={20} />
          Cadastrar Paciente
        </button>
      </div>

      <div>
        <div className="flex flex-col gap-2 max-w-[50%]">
          <div className="flex items-center gap-2">
            <UserSearch size={20} />
            <label htmlFor="search" className="font-semibold text-lg">Pesquisar</label>
          </div>
          <div className="flex items-center gap-2">
            <User size={20} />
            <Input
              sizeVariant="small"
              name="search"
              type="text"
              placeholder="Pesquisar pelo nome..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Phone size={20} />
            <Input
              sizeVariant="small"
              name="search"
              type="text"
              placeholder="Pesquisar pelo telefone..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
            <IdCard size={20} />
            <Input
              sizeVariant="small"
              name="search"
              type="text"
              placeholder="Pesquisar pelo CPF..."
              value={searchCPF}
              onChange={(e) => setSearchCPF(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-fisioblue shadow-shape" />

      <PatientList searchParam={search} />

    </DashboardTemplate>
  )
}
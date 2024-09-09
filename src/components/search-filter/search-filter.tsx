import { UserPlus, UserSearch, User, Phone, IdCard } from "lucide-react";
import { Input } from "../global/input";
import { useModal, useSearchFilter } from "../../context/context";

export function SearchFilter() {

  const { openCreatePatientModal } = useModal((store) => store)
  const {
    searchName,
    setSearchName,
    searchPhone,
    setSearchPhone,
    searchCPF,
    setSearchCPF
  } = useSearchFilter((store) => store)

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-2xl">
          Lista de pacientes
        </h1>
        <button
          onClick={openCreatePatientModal}
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
    </>
  )
}
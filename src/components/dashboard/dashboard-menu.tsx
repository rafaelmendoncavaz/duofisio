import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function DashboardMenu() {

  const navigate = useNavigate()

  function handleLogoutSection() {
    navigate("/")
  }

  return (
    <div className="bg-fisioblue text-slate-100 py-2">
      <div className="max-w-7xl flex justify-between mx-auto">
        <div className="flex gap-2">
          <h1 className="leading-none">
            Seja bem vindo, <span className="font-semibold">Usuário</span>
          </h1>
        </div>
        <div>
          <button
            onClick={() => handleLogoutSection()}
            className="flex items-center gap-2"
          >
            <span className="leading-none hover:underline">
              Sair
            </span>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAPI } from "../../store/store"

export function DashboardMenu() {
    const navigate = useNavigate()
    const { user, token, clearToken } = useAPI()

    const handleLogout = () => {
        // TODO: Implementar logout completo no futuro (limpar token, chamar API, etc.)
        if (token) {
            localStorage.removeItem("@authToken") // Provisório até logout completo
            clearToken()
        }
        navigate("/")
    }

    return (
        <div className="bg-fisioblue text-slate-100 py-2">
            <div className="max-w-7xl flex justify-between mx-auto">
                <div className="flex gap-2">
                    <h1 className="leading-none">
                        Você está logado como:{" "}
                        <span className="font-semibold">
                            {user?.name ?? "Usuário"}
                        </span>
                    </h1>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:underline"
                    >
                        <span className="leading-none font-semibold">Sair</span>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

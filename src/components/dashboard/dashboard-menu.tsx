import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAPI } from "../../context/context"

export function DashboardMenu() {
    const navigate = useNavigate()

    const { user } = useAPI(store => store)

    function handleLogoutSection() {
        navigate("/")
    }

    return (
        <div className="bg-fisioblue text-slate-100 py-2">
            <div className="max-w-7xl flex justify-between mx-auto">
                <div className="flex gap-2">
                    <h1 className="leading-none">
                        Seja bem vindo,{" "}
                        <span className="font-semibold">{user?.name}</span>
                    </h1>
                </div>
                <div>
                    <button
                        type="button"
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

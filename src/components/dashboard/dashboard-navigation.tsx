import { CalendarDays, Hospital, House, Users } from "lucide-react"
import roundedLogo from "../../assets/duofisio-rounded-transparent.png"
import { useNavigate } from "react-router-dom"
import { useAPI } from "../../store/store"

export function DashboardNavigation() {
    const { verifyAuth } = useAPI()

    const navigate = useNavigate()

    const navItems = [
        {
            id: 1,
            label: "Página Inicial",
            path: async () => {
                await verifyAuth()
                navigate("/dashboard")
            },
            icon: <House size={20} />,
        },
        {
            id: 2,
            label: "Agenda",
            path: () => navigate("/dashboard/agendamentos"),
            icon: <CalendarDays size={20} />,
        },
        {
            id: 3,
            label: "Pacientes",
            path: () => navigate("/dashboard/pacientes"),
            icon: <Users size={20} />,
        },
    ]

    return (
        <aside className="bg-fisioblue text-slate-100 w-60 h-full">
            <div className="flex flex-col gap-10 p-4">
                {/* Cabeçalho */}
                <div className="shadow-shape px-2 py-1.5 flex items-center gap-2">
                    <div className="rounded-full h-10 w-10 bg-slate-100 overflow-hidden">
                        <img
                            className="object-contain w-full h-full"
                            src={roundedLogo}
                            alt="Logotipo Duofisio"
                        />
                    </div>
                    <h1 className="font-bold text-lg text-right font-roboto">
                        Menu Principal
                    </h1>
                </div>

                {/* Navegação */}
                <div>
                    <div className="shadow-shape px-2 py-1.5 flex items-center gap-2">
                        <Hospital size={20} />
                        <h1 className="font-semibold font-roboto text-lg">
                            Clínica
                        </h1>
                    </div>

                    <nav className="mt-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={item.path}
                                className="flex items-center gap-2 py-1.5 w-full font-semibold hover:bg-slate-100 hover:text-fisioblue transition-colors"
                                type="button"
                            >
                                <div className="w-1 h-6 bg-yellow-700" />
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    )
}

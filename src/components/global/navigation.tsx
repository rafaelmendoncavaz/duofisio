import { ClipboardPen, Cross, House, List, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavButton } from "./nav-button";

export function Navigation() {
    const navigate = useNavigate();

    const navItems = [
        { path: "/", label: "Página Inicial", icon: <House size={20} /> },
        {
            path: "/sobre-nos",
            label: "Sobre Nós",
            icon: <UsersRound size={20} />,
        },
        { path: "/servicos", label: "Serviços", icon: <List size={20} /> },
        {
            path: "/agendamentos",
            label: "Agendamento",
            icon: <ClipboardPen size={20} />,
        },
        { path: "/convenios", label: "Convênios", icon: <Cross size={20} /> },
    ];

    return (
        <nav className="flex items-center gap-2">
            {navItems.map((item) => (
                <NavButton
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    aria-label={`Navegar para ${item.label}`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </NavButton>
            ))}
        </nav>
    );
}

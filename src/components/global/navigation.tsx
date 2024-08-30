import { ClipboardPen, Cross, House, List, UsersRound } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { NavButton } from "./nav-button"

export function Navigation() {

  const navigate = useNavigate()

  return (
    <nav className="flex items-center gap-1">
      <NavButton onClick={() => navigate("/")}>
        <House />
        Página Inicial
      </NavButton>

      <NavButton onClick={() => navigate("/sobre-nos")}>
        <UsersRound />
        Sobre Nós
      </NavButton>

      <NavButton onClick={() => navigate("/servicos")}>
        <List />
        Serviços
      </NavButton>

      <NavButton onClick={() => navigate("/agendamentos")}>
        <ClipboardPen />
        Agendamento
      </NavButton>

      <NavButton onClick={() => navigate("/convenios")}>
        <Cross />
        Convênios
      </NavButton>
    </nav>
  )
}
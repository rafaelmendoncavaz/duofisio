import { CalendarDays, Hospital, Users } from "lucide-react"
import roundedLogo from "../../assets/duofisio-rounded-transparent.png"
import { useNavigate } from "react-router-dom"

export function DashboardNavigation() {

  const navigate = useNavigate()

  return (
    <aside className="bg-fisiogray text-slate-100 w-60 absolute left-0 top-9 bottom-0 flex flex-col gap-10">
      <div className="shadow-shape px-2 py-1.5 flex items-center gap-2">
        <div className="rounded-[50%] h-10 w-10 bg-slate-100">
          <img className="object-contain" src={roundedLogo} alt="Duofisio" />
        </div>
        <h1 className="font-bold text-lg font-roboto">
          Menu Principal
        </h1>
      </div>

      <div>
        <div className="shadow-shape px-2 py-1.5 flex items-center gap-2">
          <Hospital />
          <h1 className="font-semibold font-roboto text-lg">
            Clínica
          </h1>
        </div>

        <button
          onClick={() => navigate("/dashboard/agendamentos")}
          className="flex items-center gap-2 py-1.5 w-full hover:bg-gray-700"
          type="button"
        >
          <div className="w-[4px] h-6 bg-fisiolightgray" />
          <CalendarDays />
          <span>
            Agenda
          </span>
        </button>

        <button
          onClick={() => navigate("/dashboard/pacientes")}
          className="flex items-center gap-2 py-1.5 w-full hover:bg-gray-700"
          type="button"
        >
          <div className="w-[4px] h-6 bg-fisiolightgray" />
          <Users />
          <span>
            Pacientes
          </span>
        </button>
      </div>
    </aside>
  )
}
import {
    CalendarPlus,
    Filter,
    Calendar1,
    CalendarRange,
    CalendarDays,
} from "lucide-react"
import { useModal } from "../../store/store"

export function AppointmentFilter() {
    const { openCreateAppointmentModal } = useModal()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl">Agendamentos</h1>
                <button
                    onClick={openCreateAppointmentModal}
                    type="button"
                    className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                >
                    <CalendarPlus size={20} />
                    Criar Agendamento
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Filter size={20} />
                    <label
                        htmlFor="search-name"
                        className="font-semibold text-lg"
                    >
                        Filtrar
                    </label>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                        >
                            <Calendar1 size={20} aria-hidden="true" />
                            Hoje
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                        >
                            <CalendarRange size={20} aria-hidden="true" />
                            Semana
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md bg-fisioblue text-slate-100 hover:bg-fisioblue2 px-3 py-1 shadow-shape font-semibold transition-colors"
                        >
                            <CalendarDays size={20} aria-hidden="true" />
                            Mês
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

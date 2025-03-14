import {
    Filter,
    Calendar1,
    CalendarRange,
    CalendarDays,
    Calendar,
} from "lucide-react"
import { useAPI } from "../../store/store"

export function AppointmentFilter() {
    const { getAppointments } = useAPI()

    const handleFilter = async (
        filter: "today" | "tomorrow" | "week" | "month"
    ) => {
        const result = await getAppointments({ filter })
        if (!result.success) {
            console.error("Erro ao aplicar o filtro: ", result.error)
        }
    }

    const filterByToday = () => {
        handleFilter("today")
    }

    const filterByTomorrow = () => {
        handleFilter("tomorrow")
    }

    const filterByWeek = () => {
        handleFilter("week")
    }

    const filterByMonth = () => {
        handleFilter("month")
    }

    return (
        <div className="space-y-6">
            <h1 className="font-bold text-2xl">Agendamentos</h1>

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
                            className="flex items-center gap-2 rounded-md border border-fisioblue bg-transparent text-fisioblue hover:bg-fisioblue2 hover:text-slate-100 focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors"
                            onClick={filterByToday}
                        >
                            <Calendar size={20} aria-hidden="true" />
                            Hoje
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md border border-fisioblue bg-transparent text-fisioblue hover:bg-fisioblue2 hover:text-slate-100 focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors"
                            onClick={filterByTomorrow}
                        >
                            <Calendar1 size={20} aria-hidden="true" />
                            Amanhã
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md border border-fisioblue bg-transparent text-fisioblue hover:bg-fisioblue2 hover:text-slate-100 focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors"
                            onClick={filterByWeek}
                        >
                            <CalendarRange size={20} aria-hidden="true" />
                            Semana
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md border border-fisioblue bg-transparent text-fisioblue hover:bg-fisioblue2 hover:text-slate-100 focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors"
                            onClick={filterByMonth}
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

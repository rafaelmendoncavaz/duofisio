import {
    Filter,
    Calendar1,
    CalendarRange,
    CalendarDays,
    Calendar,
    CalendarSearch,
} from "lucide-react";
import { useAPI, useModal } from "../../../../store/store";

export function ScheduleFilter() {
    const { setActiveFilter, activeFilter } = useAPI();
    const { openFilterByTimespanModal } = useModal();

    const handleTimespanModal = () => {
        openFilterByTimespanModal();
    };

    const filterByToday = () => {
        setActiveFilter("today");
    };

    const filterByTomorrow = () => {
        setActiveFilter("tomorrow");
    };

    const filterByWeek = () => {
        setActiveFilter("week");
    };

    const filterByMonth = () => {
        setActiveFilter("month");
    };

    return (
        <div className="space-y-6">
            <h1 className="font-bold text-2xl text-fisiogray">Agendamentos</h1>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Filter size={20} />
                    <label
                        htmlFor="search-name"
                        className="font-semibold text-lg text-fisiogray"
                    >
                        Filtrar
                    </label>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border border-fisioblue hover:bg-fisioblue2 hover:text-slate-100 ${activeFilter === "history" ? "text-slate-100 bg-fisioblue" : "bg-transparent text-fisioblue"} focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors`}
                            onClick={handleTimespanModal}
                        >
                            <CalendarSearch size={20} aria-hidden="true" />
                            Anteriores
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border border-fisioblue hover:bg-fisioblue2 hover:text-slate-100 ${activeFilter === "today" ? "text-slate-100 bg-fisioblue" : "bg-transparent text-fisioblue"} focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors`}
                            onClick={filterByToday}
                        >
                            <Calendar size={20} aria-hidden="true" />
                            Hoje
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border border-fisioblue hover:bg-fisioblue2 hover:text-slate-100 ${activeFilter === "tomorrow" ? "text-slate-100 bg-fisioblue" : "bg-transparent text-fisioblue"} focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors`}
                            onClick={filterByTomorrow}
                        >
                            <Calendar1 size={20} aria-hidden="true" />
                            Amanhã
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border border-fisioblue hover:bg-fisioblue2 hover:text-slate-100 ${activeFilter === "week" ? "text-slate-100 bg-fisioblue" : "bg-transparent text-fisioblue"} focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors`}
                            onClick={filterByWeek}
                        >
                            <CalendarRange size={20} aria-hidden="true" />
                            Semana
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`flex items-center gap-2 rounded-md border border-fisioblue hover:bg-fisioblue2 hover:text-slate-100 ${activeFilter === "month" ? "text-slate-100 bg-fisioblue" : "bg-transparent text-fisioblue"} focus:text-slate-100 focus:bg-fisioblue px-3 py-1 shadow-shape font-semibold transition-colors`}
                            onClick={filterByMonth}
                        >
                            <CalendarDays size={20} aria-hidden="true" />
                            Mês
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

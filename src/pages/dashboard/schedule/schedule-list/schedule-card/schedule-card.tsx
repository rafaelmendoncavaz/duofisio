import { CalendarCheck2, CircleAlert, ClipboardList, Flag } from "lucide-react";

// Definindo as novas props esperadas para uma sessão
interface ScheduleCardProps {
    sessionNumber: number;
    totalSessions: number;
    sessionId: string;
    appointmentId: string;
    patientName: string;
    status: "SOLICITADO" | "CONFIRMADO" | "CANCELADO" | "FINALIZADO";
    cid: string;
    appointmentDate?: string;
    onSessionClick: (sessionId: string, appointmentId: string) => void;
}

export function ScheduleCard({
    sessionNumber,
    totalSessions,
    sessionId,
    appointmentId,
    patientName,
    status,
    cid,
    onSessionClick,
    appointmentDate,
}: ScheduleCardProps) {
    const styleGuides = {
        solicitado:
            status === "SOLICITADO" &&
            "border-yellow-800 bg-yellow-100 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-100",
        confirmado:
            status === "CONFIRMADO" &&
            "border-green-800 bg-green-100 text-green-800 hover:bg-green-800 hover:text-green-100",
        cancelado:
            status === "CANCELADO" &&
            "border-gray-800 bg-gray-200 text-gray-800 hover:bg-gray-800 hover:text-gray-200",
        finalizado:
            status === "FINALIZADO" &&
            "border-red-800 bg-red-100 text-red-800 hover:bg-red-800 hover:text-red-100",
    };
    return (
        <li
            onClick={() => onSessionClick(sessionId, appointmentId)}
            onKeyDown={(e) =>
                e.key === "Enter" && onSessionClick(sessionId, appointmentId)
            }
            tabIndex={0}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Componente funcional como botão
            // biome-ignore lint/a11y/useSemanticElements: Mantido como li para consistência com lista
            role="button"
            className={`w-full max-w-52 h-full border ${styleGuides.solicitado || styleGuides.confirmado || styleGuides.cancelado || styleGuides.finalizado} rounded-md shadow-shape cursor-pointer p-1 transition-colors focus:outline-none focus:ring-2 overflow-hidden`}
            aria-label={`Ver detalhes da sessão de ${patientName}`}
            title={`Ver detalhes da sessão de ${patientName}`}
        >
            <div className="flex items-center gap-1">
                <ClipboardList size={16} />
                <span className="text-sm font-semibold truncate">
                    {patientName}
                </span>
            </div>

            {appointmentDate && (
                <div className="flex items-center gap-1">
                    <CalendarCheck2 size={16} />
                    <span className="text-xs font-semibold">
                        {appointmentDate.slice(0, 10).replace(/-/g, "/")}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between gap-1 mt-0.5">
                <div className="flex items-center gap-1">
                    <Flag size={16} />
                    <span className="text-xs font-normal truncate">
                        {status}
                    </span>
                </div>
                {sessionNumber === totalSessions ? (
                    <span
                        title="Esta é a última sessão"
                        className="text-red-600 flex-shrink-0"
                    >
                        <CircleAlert size={16} />
                    </span>
                ) : null}
            </div>

            <div className="flex items-center justify-between mt-0.5 px-1 py-0.5 text-xs bg-blue-200 text-blue-800 rounded truncate">
                <span className="font-semibold">CID:</span>
                <span>{cid}</span>
            </div>
        </li>
    );
}

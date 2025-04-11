import type { TypePatient } from "../../../../types/types"
import { SessionCard } from "./session-card"

interface SessionListProps {
    sessions: TypePatient["appointments"][0]["sessions"]
}

export function SessionList({ sessions }: SessionListProps) {
    return (
        <ul className="grid grid-cols-2 gap-4 overflow-hidden scrollbar-hidden overflow-y-auto">
            {sessions.map(session => (
                <SessionCard key={session.id} session={session} />
            ))}
        </ul>
    )
}

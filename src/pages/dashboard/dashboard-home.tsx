import { DashboardTemplate } from "../../components/dashboard/dashboard-template"
import { useAPI } from "../../context/context"

export function DashboardHome() {
    const { verifyAuth } = useAPI(store => store)

    return (
        <DashboardTemplate>
            <h1>Seja bem vindo!</h1>
            <p>Há 9 atendimentos para serem realizados hoje!</p>

            <button type="button" onClick={() => verifyAuth()}>
                Teste verifyAuth
            </button>
        </DashboardTemplate>
    )
}

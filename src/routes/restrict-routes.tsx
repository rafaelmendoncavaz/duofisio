import { Outlet, Navigate } from "react-router-dom"
import { useAPI } from "../context/context"

export function RestrictRoutes() {
    const { token } = useAPI(store => store)

    if (token === null) {
        return <div>Redirecionando...</div>
    }

    return token ? <Outlet /> : <Navigate to="/" />
}

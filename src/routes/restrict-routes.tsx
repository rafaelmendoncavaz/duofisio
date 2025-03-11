import { Outlet, Navigate } from "react-router-dom"
import { useAPI } from "../store/store"
import { useEffect, useState } from "react"

export function RestrictRoutes() {
    const { token, verifyAuth } = useAPI()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            if (token === null) {
                await verifyAuth()
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [token, verifyAuth])

    if (isLoading) {
        return <div>Carregando...</div>
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />
}

import { Outlet, Navigate } from "react-router-dom"
import { useAPI } from "../store/store"
import { useEffect, useState } from "react"

export function RestrictRoutes() {
    const { user, verifyAuth } = useAPI()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            if (user === null) {
                await verifyAuth()
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [user, verifyAuth])

    if (isLoading) {
        return <div>Carregando...</div>
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />
}

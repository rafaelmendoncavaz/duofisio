import { useEffect, useState } from "react"
import { useAPI } from "./store/store"
import { MainRoutes } from "./routes/main-routes"

function App() {
    const { verifyAuth } = useAPI()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                await verifyAuth()
            } finally {
                setIsLoading(false)
            }
        }
        initAuth()
    }, [verifyAuth])

    if (isLoading) {
        return <div>Carregando...</div>
    }

    return <MainRoutes />
}

export default App

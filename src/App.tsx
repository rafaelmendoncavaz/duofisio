import { useEffect } from "react"
import { useAPI } from "./context/context"
import { MainRoutes } from "./routes/main-routes"

function App() {
    const { verifyAuth } = useAPI(store => store)

    useEffect(() => {
        verifyAuth()
    }, [verifyAuth])

    return (
        <>
            <MainRoutes />
        </>
    )
}

export default App

import { useEffect, useState } from "react";
import { useAPI } from "./store/store";
import { MainRoutes } from "./routes/main-routes";
import { useLocation } from "react-router-dom";

function App() {
    const { verifyAuth } = useAPI();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (
                    location.pathname.startsWith("/dashboard") ||
                    location.pathname === "/login"
                ) {
                    await verifyAuth();
                }
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, [verifyAuth, location.pathname]);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return <MainRoutes />;
}

export default App;

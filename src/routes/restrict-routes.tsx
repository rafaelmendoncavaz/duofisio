import { Outlet, Navigate } from "react-router-dom";
import { useAPI } from "../store/store";

export function RestrictRoutes() {
    const { user } = useAPI();

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

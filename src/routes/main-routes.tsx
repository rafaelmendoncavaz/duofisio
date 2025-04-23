import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home/home";
import { About } from "../pages/about/about";
import { Services } from "../pages/services/services";
import { Appointments } from "../pages/appointments/appointments";
import { Covenants } from "../pages/covenants/covenants";
import { Login } from "../components/login/login";
import { RestrictRoutes } from "./restrict-routes";
import { DashboardPatients } from "../pages/dashboard/patient/patient";
import { DashboardSchedule } from "../pages/dashboard/schedule/schedule";
import { DashboardHome } from "../components/dashboard/dashboard-home";

export function MainRoutes() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre-nos" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/agendamentos" element={<Appointments />} />
            <Route path="/convenios" element={<Covenants />} />
            <Route path="/login" element={<Login />} />

            {/* Rotas restritas */}
            <Route path="/dashboard" element={<RestrictRoutes />}>
                <Route index element={<DashboardHome />} />
                <Route path="agendamentos" element={<DashboardSchedule />} />
                <Route path="pacientes" element={<DashboardPatients />} />
            </Route>
        </Routes>
    );
}

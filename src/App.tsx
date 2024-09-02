import { About } from "./pages/about/about"
import { Home } from "./pages/home/home"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Services } from "./pages/services/services"
import { Appointments } from "./pages/appointments/appointments"
import { Covenants } from "./pages/covenants/covenants"
import { Login } from "./components/login/login"
import { DashboardSchedule } from "./pages/dashboard/schedule/schedule"
import { DashboardPatients } from "./pages/dashboard/patient/patient"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "sobre-nos",
    element: <About />
  },
  {
    path: "servicos",
    element: <Services />
  },
  {
    path: "agendamentos",
    element: <Appointments />
  },
  {
    path: "convenios",
    element: <Covenants />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "dashboard/agendamentos",
    element: <DashboardSchedule />
  },
  {
    path: "dashboard/pacientes",
    element: <DashboardPatients />
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
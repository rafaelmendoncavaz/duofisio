import { About } from "./pages/about/about"
import { Home } from "./pages/home/home"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Services } from "./pages/services/services"
import { Appointments } from "./pages/appointments/appointments"
import { Covenants } from "./pages/covenants/covenants"

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
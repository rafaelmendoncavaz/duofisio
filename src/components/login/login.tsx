import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Key, User } from "lucide-react"
import { Contact } from "../global/contact"
import { Input } from "../global/input"
import { useAPI } from "../../store/store"
import type { TypeLoginData } from "../../types/types"
import roundLogo from "../../assets/duofisio-rounded-transparent.png"
import { useEffect } from "react"

export function Login() {
    const navigate = useNavigate()
    const { verifyAuth, userLogin } = useAPI()

    useEffect(() => {
        const checkForRedirect = async () => {
            const result = await verifyAuth()
            if (result.success) {
                navigate("/dashboard")
            }
        }
        checkForRedirect()
    }, [navigate, verifyAuth])

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<TypeLoginData>({
        defaultValues: { email: "", password: "" },
    })

    const onSubmit = async (data: TypeLoginData) => {
        const response = await userLogin(data)
        if (!response.success) {
            return
        }
        navigate("/dashboard", { replace: true })
    }

    return (
        <div className="h-screen flex flex-col">
            <Contact />
            <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-sm rounded-md border-t border-fisioblue shadow-shape bg-white">
                    <header className="bg-fisioblue flex items-center gap-2 p-2 rounded-t-md">
                        <div className="rounded-full h-10 w-10 bg-slate-100 overflow-hidden">
                            <img
                                src={roundLogo}
                                alt="Duofisio"
                                className="object-contain h-full w-full"
                            />
                        </div>
                        <h1 className="text-slate-100 font-semibold">Login</h1>
                    </header>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 p-4"
                    >
                        <div className="flex items-center gap-2">
                            <User
                                className="text-fisioblue"
                                size={20}
                                aria-hidden="true"
                            />
                            <Input
                                type="email"
                                placeholder="Ex: usuario@email.com"
                                autoComplete="username"
                                {...register("email")}
                                aria-label="Email"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Key
                                className="text-fisioblue"
                                size={20}
                                aria-hidden="true"
                            />
                            <Input
                                type="password"
                                placeholder="Insira sua senha"
                                autoComplete="current-password"
                                {...register("password")}
                                aria-label="Senha"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-fisioblue text-slate-100 font-semibold py-2 hover:bg-fisioblue2 disabled:bg-gray-400 transition-colors"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Entrando..." : "Fazer Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

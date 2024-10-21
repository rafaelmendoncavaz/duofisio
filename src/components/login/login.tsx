import { Contact } from "../global/contact"
import roundLogo from "../../assets/duofisio-rounded-transparent.png"
import { Input } from "../global/input"
import { useForm } from "react-hook-form"
import { Key, User } from "lucide-react"
import type { LoginData } from "../../types/types"
import { useNavigate } from "react-router-dom"
import { useAPI } from "../../context/context"
import { useEffect } from "react"

export function Login() {
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm<LoginData>()
    const { userLogin, verifyAuth, token } = useAPI(store => store)

    useEffect(() => {
        if (token) {
            navigate("/dashboard")
        }
    }, [token, navigate])

    async function submitLogin(data: LoginData) {
        await userLogin(data)
        await verifyAuth()
        navigate("/dashboard")
    }

    return (
        <>
            <Contact />
            <div className="fixed inset-10 flex items-center justify-center">
                <div className="border-t border-fisioblue shadow-shape rounded-md w-80 mx-auto">
                    <div className="bg-fisioblue flex items-center gap-2 p-1">
                        <div className="rounded-[50%] h-10 w-10 bg-slate-100">
                            <img
                                className="object-contain"
                                src={roundLogo}
                                alt="Duofisio"
                            />
                        </div>
                        <h1 className="text-slate-100 font-semibold">Login</h1>
                    </div>

                    <form
                        className="flex flex-col items-center space-y-2 p-2"
                        onSubmit={handleSubmit(submitLogin)}
                    >
                        <div className="w-full flex items-center gap-1">
                            <User className="text-fisioblue" size={20} />
                            <Input
                                type="email"
                                autoComplete="off"
                                placeholder="Ex: usuario@email.com"
                                {...register("email")}
                            />
                        </div>

                        <div className="w-full flex items-center gap-1">
                            <Key className="text-fisioblue" size={20} />
                            <Input
                                id="teste"
                                type="password"
                                autoComplete="off"
                                placeholder="Insira sua senha"
                                {...register("password")}
                            />
                        </div>

                        <button
                            className="w-full rounded-md text-slate-100 bg-fisioblue font-semibold text-center py-1"
                            type="submit"
                        >
                            Fazer Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

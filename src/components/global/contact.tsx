import { ArrowBigLeft, Facebook, Instagram, Lock } from "lucide-react"
import wp from "../../assets/whatsapp.svg"
import { useMatch, useNavigate } from "react-router-dom"

export function Contact() {
    const navigate = useNavigate()
    const match = useMatch("/login")
    const isLogin = match?.pathname

    function handleLoginSection() {
        if (!isLogin) {
            return navigate("/login")
        }
        return navigate("/")
    }

    return (
        <div className="bg-fisioblue text-slate-100 py-2">
            <div className="max-w-7xl flex justify-between mx-auto">
                <div className="flex gap-2">
                    <h1 className="leading-none">Fale Conosco:</h1>
                    <a href="" target="_blank">
                        <Facebook size={20} />
                    </a>
                    <a href="" target="_blank">
                        <Instagram size={20} />
                    </a>
                    <a className="h-5 w-5" href="" target="_blank">
                        <img src={wp} alt="Whatsapp" />
                    </a>
                </div>
                <div>
                    <button
                        onClick={() => handleLoginSection()}
                        className="flex gap-2"
                    >
                        {isLogin ? (
                            <ArrowBigLeft size={20} />
                        ) : (
                            <Lock size={20} />
                        )}
                        <span className="leading-none hover:underline">
                            {isLogin ? "Retornar" : "Área Restrita"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

import { ArrowBigLeft, Facebook, Instagram, Lock } from "lucide-react";
import wp from "../../assets/whatsapp.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useAPI } from "../../store/store";

export function Contact() {
    const { verifyAuth, user } = useAPI();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isLoginPage = pathname === "/login";

    const handleNavigation = async () => {
        if (!isLoginPage) {
            if (user) {
                navigate("/dashboard", { replace: true });
                return;
            }

            const { success } = await verifyAuth();

            if (success) {
                navigate("/dashboard", { replace: true });
                return;
            }

            navigate("/login", { replace: true });
            return;
        }

        navigate("/", { replace: true });
    };

    return (
        <div className="bg-fisioblue text-slate-100 py-2">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="leading-none">Fale Conosco:</h1>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                    >
                        <Facebook size={20} />
                    </a>
                    <a
                        href="https://instagram.com/clinduofisio"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </a>
                    <a
                        href="https://wa.me/5544998216349"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                    >
                        <img
                            src={wp}
                            alt="Ícone do WhatsApp"
                            className="h-5 w-5"
                        />
                    </a>
                </div>
                <button
                    type="button"
                    onClick={handleNavigation}
                    className="flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-fisioblue2"
                >
                    {isLoginPage ? (
                        <ArrowBigLeft size={20} />
                    ) : (
                        <Lock size={20} />
                    )}
                    <span className="leading-none">
                        {isLoginPage ? "Retornar" : "Área Restrita"}
                    </span>
                </button>
            </div>
        </div>
    );
}

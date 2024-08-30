import { Facebook, Instagram, Lock } from "lucide-react"
import wp from "../../assets/whatsapp.svg"

export function Contact() {

  return (
    <div className="bg-fisioblue text-slate-100 py-2">
      <div className="max-w-7xl flex items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <h1>
            Fale Conosco:
          </h1>
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
          <button className="flex items-center gap-1">
            <Lock size={20} />
            <span className="hover:underline">
              Área Restrita
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
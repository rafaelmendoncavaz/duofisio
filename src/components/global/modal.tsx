import type { ReactNode } from "react"
import { useKeyDown, useOutClick } from "../../hooks/hooks"
import { X } from "lucide-react"
import { useModal } from "../../context/context"

interface ModalProps {
    children: ReactNode
    title: string
}

export function Modal({ children, title }: ModalProps) {
    const { closeModal } = useModal.getState()

    const modalRef = useOutClick(() => {
        closeModal()
    })

    const btnRef = useKeyDown("Escape", element => {
        element?.click()
    })

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center"
            role="dialog"
        >
            <div
                className="w-[800px] rounded shadow-shape space-y-5 bg-slate-100"
                ref={modalRef}
            >
                <div className="flex items-center justify-between py-3 px-5 bg-fisioblue2 rounded-t">
                    <h1 className="text-slate-100 font-semibold font-roboto">
                        {title}
                    </h1>
                    <button
                        onClick={() => closeModal()}
                        ref={btnRef}
                        type="button"
                        className="text-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex flex-col items-center px-5 py-2">
                    {children}
                </div>
            </div>
        </div>
    )
}

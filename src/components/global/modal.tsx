import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useModal } from "../../store/store";
import { useKeyDown, useOutClick } from "../../hooks/hooks";

interface ModalProps {
    children: ReactNode;
    title: string;
}

export function Modal({ children, title }: ModalProps) {
    const { closeModal } = useModal();

    const modalRef = useOutClick(() => closeModal());
    const btnRef = useKeyDown<HTMLButtonElement>("Escape", (element) =>
        element?.click()
    );

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="w-full max-w-2xl rounded shadow-shape bg-slate-100 flex flex-col"
            >
                <header className="flex items-center justify-between py-3 px-5 bg-fisioblue2 rounded-t">
                    <h1
                        id="modal-title"
                        className="text-slate-100 font-semibold font-roboto"
                    >
                        {title}
                    </h1>
                    <button
                        ref={btnRef}
                        onClick={closeModal}
                        type="button"
                        title="Fechar Janela"
                        className="text-slate-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-fisioblue"
                        aria-label="Fechar modal"
                    >
                        <X size={20} />
                    </button>
                </header>
                <div className="px-5 py-4 flex flex-col items-center gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

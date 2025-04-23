import type { ComponentProps, ReactNode } from "react";

interface NavButtonProps extends ComponentProps<"button"> {
    children: ReactNode;
}

export function NavButton({ children, ...props }: NavButtonProps) {
    return (
        <button
            {...props}
            className="flex items-center gap-1 px-2 py-1 rounded-3xl text-gray-800 hover:bg-fisioblue hover:text-slate-100 focus:bg-fisioblue focus:text-slate-100 focus:outline-none focus:ring-2 focus:ring-fisioblue2 transition-colors"
        >
            {children}
        </button>
    );
}

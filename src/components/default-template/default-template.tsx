import type { ReactNode } from "react";
import { Header } from "../global/header";
import { Footer } from "../global/footer";
import { Contact } from "../global/contact";

interface DefaultTemplateProps {
    children: ReactNode;
}

export function DefaultTemplate({ children }: DefaultTemplateProps) {
    return (
        <>
            <Contact />
            <Header />
            <main className="max-w-7xl mx-auto my-5">{children}</main>
            <Footer />
        </>
    );
}

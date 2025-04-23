export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-fisioblue text-slate-100 text-xs py-1 absolute bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <span>
                    Copyright {currentYear} © Duofisio • Clínica de Fisioterapia
                </span>
                <span>Desenvolvido por: Rafael Mendonça Vaz</span>
            </div>
        </footer>
    );
}

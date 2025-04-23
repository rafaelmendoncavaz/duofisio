import headerBanner from "../../assets/duofisio-w-banner-transparent.png";
import { Navigation } from "./navigation";

export function Header() {
    return (
        <header className="h-20 flex items-center justify-center shadow-shape">
            <div className="max-w-7xl w-full flex items-center justify-between px-4">
                <div className="h-full">
                    <img
                        src={headerBanner}
                        alt="Clínica Duofisio"
                        className="h-16 w-auto max-h-full object-contain md:h-20"
                    />
                </div>
                <Navigation />
            </div>
        </header>
    );
}

import headerBanner from "../../assets/duofisio-w-banner-transparent.png"
import { Navigation } from "./navigation"

export function Header() {
    return (
        <header className="h-20 flex items-center justify-center shadow-shape">
            <div className="max-w-7xl max-h-full w-full flex items-center justify-between">
                <div className="flex-1 h-full">
                    <img
                        src={headerBanner}
                        alt="Clínica Duofisio"
                        className=" h-20 w-64"
                    />
                </div>
                <Navigation />
            </div>
        </header>
    )
}

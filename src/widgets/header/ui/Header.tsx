import { Searchbar } from "@/shared/ui/search";
import { useAllPizzerias } from "@/features/load-all-pizzerias/model/useAllPizzerias";

export function Header() {
    const { data } = useAllPizzerias();
    const pizzerias = Array.isArray(data) ? data : [];

    return (
        <header className="w-full max-w-6xl bg-zinc-900 mt-2 py-4 px-6 sticky top-2 z-40 rounded-full">
            <div className="flex items-center gap-4 w-full">
                {/* Logo */}
                <div className="shrink-0">
                    <img
                        src="https://brandbook.dodopizza.info/images/EN-Dodo-Pizza-Logotype-White-letters.svg"
                        alt="Dodo Pizza"
                        className="w-28 h-12 object-contain"
                    />
                </div>

                {/* Searchbar container */}
                <div className="flex-1 relative">
                    <Searchbar items={pizzerias} />
                </div>
            </div>
        </header>
    );
}

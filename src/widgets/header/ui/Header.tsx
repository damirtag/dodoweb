"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Searchbar } from "@/shared/ui/search";
import { useAllPizzerias } from "@/features/load-all-pizzerias/model/useAllPizzerias";
import { PopupAbout } from "@/features/about-popup";

export function Header() {
    const [showPopup, setShowPopup] = useState(false);
    const { data } = useAllPizzerias();
    const pizzerias = Array.isArray(data) ? data : [];

    return (
        <header className="w-full max-w-6xl mx-auto bg-zinc-900 py-4 px-6 sticky top-2 z-40 rounded-full">
            <div className="flex items-center justify-center gap-4 w-full">
                <div className="shrink-0">
                    <Link to="/" className="inline-block">
                        <h4 className="font-bold text-xl text-orange-500">dodoweb</h4>
                    </Link>
                </div>

                <div className="flex-1 relative">
                    <Searchbar items={pizzerias} />
                </div>

                <button
                    onClick={() => setShowPopup(true)}
                    className="text-orange-500 hover:text-orange-400 transition-colors text-sm"
                    aria-label="О проекте"
                >
                    Что это?
                </button>
            </div>

            <PopupAbout open={showPopup} onClose={() => setShowPopup(false)} />
        </header>
    );
}

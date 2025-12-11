"use client";

import { Header } from "@/widgets/header";
import { PizzeriaMapWidget } from "@/widgets/map";
import { Footer } from "@/widgets/footer/ui/Footer";
import { CountryRevenueWidget } from "@/features/country-revenue";
import { type Pizzeria } from "@/entities/pizzeria";
import { useAllPizzerias } from "@/features/load-all-pizzerias/model/useAllPizzerias";

export default function HomePage() {
    const { data: pizzerias = [] } = useAllPizzerias();

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center space-y-4">
            {/* Header */}
            <Header />

            {/* Map */}
            <main className="w-full flex-1 flex justify-center">
                <div className="w-full max-w-6xl h-[70vh] rounded-2xl overflow-hidden border border-gray-800">
                    <PizzeriaMapWidget pizzerias={pizzerias as Pizzeria[]} />
                </div>
            </main>

            {/* Revenue Widget */}
            <CountryRevenueWidget />

            <Footer />
        </div>
    );
}

"use client";

import { useState } from "react";
import { FaCoins, FaCalendar, FaBuilding, FaChartLine, FaChevronDown } from "react-icons/fa6";
import { useCountryRevenue, useCountryRevenueByCode } from "@/entities/revenue/query";
import { getCountryName } from "@/shared/lib/format";

export function CountryRevenueWidget() {
    const { data, isLoading, isError } = useCountryRevenue();
    const [openCountryCode, setOpenCountryCode] = useState<string | null>(null);
    const { data: countryDetails, isLoading: isCountryLoading } = useCountryRevenueByCode(openCountryCode || "");

    if (isLoading) {
        return <div className="text-gray-400 text-center py-6">Загрузка...</div>;
    }

    if (isError || !data) {
        return <div className="text-red-500 text-center py-6">Ошибка загрузки данных</div>;
    }

    return (
        <div className="w-full max-w-6xl px-4">
            <h1 className="text-white text-xl font-bold mb-6">Распределение доходов по странам</h1>

            <div className="space-y-4">
                {data.countries.map((country) => {
                    const isOpen = openCountryCode === country.countryCode;

                    return (
                        <div key={country.countryId} className="bg-zinc-900 rounded-xl shadow-md overflow-hidden transition-all">
                            <button
                                className="w-full flex items-center justify-between gap-4 p-4 hover:bg-gray-800 transition-colors"
                                onClick={() => setOpenCountryCode(isOpen ? null : country.countryCode)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl text-orange-500 font-bold font-mono">
                                        {country.countryCode.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="text-white font-semibold text-lg truncate">
                                            {getCountryName(country.countryCode)}
                                        </div>
                                        <div className="text-gray-400 text-sm truncate">
                                            {country.currency} — {country.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <FaChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                                />
                            </button>

                            {/* Раскрытая информация */}
                            <div className={`transition-max-height duration-300 overflow-hidden ${isOpen ? "max-h-[500px]" : "max-h-0"}`}>
                                {isOpen && (
                                    <div className="p-4 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {isCountryLoading || !countryDetails ? (
                                            <div className="text-gray-400 text-center py-4 col-span-full">Загрузка деталей страны...</div>
                                        ) : (
                                            <>
                                                <MetricCard
                                                    icon={<FaCoins className="text-orange-500 w-6 h-6" />}
                                                    label="Сегодня"
                                                    value={`${countryDetails.response.today_progressive_total.toLocaleString()} ${
                                                        countryDetails.response.currency
                                                    }`}
                                                />
                                                <MetricCard
                                                    icon={<FaCalendar className="text-orange-500 w-6 h-6" />}
                                                    label="Текущий месяц"
                                                    value={`${countryDetails.response.current_month_progressive_total.toLocaleString()} ${
                                                        countryDetails.response.currency
                                                    }`}
                                                />
                                                <MetricCard
                                                    icon={<FaChartLine className="text-orange-500 w-6 h-6" />}
                                                    label="Текущий год"
                                                    value={`${countryDetails.response.current_year_progressive_total.toLocaleString()} ${
                                                        countryDetails.response.currency
                                                    }`}
                                                />
                                                <MetricCard
                                                    icon={<FaCalendar className="text-orange-500 w-6 h-6" />}
                                                    label={`Прошлый месяц (${countryDetails.response.previous_month.name})`}
                                                    value={`${countryDetails.response.previous_month.revenue.toLocaleString()} ${
                                                        countryDetails.response.currency
                                                    }`}
                                                />
                                                <MetricCard
                                                    icon={<FaCalendar className="text-orange-500 w-6 h-6" />}
                                                    label={`Этот месяц год назад (${countryDetails.response.year_ago.name})`}
                                                    value={`${countryDetails.response.year_ago.revenue.toLocaleString()} ${
                                                        countryDetails.response.currency
                                                    }`}
                                                />
                                                <MetricCard
                                                    icon={<FaBuilding className="text-orange-500 w-6 h-6" />}
                                                    label="Работающих пиццерий"
                                                    value={`${countryDetails.response.working_pizzerias}`}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-4  rounded-lg">
            {icon}
            <div>
                <div className="text-gray-400 text-sm">{label}</div>
                <div className="text-white font-semibold">{value}</div>
            </div>
        </div>
    );
}

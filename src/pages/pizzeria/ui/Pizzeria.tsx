"use client";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { PizzeriaMapWidget } from "@/widgets/map";
import { usePizzeriaFullInfo } from "@/entities/pizzeria";
import { usePizzeriaRevenue, usePizzeriaRevenueDaily } from "@/entities/revenue";
import { formatWeeklySchedule, formatCurrencyValue } from "@/entities/pizzeria/utils";
import { Calendar, Users, TrendingUp, Clock, MapPin } from "lucide-react";
import countryToCurrency from "country-to-currency";

type RevenuePeriod = "today" | "yesterday" | "monthes/last";

const PizzeriaPage = () => {
    const { countryCode, unitId, pizzeriaId } = useParams<{
        countryCode: string;
        unitId: string;
        pizzeriaId: string;
    }>();

    const [selectedPeriod, setSelectedPeriod] = useState<RevenuePeriod>("today");
    const [customDate, setCustomDate] = useState<{ year: number; month: number; day: number } | null>(null);

    const pizzId = parseInt(pizzeriaId || "0");
    const countryId = unitId || "";
    const currency = countryCode ? countryToCurrency[countryCode.toUpperCase() as keyof typeof countryToCurrency] : "RUB";

    // Fetch pizzeria details and employees
    const { details, employees, isLoading: isLoadingInfo } = usePizzeriaFullInfo(pizzId, countryCode || "");

    // Fetch revenue based on period or custom date
    const { data: revenueData, isLoading: isLoadingRevenue } = usePizzeriaRevenue(pizzId, countryId, customDate ? "today" : selectedPeriod);
    const { data: monthlyRevenueData } = usePizzeriaRevenue(pizzId, countryId, "monthes/last");

    const monthlyRevenue = monthlyRevenueData?.countries[0]?.monthes?.[0];

    const { data: customDateRevenue, isLoading: isLoadingCustomRevenue } = usePizzeriaRevenueDaily(
        pizzId,
        countryId,
        customDate?.year || 0,
        customDate?.month || 0,
        customDate?.day || 0
    );

    const handlePeriodChange = (period: RevenuePeriod) => {
        setSelectedPeriod(period);
        setCustomDate(null);
    };

    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        setCustomDate({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
        });
        setSelectedPeriod("today");
    };

    // Get revenue to display
    const isDailyRevenue = !!(customDate && customDateRevenue);
    const revenueToDisplay = isDailyRevenue
        ? customDateRevenue!.countries[0].metrics[0] // DailyMetric
        : revenueData?.countries[0]; // PizzeriaRevenue

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("ru-RU").format(value);
    };

    const formatSchedule = details ? formatWeeklySchedule(details.RestaurantWeekWorkingTime) : [];

    if (isLoadingInfo) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <Header />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-orange-500 text-xl">Загрузка...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!details) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <Header />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-red-500 text-xl">Пиццерия не найдена</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-zinc-950">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{details.Name}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-zinc-400">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{details.AddressText}</span>
                        </div>
                        {details.BeginDateWork && (
                            <div className="mt-1 sm:mt-0">
                                <span
                                    title="Дата начала работы пиццерии"
                                    className="cursor-help underline decoration-dotted underline-offset-2"
                                >
                                    {new Date(details.BeginDateWork).toLocaleDateString("ru-RU")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left: Map */}
                    <div className="bg-zinc-900 w-full max-h-full rounded-lg p-4 border border-zinc-800">
                        <PizzeriaMapWidget
                            pizzerias={[
                                {
                                    id: details.Id,
                                    name: details.Name,
                                    uuid: details.UUId,
                                    alias: details.Alias,
                                    startDate: details.BeginDateWork,
                                    timeZoneShift: details.TimeZoneShift,
                                    webcamUrl: details.WebCameraUrl,
                                    coords: {
                                        lat: details.Location.Latitude,
                                        long: details.Location.Longitude,
                                    },
                                    address: {
                                        text: details.AddressText,
                                        locality: {
                                            id: details.AddressDetails.LocalityId,
                                            name: details.AddressDetails.LocalityName,
                                        },
                                        street: {
                                            id: details.AddressDetails.StreetId,
                                            name: details.AddressDetails.StreetName,
                                            type: details.AddressDetails.StreetType,
                                            typeName: details.AddressDetails.StreetTypeName,
                                            typeAbbr: details.AddressDetails.StreetTypeDecrease,
                                        },
                                        house: {
                                            number: details.AddressDetails.HouseNumber,
                                        },
                                    },
                                    stationary: null,
                                    delivery: null,
                                    countryId: details.CountryId,
                                    countryCode: countryCode,
                                },
                            ]}
                            className="h-[400px]"
                        />
                    </div>

                    {/* Right: Revenue and Info */}
                    <div className="space-y-6">
                        {/* Revenue Period Selector */}
                        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                Выручка
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <button
                                    onClick={() => handlePeriodChange("today")}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        selectedPeriod === "today" && !customDate
                                            ? "bg-orange-500 text-white"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    }`}
                                >
                                    Сегодня
                                </button>
                                <button
                                    onClick={() => handlePeriodChange("yesterday")}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        selectedPeriod === "yesterday" && !customDate
                                            ? "bg-orange-500 text-white"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    }`}
                                >
                                    Вчера
                                </button>
                                <input
                                    type="date"
                                    onChange={handleDateSelect}
                                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-orange-500 focus:outline-none"
                                />
                            </div>

                            {isLoadingRevenue || isLoadingCustomRevenue ? (
                                <div className="text-zinc-400">Загрузка данных...</div>
                            ) : revenueToDisplay ? (
                                <div className="space-y-3">
                                    {/* Monthly Revenue */}
                                    {monthlyRevenue && (
                                        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 mt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-400 font-medium">Выручка за текущий месяц</span>
                                                <span className="text-2xl font-bold text-orange-500">
                                                    {formatCurrency(monthlyRevenue.revenue)} {currency}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Daily or regular revenue */}
                                    {!isDailyRevenue ? (
                                        <>
                                            <div className="bg-zinc-800 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-zinc-400">Общая выручка</span>
                                                    <span className="text-2xl font-bold text-orange-500">
                                                        {formatCurrency((revenueToDisplay as any).revenue)} {currency}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-zinc-800 rounded-lg p-4">
                                                    <div className="text-zinc-400 text-sm mb-1">Зал</div>
                                                    <div className="text-xl font-semibold text-white">
                                                        {formatCurrency((revenueToDisplay as any).stationaryRevenue)} {currency}
                                                    </div>
                                                    <div className="text-zinc-500 text-sm mt-1">
                                                        {(revenueToDisplay as any).stationaryOrderCount} заказов
                                                    </div>
                                                </div>

                                                <div className="bg-zinc-800 rounded-lg p-4">
                                                    <div className="text-zinc-400 text-sm mb-1">Доставка</div>
                                                    <div className="text-xl font-semibold text-white">
                                                        {formatCurrency((revenueToDisplay as any).deliveryRevenue)} {currency}
                                                    </div>
                                                    <div className="text-zinc-500 text-sm mt-1">
                                                        {(revenueToDisplay as any).deliveryOrderCount} заказов
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-zinc-800 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-zinc-400">Средний чек</span>
                                                    <span className="text-xl font-semibold text-white">
                                                        ~{formatCurrencyValue((revenueToDisplay as any).avgCheck, currency)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-zinc-800 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-zinc-400">Всего заказов</span>
                                                    <span className="text-xl font-semibold text-white">
                                                        {(revenueToDisplay as any).orderCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-zinc-800 rounded-lg p-4">
                                                <div className="text-zinc-400 text-sm mb-1">Зал</div>
                                                <div className="text-xl font-semibold text-white">
                                                    {formatCurrency((revenueToDisplay as any).stationaryRevenue)} {currency}
                                                </div>
                                                <div className="text-zinc-500 text-sm mt-1">
                                                    {(revenueToDisplay as any).stationaryCount} заказов
                                                </div>
                                            </div>

                                            <div className="bg-zinc-800 rounded-lg p-4">
                                                <div className="text-zinc-400 text-sm mb-1">Доставка</div>
                                                <div className="text-xl font-semibold text-white">
                                                    {formatCurrency((revenueToDisplay as any).deliveryRevenue)} {currency}
                                                </div>
                                                <div className="text-zinc-500 text-sm mt-1">
                                                    {(revenueToDisplay as any).deliveryCount} заказов
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-zinc-400">Нет данных о выручке</div>
                            )}
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                    <span className="text-zinc-400 text-sm">Площадь</span>
                                </div>
                                <div className="text-2xl font-bold text-white">{details.Square} м²</div>
                            </div>

                            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-5 h-5 text-orange-500" />
                                    <span className="text-zinc-400 text-sm">Сотрудников</span>
                                </div>
                                <div className="text-2xl font-bold text-white">{details.EmployeeCount}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule and Employees */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Schedule */}
                    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            График работы
                        </h2>
                        <div className="space-y-2">
                            {formatSchedule.map((item) => (
                                <div key={item.dayIndex} className="flex justify-between py-2 border-b border-zinc-800">
                                    <span className="text-zinc-400">{item.day}</span>
                                    <span className="text-white">{item.readable}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employees on Shift */}
                    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-orange-500" />
                            Сотрудники на смене ({employees.length})
                        </h2>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {employees.length > 0 ? (
                                employees.map((emp) => (
                                    <div key={emp.Id} className="flex justify-between items-center py-3 px-4 bg-zinc-800 rounded-lg">
                                        <div>
                                            <div className="text-white font-medium">{emp.FirstName}</div>
                                            <div className="text-zinc-400 text-sm">{emp.ActualCategoryName}</div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                emp.Status === "Active" ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"
                                            }`}
                                        >
                                            {emp.Status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-zinc-400 text-center py-4">Нет данных о сотрудниках</div>
                            )}
                        </div>
                    </div>
                </div>

                {details.WebCameraUrl && (
                    <div className="bg-zinc-900 min-h-[360px] rounded-lg p-6 border border-zinc-800">
                        <h2 className="text-xl font-semibold text-white mb-4 text-center">Веб-камера</h2>
                        <div className="flex justify-center">
                            <iframe
                                src="https://open.ivideon.com/embed/v3/?server=100-UO3SsR22p3aUGsFJkO0bMG&camera=0&width=&height=&lang=ru"
                                width={640}
                                height={360}
                                allow="autoplay; fullscreen; clipboard-write; picture-in-picture"
                                className="rounded-lg w-full max-w-[642px] h-[360px]"
                            />
                        </div>
                        <div className="text-center text-[10px] mt-2 opacity-60">
                            <a href="https://www.ivideon.com/" target="_blank" rel="noopener noreferrer">
                                Powered by Ivideon
                            </a>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default PizzeriaPage;

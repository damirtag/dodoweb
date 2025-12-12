import type { WorkingTime } from "./model/pizzeria";

const toTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
    return `${h}:${m}`;
};

export const formatWeeklySchedule = (week: WorkingTime[]) => {
    return week.map((day) => {
        const is24 = day.WorkingTimeStart === 0 && day.WorkingTimeEnd === 0;

        const readable = is24 ? "Круглосуточно" : `${toTime(day.WorkingTimeStart)} — ${toTime(day.WorkingTimeEnd)}`;

        return {
            day: day.DayAlias,
            dayIndex: day.DayIndex,
            readable,
        };
    });
};

export function formatCurrencyValue(value: number, currency: string) {
    // Округляем в большую сторону
    const rounded = Math.ceil(value);

    // Форматируем с разделителем тысяч
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency,
        minimumFractionDigits: 0, // без копеек
        maximumFractionDigits: 0,
    }).format(rounded);
}

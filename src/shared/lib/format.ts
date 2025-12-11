import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";

countries.registerLocale(ruLocale);

export function getCountryName(code: string) {
    return countries.getName(code.toUpperCase(), "ru") ?? code;
}

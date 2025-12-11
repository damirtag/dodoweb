export interface Country {
    label: string;
    value: string;
}

export interface Item {
    label: string;
    value: string;
    country?: string;
}

export interface SearchbarProps {
    countries: Country[];
    items: Item[];
    onSelect?: (value: string) => void;
    onCountrySelect?: (country: string) => void;
}

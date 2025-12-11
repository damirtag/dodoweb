export interface CountryResponse {
    countries: Country[];
}

export interface Country {
    countryId: number;
    countryCode: string;
    countryName: string;
    pizzerias: Pizzeria[];
}

export interface Pizzeria {
    id: number;
    name: string;
    uuid: string;
    alias: string;
    startDate: string;
    timeZoneShift: number;
    webcamUrl: string;
    coords: Coords;
    address: Address;
    stationary: WorkTime | null;
    delivery: WorkTime | null;
    countryId?: number;
}

export interface Coords {
    lat: number;
    long: number;
}

export interface Address {
    text: string;
    locality: Locality;
    street: Street;
    house: House;
}

export interface Locality {
    id: number;
    name: string;
}

export interface Street {
    id: number;
    name: string;
    type: string;
    typeName: string;
    typeAbbr: string;
}

export interface House {
    number: string;
}

export interface WorkTime {
    workTime: string | null;
}

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
    countryCode?: string;
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

// pizzeria details schema //
export interface PizzeriaDeatails {
    Id: number;
    DepartmentId: number;
    DepartmentUUId: string;
    DepartmentState: number;
    OrganizationName: string;
    UUId: string;
    Name: string;
    Alias: string;
    TranslitAlias: string;
    Approve: boolean;
    Address: string;
    AddressText: string;
    Square: number;
    Orientation: string;
    State: number;
    Type: number;
    FormatName: string;
    MetroStations: string[];
    AddressDetails: AddressDetails;
    DeliveryEnabled: boolean;
    StationaryEnabled: boolean;
    IsExpress: boolean;
    WebCameraUrl: string;
    RestaurantWeekWorkingTime: WorkingTime[];
    DeliveryWeekWorkingTime: WorkingTime[];
    IsAroundClockRestaurantWorkTime: boolean;
    IsAroundClockDeliveryWorkTime: boolean;
    BeginDateWork: string; // ISO date
    CardPaymentPickup: unknown | null;
    ClientTreatment: string;
    TerminalAtCourier: boolean;
    MinDeliveryOrderPrice: number;
    ManagerPhoneNumber: string;
    OrderTypes: string[];
    Location: Coordinates;
    OrganizationId: number;
    OrganizationUUId: string;
    CountryId: number;
    EmployeeCount: number;
    TimeZoneShift: number;
    CurrentDateTime: string; // ISO datetime
    MenuSpecializationType: number;
    StoreManager: unknown | null;
    IsTemporarilyClosed: boolean;
}

export interface AddressDetails {
    LocalityId: number;
    LocalityName: string;
    StreetId: number;
    StreetName: string;
    StreetType: string;
    StreetTypeName: string;
    StreetTypeDecrease: string;
    HouseNumber: string;
    StreetTypeId: number;
    Comment: string;
}

export interface WorkingTime {
    DayIndex: number; // 0 = Monday, ...
    DayAlias: string; // "Monday", "Tuesday", …
    WorkingTimeStart: number; // seconds from midnight, e.g. 32400
    WorkingTimeEnd: number; // seconds from midnight
}

export interface Coordinates {
    Latitude: number;
    Longitude: number;
}

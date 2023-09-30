
export type NotThere    = null | undefined | '';
export type Optional<T> = T | NotThere;

export type DatabaseDialect = 'postgres' | 'mysql' | 'sqlite';
export type BloodGroup    = 'A+'| 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' |'O-' | 'AB-' | null;
export type RaceType    = 'American Indian/Alaskan Native' | 'Black/African American' | 'Native Hawaiian or Other Pacific Islander' | 'White' | null;
export type EthnicityType    = 'Hispanic/Latino'| 'Not Hispanic/Latino' | 'Prefer not to say' | null;
export type MaritalStatus = 'Single'| 'Married' | 'Divorced'  | 'Widowed' | null;

export type uuid    = string | undefined | null;
export type decimal = number | undefined | null;
export type integer = number | undefined | null;

export const BloodGroupList: BloodGroup[] = [
    'A+',
    'B+',
    'O+',
    'AB+',
    'A-',
    'B-',
    'O-',
    'AB-'
];

export const RaceTypeList: RaceType[] = [
    'American Indian/Alaskan Native',
    'Black/African American',
    'Native Hawaiian or Other Pacific Islander',
    'White'
];

export const EthnicityTypeList: EthnicityType[] = [
    'Hispanic/Latino',
    'Not Hispanic/Latino',
    'Prefer not to say'
];

export enum Gender {
    Male                 = 'Male',
    Female               = 'Female',
    Intersex             = 'Intersex',
    Other                = 'Other',
    Unknown              = 'Unknown'
}

export const Genders = Object.keys(Gender);

export const GenderList: Gender[] = [
    Gender.Male,
    Gender.Female,
    Gender.Intersex,
    Gender.Other,
    Gender.Unknown,
];

export const MaritalStatusList: MaritalStatus[] = [
    'Single',
    'Married',
    'Divorced',
    'Widowed',
];

export enum Severity {
    Low      = 'Low',
    Medium   = 'Medium',
    High     = 'High',
    Critical = 'Critical',
    Unknown  = 'Unknown',
}

export const SeverityList: Severity[] = [
    Severity.Low,
    Severity.Medium,
    Severity.High,
    Severity.Critical,
    Severity.Unknown
];

export enum ProgressStatus {
    Pending    = 'Pending',
    InProgress = 'In-progress',
    Completed  = 'Completed',
    Cancelled  = 'Cancelled',
    Delayed    = 'Delayed',
    Unknown    = 'Unknown',
}

export const ProgressStatusList: ProgressStatus[] = [
    ProgressStatus.Pending,
    ProgressStatus.InProgress,
    ProgressStatus.Completed,
    ProgressStatus.Cancelled,
    ProgressStatus.Delayed,
    ProgressStatus.Unknown,
];

export enum OSType {
    Linux   = 'Linux',
    MacOS   = 'MacOS',
    Windows = 'Windows',
}


export type NotThere    = null | undefined | '';
export type Optional<T> = T | NotThere;

export type BloodGroup    = 'A+'| 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' |'O-' | 'AB-' | null;
export type MaritalStatus = 'Single'| 'Married' | 'Widowed' | 'Divorcee' | 'Live-in' | 'Other' | 'Unknown' | 'Unmarried' | null;

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

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
    Unknown = 'Unknown',
}

export const GenderList: Gender[] = [
    Gender.Male,
    Gender.Female,
    Gender.Other,
    Gender.Unknown,
];

export const MaritalStatusList: MaritalStatus[] = [
    'Single',
    'Married',
    'Widowed',
    'Divorcee',
    'Live-in',
    'Other',
    'Unmarried',
    'Unknown'
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

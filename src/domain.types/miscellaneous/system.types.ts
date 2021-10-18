
export type NotThere    = null | 'undefined' | '';
export type Optional<T> = T | NotThere;

export type Gender        = 'Male'| 'male' | 'Female' | 'female' | 'Other' | 'other' |'Unknown' | 'unknown' | null;
export type BloodGroup    = 'A+'| 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' |'O-' | 'AB-' | null;
export type MaritalStatus = 'Single'| 'Married' | 'Widowed' | 'Divorcee' | 'Live-in' | 'Other' | 'Unknown' | null;

export type uuid = string;

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

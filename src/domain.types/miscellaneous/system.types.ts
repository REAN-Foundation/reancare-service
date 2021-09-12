
export type NotThere = null | 'undefined' | '';
export type Optional<T> = T | NotThere;

export type Gender = 'Male'| 'male' | 'Female' | 'female' | 'Other' | 'other' |'Unknown' | 'unknown' | null;
export type BloodGroup = 'A+'| 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' |'O-' | 'AB-' | null;
export type MaritalStatus = 'Single'| 'Married' | 'Widowed' | 'Divorcee' | 'Live-in' | 'Other' | 'Unknown' | null;

//Generic severities
export type Severity = 'Low'| 'Medium' | 'High' | 'Critical' | null;

//Visit/Encounter types
export enum VisitTypes {
    DoctorVisit = 'Doctor visit',
    LabVisit = 'Lab visit',
    TeleVisit = 'Tele visit',
    Unknown = 'Unknown'
}

export enum OrderTypes {
    DrugOrder = 'Drug order',
    DiagnosticPathologyLabOrder = 'Diagnostic pathology lab order',
    DiagnosticImagingStudyOrder = 'Diagnostic imaging study order',
    MiscellaneousOrder = 'Miscellaneous order',
    Unknown = 'Unknown'
}

export enum OrderStates {
    Initiated = 'Initiated',
    Confirmed = 'Confirmed',
    InProgress = 'In-progress',
    RaisedQuery = 'Raised query',
    Cancelled = 'Cancelled',
    Completed = 'Completed',
    Unknown = 'Unknown'
}

export enum VisitStates {
    Started = 'Started',
    InProgress = 'In-progress',
    Cancelled = 'Cancelled',
    Completed = 'Completed',
    Unknown = 'Unknown'
}

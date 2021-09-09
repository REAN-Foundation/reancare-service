
export type NotThere = null | 'undefined' | '';
export type Optional<T> = T | NotThere;

export type Gender = 'Male'| 'male' | 'Female' | 'female' | 'Other' | 'other' |'Unknown' | 'unknown' | null;
export type BloodGroup = 'A+'| 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' |'O-' | 'AB-' | null;
export type MaritalStatus = 'Single'| 'Married' | 'Widowed' | 'Divorcee' | 'Live-in' | 'Other' | 'Unknown' | null;
export type Severity = 'Low'| 'Medium' | 'High' | 'Critical' | null;

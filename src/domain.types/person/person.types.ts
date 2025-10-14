export enum PersonIdentificationType {
    Aadhar = 'Aadhar',
    PassportNumber = 'PassportNumber',
    SocialSecurityNumber = "SocialSecurityNumber"
}

export interface GenderDetails {
    Gender: string,
    Count: number,
    Ratio: string
}

export enum CountryCode {
    India = '+91',
    UnitedStates = '+1'
}

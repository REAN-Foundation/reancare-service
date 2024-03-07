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

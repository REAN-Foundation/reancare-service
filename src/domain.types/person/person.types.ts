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

export const COUNTRY_CODE_INDIA = '+91';
export const COUNTRY_CODE_UNITEDSTATES = '+1';
export const COUNTRY_CODE_KENYA = '+254';
export const COUNTRY_CODE_UGANDA = '+256';
export const COUNTRY_CODE_TANZANIA = '+255';
export const COUNTRY_CODE_RWANDA = '+250';
export const COUNTRY_CODE_BURUNDI = '+257';
export const COUNTRY_CODE_CONGO = '+243';
export const COUNTRY_CODE_MALAWI = '+265';
export const COUNTRY_CODE_NIGERIA = '+234';
export const COUNTRY_CODE_GHANA = '+233';
export const COUNTRY_CODE_NIGER = '+227';
export const COUNTRY_CODE_TOGO = '+228';
export const COUNTRY_CODE_BENIN = '+229';
export const COUNTRY_CODE_MOROCCO = '+212';
export const COUNTRY_CODE_ALGERIA = '+213';
export const COUNTRY_CODE_MOZAMBIQUE = '+258';

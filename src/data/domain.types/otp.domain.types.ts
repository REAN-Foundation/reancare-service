
export interface OtpDTO {
    id: string;
    UserId: string;
    Purpose: string;
    Otp: string;
    ValidFrom: Date;
    ValidTo: Date;
    Utilized: boolean;
}

export interface OtpPersistenceEntity {
    UserId: string;
    Purpose: string;
    Otp: string;
    ValidFrom: Date;
    ValidTo: Date;
}

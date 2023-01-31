
export interface OtpPersistenceEntity {
    UserId: string;
    Purpose: string;
    Otp: string;
    ValidFrom: Date;
    ValidTill: Date;
}

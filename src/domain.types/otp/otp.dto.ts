
export interface OtpDto {
    id: string;
    UserId: string;
    Purpose: string;
    Otp: string;
    ValidFrom: Date;
    ValidTill: Date;
    Utilized: boolean;
}

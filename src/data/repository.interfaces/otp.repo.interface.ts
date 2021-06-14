import { OtpDTO, OtpPersistenceEntity } from '../domain.types/otp.domain.types';

export interface IOtpRepo {

    create(entity: OtpPersistenceEntity): Promise<OtpDTO>;

    getLatestByUserId(userId: string): Promise<OtpDTO>;

    getByOtpAndUserId(userId: string, otp: string): Promise<OtpDTO>;

    markAsUtilized(id: string): Promise<OtpDTO>;
}

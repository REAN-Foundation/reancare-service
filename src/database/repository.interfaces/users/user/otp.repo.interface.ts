import { OtpDto } from '../../../../domain.types/users/otp/otp.dto';
import { OtpPersistenceEntity } from '../../../../domain.types/users/otp/otp.domain.types';

export interface IOtpRepo {

    create(entity: OtpPersistenceEntity): Promise<OtpDto>;

    getLatestByUserId(userId: string): Promise<OtpDto>;

    getByOtpAndUserId(userId: string, otp: string): Promise<OtpDto>;

    markAsUtilized(id: string): Promise<OtpDto>;
}

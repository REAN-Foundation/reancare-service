import { OtpDto } from "../../../../../../domain.types/users/otp/otp.dto";
import Otp from "../../../models/users/user/otp.model";

///////////////////////////////////////////////////////////////////////////////////

export class OtpMapper {

    static toDto = (otp: Otp): OtpDto => {
        if (otp == null) {
            return null;
        }
        const dto: OtpDto = {
            id        : otp.id,
            UserId    : otp.UserId,
            Purpose   : otp.Purpose,
            Otp       : otp.Otp,
            ValidFrom : otp.ValidFrom,
            ValidTill : otp.ValidTill,
            Utilized  : otp.Utilized,
        };
        return dto;
    };

}

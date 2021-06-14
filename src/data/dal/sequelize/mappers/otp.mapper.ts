import { OtpDTO } from "../../../domain.types/otp.domain.types";
import { Otp } from "../models/otp.model";


///////////////////////////////////////////////////////////////////////////////////

export class OtpMapper {

    static toDTO = (otp: Otp): OtpDTO => {
        if(otp == null){
            return null;
        }
        var dto: OtpDTO = {
            id: otp.id,
            UserId: otp.UserId,
            Purpose: otp.Purpose,
            Otp: otp.Otp,
            ValidFrom: otp.ValidFrom,
            ValidTo: otp.ValidTo,
            Utilized: otp.Utilized,
        };
        return dto;
    }

}


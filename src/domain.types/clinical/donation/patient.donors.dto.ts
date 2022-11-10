import { DonorDetailsDto } from "../../../domain.types/users/donor/donor.dto";
import { uuid } from "../../miscellaneous/system.types";

/////////////////////////////////////////////////////////////////////////////

export interface PatientDonorsDto {
    id?                   : uuid;
    Name?                 : string,
    PatientUserId?        : uuid;
    DonorUserId?          : uuid;
    DonorType?            : string,
    Donor?                : DonorDetailsDto;
    BloodGroup?           : string;
    VolunteerUserId?      : uuid,
    AcceptorUserId?       : string;
    NextDonationDate?     : Date;
    LastDonationDate?     : Date;
    QuantityRequired?     : number;
    ElligibleDonorsCount? : number;
    Status?               : string;
    DonorGender?          : string;
    DonorName?            : string;
    DonorPhone?           : string
}

import { DonorDetailsDto } from "../../../domain.types/users/donor/donor.dto";
import { uuid } from "../../miscellaneous/system.types";
import { PatientDonorsDto } from "../donation/patient.donors.dto";

/////////////////////////////////////////////////////////////////////////////

export interface DonationRecordDto {
    id?                : uuid;
    PatientUserId?     : uuid;
    NetworkId?         : uuid;
    DonationDetails?   : PatientDonorsDto;
    RequestedQuantity? : number;
    RequestedDate?     : Date,
    DonationDate?      : Date;
    DonatedQuantity?   : number;
    DonationType?      : string;
}

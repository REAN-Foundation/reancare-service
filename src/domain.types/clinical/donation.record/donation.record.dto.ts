import { uuid } from "../../miscellaneous/system.types";
import { PatientDonorsDto } from "../donation/patient.donors.dto";

/////////////////////////////////////////////////////////////////////////////

export interface DonationRecordDto {
    id?                : uuid;
    PatientUserId?     : uuid;
    NetworkId?         : uuid;
    EmergencyDonor?    : uuid;
    VolunteerOfEmergencyDonor? : uuid;
    DonationDetails?   : PatientDonorsDto;
    RequestedQuantity? : number;
    RequestedDate?     : Date,
    DonorAcceptedDate? : Date,
    DonorRejectedDate? : Date,
    DonationDate?      : Date;
    DonatedQuantity?   : number;
    DonationType?      : string;
}

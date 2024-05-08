import { uuid } from "../../../miscellaneous/system.types";
import { BridgeDto } from "../bridge/bridge.dto";

/////////////////////////////////////////////////////////////////////////////

export interface DonationDto {
    id?                       : uuid;
    PatientUserId?            : uuid;
    TenantId?                 : uuid;
    NetworkId?                : uuid;
    EmergencyDonor?           : uuid;
    VolunteerOfEmergencyDonor?: uuid;
    DonationDetails?          : BridgeDto;
    RequestedQuantity?        : number;
    RequestedDate?            : Date,
    DonorAcceptedDate?        : Date,
    DonorRejectedDate?        : Date,
    DonationDate?             : Date;
    DonatedQuantity?          : number;
    DonationType?             : string;
}

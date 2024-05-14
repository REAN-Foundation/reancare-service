import { uuid } from '../../../miscellaneous/system.types';
import { DonorType } from '../../../miscellaneous/clinical.types';
import { BridgeStatus } from '../../../miscellaneous/clinical.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface BridgeDomainModel {
    id?               : uuid;
    Name?             : string,
    PatientUserId?    : uuid;
    TenantId?         : uuid;
    DonorUserId?      : uuid;
    DonorType?        : DonorType;
    BloodGroup?       : string;
    VolunteerUserId?  : uuid,
    NextDonationDate? : Date;
    LastDonationDate? : Date;
    QuantityRequired? : number;
    Status?           : BridgeStatus;
}

import { uuid } from './../../../domain.types/miscellaneous/system.types';
import { DonorType } from '../../../domain.types/miscellaneous/clinical.types';
import { BridgeStatus } from '../../../domain.types/miscellaneous/clinical.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface PatientDonorsDomainModel {
    id?               : uuid;
    Name?             : string,
    PatientUserId?    : uuid;
    DonorUserId?      : uuid;
    DonorType?        : DonorType;
    BloodGroup?       : string;
    VolunteerUserId?  : uuid,
    NextDonationDate? : Date;
    LastDonationDate? : Date;
    QuantityRequired? : number;
    Status?           : BridgeStatus;
}

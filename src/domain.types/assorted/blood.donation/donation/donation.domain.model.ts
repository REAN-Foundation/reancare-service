import { BridgeDomainModel } from '../bridge/bridge.domain.model';
import { uuid } from './../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface DonationDomainModel {
    id?                       : uuid;
    PatientUserId?            : uuid;
    TenantId?                 : uuid;
    NetworkId?                : uuid;
    EmergencyDonor?           : uuid;
    VolunteerOfEmergencyDonor?: uuid;
    DonationDetails?          : BridgeDomainModel;
    RequestedQuantity?        : number;
    RequestedDate?            : Date,
    DonorAcceptedDate?        : Date,
    DonorRejectedDate?        : Date,
    DonationDate?             : Date;
    DonatedQuantity?          : number;
    DonationType?             : string;
}

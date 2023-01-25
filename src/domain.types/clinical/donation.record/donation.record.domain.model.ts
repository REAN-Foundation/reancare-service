import { uuid } from './../../../domain.types/miscellaneous/system.types';
import { PatientDonorsDomainModel } from '../donation/patient.donors.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface DonationRecordDomainModel {
    id?                : uuid;
    PatientUserId?     : uuid;
    NetworkId?         : uuid;
    EmergencyDonor?    : uuid;
    VolunteerOfEmergencyDonor? : uuid;
    DonationDetails?   : PatientDonorsDomainModel;
    RequestedQuantity? : number;
    RequestedDate?     : Date,
    DonorAcceptedDate? : Date,
    DonorRejectedDate? : Date,
    DonationDate?      : Date;
    DonatedQuantity?   : number;
    DonationType?      : string;
}

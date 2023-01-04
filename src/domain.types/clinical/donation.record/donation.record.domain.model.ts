import { uuid } from './../../../domain.types/miscellaneous/system.types';
import { DonorType } from '../../../domain.types/miscellaneous/clinical.types';
import { BridgeStatus } from '../../../domain.types/miscellaneous/clinical.types';
import { PatientDonorsDomainModel } from '../donation/patient.donors.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface DonationRecordDomainModel {
    id?                : uuid;
    PatientUserId?     : uuid;
    NetworkId?         : uuid;
    DonationDetails?   : PatientDonorsDomainModel;
    RequestedQuantity? : number;
    RequestedDate?     : Date,
    DonationDate?      : Date;
    DonatedQuantity?   : number;
    DonationType?      : string;
}

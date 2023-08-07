import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AddressDomainModel } from '../../../general/address/address.domain.model';
import { UserDomainModel } from '../../user/user.domain.model';
import { HealthProfileDomainModel } from '../health.profile/health.profile.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface PatientDomainModel {
    id?                  : uuid;
    UserId?              : uuid;
    PersonId?            : uuid;
    DisplayId?           : string,
    EhrId?               : string;
    NationalHealthId?    : string;
    MedicalProfileId?    : string;
    HealthSystem?        : string;
    CohortId?            : uuid;
    AssociatedHospital?  : string;
    DonorAcceptance?     : string;
    IsRemindersLoaded?   : boolean;
    User?                : UserDomainModel;
    HealthProfile?       : HealthProfileDomainModel
    InsuranceIds?        : string[];
    EmergencyContactIds? : string[];
    Address?             : AddressDomainModel;
}

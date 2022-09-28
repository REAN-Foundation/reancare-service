import { AddressDomainModel } from '../../../general/address/address.domain.model';
import { UserDomainModel } from '../../user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface PatientDomainModel {
    id?                 : string;
    UserId?             : string;
    PersonId?           : string;
    DisplayId?          : string,
    EhrId?              : string;
    NationalHealthId?   : string;
    MedicalProfileId?   : string;
    User?               : UserDomainModel;
    InsuranceIds?       : string[];
    EmergencyContactIds?: string[];
    Address?            : AddressDomainModel;
}

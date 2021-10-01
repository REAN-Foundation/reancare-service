import { AddressDomainModel } from '../../address/address.domain.model';
import { UserDomainModel } from '../../user/user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface PatientDomainModel {
    id?: string;
    UserId?: string;
    PersonId?: string;
    DisplayId?: string,
    EhrId?: string;
    NationalHealthId?:string;
    MedicalProfileId?: string;
    User?: UserDomainModel;
    InsuranceIds?: string[];
    EmergencyContactIds?: string[];
    AddressIds: string[];
    Addresses?: AddressDomainModel[];
}

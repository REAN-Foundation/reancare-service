import { DonorType } from '../../../miscellaneous/clinical.types';
import { AddressDomainModel } from '../../../general/address/address.domain.model';
import { UserDomainModel } from '../../../users/user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface DonorDomainModel {
    id?               : string;
    UserId?           : string;
    TenantId?         : string;
    PersonId?         : string;
    DisplayId?        : string,
    EhrId?            : string;
    User?             : UserDomainModel;
    BloodGroup?       : string,
    AcceptorUserId?   : string;
    LastDonationDate? : Date;
    DonorType         : DonorType;
    MedIssues?        : string[];
    IsAvailable?      : boolean;
    HasDonatedEarlier? : boolean;
    AddressId?       : string;
    Address?         : AddressDomainModel;
}

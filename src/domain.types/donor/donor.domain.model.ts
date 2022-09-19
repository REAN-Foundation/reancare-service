import { AddressDomainModel } from '../address/address.domain.model';
import { UserDomainModel } from '../user/user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface DonorDomainModel {
    id?               : string;
    UserId?           : string;
    PersonId?         : string;
    DisplayId?        : string,
    EhrId?            : string;
    AcceptorUserId?   : string;
    User?             : UserDomainModel;
    BloodGroup?       : string,
    MedIssues?        : string[];
    IsAvailable?      : boolean;
    HasDonatedEarlier? : boolean;
    AddressId?       : string;
    Address?         : AddressDomainModel;
}

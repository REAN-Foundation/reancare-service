import { AddressDomainModel } from '../../general/address/address.domain.model';
import { UserDomainModel } from '../user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface VolunteerDomainModel {
    id?               : string;
    UserId?           : string;
    PersonId?         : string;
    DisplayId?        : string,
    EhrId?            : string;
    User?             : UserDomainModel;
    BloodGroup?       : string,
    LastDonationDate? : Date;
    MedIssues?        : string[];
    IsAvailable?      : boolean;
    AddressId?        : string;
    Address?          : AddressDomainModel;
    SelectedBloodGroup?  : string;
    SelectedBridgeId?    : string;
    SelectedPhoneNumber?    : string;
    LastDonationRecordId?   : string;
}

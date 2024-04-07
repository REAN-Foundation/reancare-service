import { AddressDomainModel } from '../../../general/address/address.domain.model';
import { UserDomainModel } from '../../../users/user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface VolunteerDomainModel {
    id?                 : string;
    UserId?             : string;
    TenantId?           : string;
    PersonId?           : string;
    DisplayId?          : string,
    EhrId?              : string;
    User?               : UserDomainModel;
    BloodGroup?         : string,
    LastDonationDate?   : Date;
    MedIssues?          : string[];
    IsAvailable?        : boolean;
    AddressId?          : string;
    Address?            : AddressDomainModel;
    SelectedBloodGroup? : string;
    SelectedBridgeId?   : string;
    SelectedPhoneNumber?: string;
    LastDonationId?     : string;
}

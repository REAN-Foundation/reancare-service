import { AddressDto } from "../../general/address/address.dto";
import { Gender } from "../../miscellaneous/system.types";
import { UserDto } from "../user/user.dto";

/////////////////////////////////////////////////////////////////////////////

export interface VolunteerDetailsDto {
    id?                : string;
    UserId?            : string;
    PersonId?          : string;
    DisplayId?         : string;
    EhrId?             : string;
    User               : UserDto;
    BloodGroup?        : string,
    LastDonationDate?  : Date;
    MedIssues?         : string[];
    IsAvailable?       : boolean;
    Address?           : AddressDto[];
    SelectedBloodGroup?  : string;
    SelectedBridgeId?    : string;
    SelectedPhoneNumber?    : string;
    LastDonationRecordId?   : string;
}

export interface VolunteerDto {
    id          : string;
    UserId      : string;
    DisplayId   : string;
    EhrId       : string;
    DisplayName : string;
    UserName    : string,
    Phone       : string;
    Email       : string;
    BloodGroup  : string;
    LastDonationDate  : Date;
    SelectedBloodGroup?  : string;
    SelectedBridgeId?    : string;
    SelectedPhoneNumber?    : string;
    LastDonationRecordId?   : string;
    MedIssues   : string[];
    Gender      : Gender;
    BirthDate   : Date;
    Age         : string;
}

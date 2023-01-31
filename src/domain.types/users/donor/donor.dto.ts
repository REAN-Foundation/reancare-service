import { DonorType } from "../../../domain.types/miscellaneous/clinical.types";
import { AddressDto } from "../../general/address/address.dto";
import { Gender } from "../../miscellaneous/system.types";
import { UserDto } from "../user/user.dto";

/////////////////////////////////////////////////////////////////////////////

export interface DonorDetailsDto {
    id?                : string;
    UserId?            : string;
    PersonId?          : string;
    DisplayId?         : string,
    EhrId?             : string;
    User               : UserDto;
    BloodGroup?        : string,
    AcceptorUserId?    : string;
    LastDonationDate?  : Date;
    DonorType?         : DonorType;
    MedIssues?         : string[];
    IsAvailable?       : boolean;
    HasDonatedEarlier? : boolean;
    Address?           : AddressDto[];
}

export interface DonorDto {
    id          : string;
    UserId      : string;
    DisplayId   : string;
    EhrId       : string;
    DisplayName : string;
    UserName    : string,
    Phone       : string;
    Email       : string;
    BloodGroup  : string;
    AcceptorUserId  : string;
    LastDonationDate  : Date;
    DonorType?        : DonorType;
    MedIssues   : string[];
    Gender      : Gender;
    BirthDate   : Date;
    Age         : string;
}

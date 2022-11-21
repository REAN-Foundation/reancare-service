import { Gender } from "../miscellaneous/system.types";
import { AddressDto } from "../general/address/address.dto";
import { PersonRoleDto } from "../role/person.role.dto";

//////////////////////////////////////////////////////////////////////////////

export interface PersonDetailsDto {
    id                         : string;
    Prefix                     : string;
    FirstName                  : string;
    MiddleName                 : string;
    LastName                   : string;
    DisplayName                : string;
    Phone                      : string;
    Email                      : string;
    TelegramChatId?            : string;
    Gender                     : Gender;
    SelfIdentifiedGender?      : string;
    MaritalStatus?             : string;
    Race?                      : string;
    Ethnicity?                 : string;
    BirthDate                  : Date;
    Age?                       : string;
    StrokeSurvivorOrCaregiver? : string;
    LivingAlone?               : boolean;
    WorkedPriorToStroke?       : boolean;
    ImageResourceId            : string;
    Roles                      : PersonRoleDto[];
    ActiveSince                : Date;
    Addresses                  : AddressDto[];
}

export interface PersonDto {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
    TelegramChatId?: string;
}

import { Gender } from '../miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface PersonDomainModel {
    id?                   : string;
    Prefix?               : string;
    FirstName?            : string;
    MiddleName?           : string;
    LastName?             : string;
    DisplayName?          : string;
    Phone?                : string;
    Email?                : string;
    TelegramChatId?       : string;
    Gender?               : Gender;
    SelfIdentifiedGender? : string;
    MaritalStatus?        : string;
    BirthDate?            : Date;
    Age?                  : string;
    ImageResourceId?      : string;
    AddressIds?           : string[];
}

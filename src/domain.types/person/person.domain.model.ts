import { Gender } from '../miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface PersonDomainModel {
    id?              : string;
    Prefix?          : string;
    FirstName?       : string;
    MiddleName?      : string;
    LastName?        : string;
    DisplayName?     : string;
    Phone?           : string;
    Email?           : string;
    Gender?          : Gender;
    BirthDate?       : Date;
    Age?             : string;
    ImageResourceId? : string;
    AddressIds?      : string[];
}

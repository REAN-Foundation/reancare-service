import { PersonDetailsDto, PersonDto } from "../../person/person.dto";
import { RoleDto } from "../../role/role.dto";
import { uuid } from "../../miscellaneous/system.types";

export interface UserDetailsDto {
    id             : uuid;
    PersonId       : uuid;
    TenantId       : uuid;
    Person         : PersonDetailsDto;
    RoleId         : number;
    Role           : RoleDto;
    UserName       : string;
    IsTestUser     ?: boolean;
    DefaultTimeZone: string;
    CurrentTimeZone: string;
    LastLogin      : Date;
}

export interface UserDto {
    id             : uuid;
    PersonId       : uuid;
    TenantId       : uuid;
    Person         : PersonDto;
    DefaultTimeZone: string;
    CurrentTimeZone: string;
}

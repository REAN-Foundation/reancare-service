import { PersonDetailsDto, PersonDto } from "../../person/person.dto";
import { RoleDto } from "../../role/role.dto";

export interface UserDetailsDto {
    id: string;
    PersonId: string;
    Person: PersonDetailsDto;
    RoleId: number;
    Role: RoleDto;
    UserName: string;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
    LastLogin: Date;
}

export interface UserDto {
    id: string;
    PersonId: string;
    Person: PersonDto;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
}

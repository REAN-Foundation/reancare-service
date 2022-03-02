import { uuid } from "../miscellaneous/system.types";

export interface ThirdpartyApiCredentialsDomainModel {
    Provider     : string;
    BaseUrl      : string;
    SecondaryUrl?: string;
    Token?       : string;
    ValidTill?   : Date;
}

export interface ThirdpartyApiCredentialsDto {
    id           : uuid;
    UserId       : uuid;
    Provider     : string;
    BaseUrl      : string;
    SecondaryUrl?: string;
    Token?       : string;
    ValidTill?   : Date;
}


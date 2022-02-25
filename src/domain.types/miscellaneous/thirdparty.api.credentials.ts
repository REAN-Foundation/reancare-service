import { uuid } from "./system.types";

export interface ThirdpartyApiCredentials {
    Provider  : string;
    BaseUrl   : string;
    Token?    : string;
    ValidTill?: string;
}

export interface ThirdpartyApiCredentialsDto {
    UserId    : uuid;
    Provider  : string;
    BaseUrl   : string;
    Token?    : string;
    ValidTill?: string;
}


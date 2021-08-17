
import { IncomingHttpHeaders } from "http2"
import { CurrentClient } from "./current.client"
import { CurrentUser } from "./current.user"

export interface RequestDto {
    Method: string;
    Host: string;
    Body: any;
    Headers?: IncomingHttpHeaders;
    Url: string;
    Params: any;
}

export interface ResponseDto {
    Status: string;
    Message: string;
    HttpCode: number;
    Data?: any;
    Trace?: string[];
    Client: CurrentClient;
    User: CurrentUser;
    Context: string;
    Request?: RequestDto;
    ClientIps: string[];
    APIVersion: string;
    ServiceVersion: string;
}


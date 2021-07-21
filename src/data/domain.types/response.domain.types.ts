
import { IncomingHttpHeaders } from "http2"
import { CurrentClient } from "./current.client"
import { CurrentUser } from "./current.user"
import express from 'express';

export interface ResponseDto {
    Status: string;
    Message: string;
    HttpErroCode: number;
    Trace: string[];
    Client: CurrentClient;
    User: CurrentUser;
    Context: string;
    RequestMethod: string;
    RequestHost: string;
    RequestBody: any;
    RequestHeaders: IncomingHttpHeaders;
    RequestUrl: string;
    RequestParams: any;
    ClientIps: string[];
    APIVersion: string;
    ServiceVersion: string;
}


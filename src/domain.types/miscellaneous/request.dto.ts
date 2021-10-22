
import { IncomingHttpHeaders } from "http2";

export interface RequestDto {
    Method  : string;
    Host    : string;
    Body    : any;
    Headers?: IncomingHttpHeaders;
    Url     : string;
    Params  : any;
}

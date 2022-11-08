import { uuid } from "../../miscellaneous/system.types";

export interface NoticeDto {
    id?          : uuid;
    Title?       : string;
    Description? : string;
    Link?        : string;
    PostDate?    : Date;
    EndDate?     : Date;
    DaysActive?  : number;
    IsActive?    : boolean;
    Tags?        : string[];
    ImageUrl?    : string;
    Action?      : string;
    UserAction?  : any;
}

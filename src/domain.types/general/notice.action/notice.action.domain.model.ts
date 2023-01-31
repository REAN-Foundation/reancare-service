import { uuid } from "../../miscellaneous/system.types";

export interface NoticeActionDomainModel {
    id?            : uuid;
    UserId?        : uuid;
    NoticeId?      : uuid;
    Action?        : string;
    Contents?      : Contents[];
}

export interface Contents{
    Title?        : string;
    ResourseId?   : string;
}


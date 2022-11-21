import { uuid } from "../../miscellaneous/system.types";

export interface NoticeActionDto {
    id?            : uuid;
    UserId?        : uuid;
    NoticeId?      : uuid;
    Notice?        : any;
    Action?        : string;
    Contents?      : string[];
}

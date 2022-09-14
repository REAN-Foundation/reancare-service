import { uuid } from "../../miscellaneous/system.types";

export interface NoticeActionDto {
    id?            : uuid;
    UserId?        : uuid;
    NoticeId?      : uuid;
    Action?        : string;
    ActionTakenAt? : Date;
    ActionContent? : string;
}

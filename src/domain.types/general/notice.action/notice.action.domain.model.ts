import { uuid } from "../../miscellaneous/system.types";

export interface NoticeActionDomainModel {
    id?            : uuid;
    UserId?        : uuid;
    NoticeId?      : uuid;
    Action?        : string;
    ActionTakenAt? : Date;
    ActionContent? : string;
}

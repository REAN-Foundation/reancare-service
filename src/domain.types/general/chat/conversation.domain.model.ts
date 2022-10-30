import { uuid } from "../../miscellaneous/system.types";

export interface ConversationDomainModel {
    id?                 : uuid;
    IsGroupConversation?: boolean;
    Topic?              : string;
    Marked?             : boolean;
    StartedByUserId?    : uuid;
    Users?              : uuid[],
}

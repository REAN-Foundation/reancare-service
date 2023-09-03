import { uuid } from "../../miscellaneous/system.types";

export interface ChatMessageDomainModel {
    id?            : uuid;
    ConversationId?: uuid;
    SenderId?      : uuid;
    Message?       : uuid;
}

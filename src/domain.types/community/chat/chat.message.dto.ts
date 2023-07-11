import { uuid } from "../../miscellaneous/system.types";

export interface ChatMessageDto {
    id?            : uuid;
    ConversationId?: uuid;
    SenderId?      : uuid;
    Message?       : uuid;
}

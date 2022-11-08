import { uuid } from "../../miscellaneous/system.types";

export interface ConversationDto {
    id?                  : uuid;
    IsGroupConversation? : boolean;
    Topic?               : string;
    Marked?              : boolean;
    InitiatingUserId?    : uuid;
    InitiatingUser?      : any;
    OtherUserId?         : uuid;
    OtherUser?           : any;
    Users?               : uuid[],
    LastMessageTimestamp?: Date;
}

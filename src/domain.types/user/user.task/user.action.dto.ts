import { UserActionStatusTypes } from "./user.action.types";

export interface UserActionDto {
    UserId?       : string;
    ActionItemId? : string;
    ActionType    : string;
    ActionDetails?: string;
    ActionState?  : UserActionStatusTypes;
}

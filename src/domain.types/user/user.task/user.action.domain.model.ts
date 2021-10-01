import { UserActionStatusTypes } from "./user.action.types";

export interface UserActionDomainModel {
    UserId?       : string;
    ActionItemId? : string;
    ActionType    : string;
    ActionDetails?: string;
    ActionState?  : UserActionStatusTypes;
}

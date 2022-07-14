import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface UserLoginSessionDto {
    id         : uuid;
    UserId     : uuid;
    IsActive   : boolean;
    StartedAt? : Date;
    ValidTill? : Date;
}

import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface FollowUpCancellationDto {
    id           : uuid,
    TenantId?    : uuid,
    TenantName? : string;
    CancelDate?   : Date;
    CreatedAt?   : Date;
    UpdatedAt?   :Date;
}

import { uuid } from "../miscellaneous/system.types";

export interface FollowUpCancellationDomainModel {
    id?   : uuid,
    TenantId? : string,
    TenantName? : string;
    CancelDate? : Date;
}

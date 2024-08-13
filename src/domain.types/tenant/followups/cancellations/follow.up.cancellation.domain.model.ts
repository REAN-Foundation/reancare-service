import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface FollowUpCancellationDomainModel {
    id?   : uuid,
    TenantId? : string,
    TenantName? : string;
    CancelDate? : Date;
}

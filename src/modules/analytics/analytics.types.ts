import { uuid } from "../../domain.types/miscellaneous/system.types";

export interface AnalyticsEvent {
    TenantId: uuid;
    UserId: uuid;
    EventName: string;
    EventCategory: string;
    data: any;
}

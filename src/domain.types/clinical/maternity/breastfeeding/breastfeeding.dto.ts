import { BreastfeedingStatus } from "./breastfeeding.status.type";

export interface BreastfeedingDto {
    id?                      : string;
    VisitId?                 : string;
    PostNatalVisitId?        : string;
    BreastFeedingStatus?     : BreastfeedingStatus;
    BreastfeedingFrequency?  : string;
    AdditionalNotes?         : string;
}

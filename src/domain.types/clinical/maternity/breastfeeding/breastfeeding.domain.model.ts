import { BreastfeedingStatus } from "./breastfeeding.status.type";

export interface BreastfeedingDomainModel {
    id?                    : string;
    VisitId                : string;
    PostNatalVisitId       : string;
    BreastFeedingStatus    : BreastfeedingStatus;
    BreastfeedingFrequency : string;
    AdditionalNotes?       : string;
}

import { BaseSearchResults, BaseSearchFilters } from "../../miscellaneous/base.search.types";
import { uuid } from "../../miscellaneous/system.types";
import { VisitDto } from "./visit.dto";

export interface VisitSearchFilters extends BaseSearchFilters{
    VisitType?                 : string;
    EhrId                      : string;
    DisplayId?                 : string;
    PatientUserId              : uuid;
    MedicalPractitionerUserId? : uuid;
    ReferenceVisitId?          : uuid;
    CurrentState?              : string;
    StartDate?                 : Date;
    EndDate?                   : Date;
    FulfilledAtOrganizationId? : uuid;
    AdditionalInformation?     : string;
}

export interface VisitSearchResults extends BaseSearchResults{
    Items: VisitDto[];
}
import { Severity } from "../../../domain.types/miscellaneous/system.types";
import { AllergyDto } from "./allergy.dto";
import { AllergenCategories, AllergenExposureRoutes } from "./allergy.types";

export interface AllergySearchFilters {
    PatientUserId?: string;
    Allergy?: string;
    AllergenCategory?: AllergenCategories;
    AllergenExposureRoute?: AllergenExposureRoutes;
    Severity?: Severity;
    Reaction?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface AllergySearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: AllergyDto[];
}

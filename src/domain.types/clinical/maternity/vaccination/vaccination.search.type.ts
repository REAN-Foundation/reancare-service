import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { VaccinationDto } from "./vaccination.dto";

//////////////////////////////////////////////////////////////////////

export interface VaccinationSearchFilters extends BaseSearchFilters {
    PregnancyId?              : uuid;
    VaccineName?              : string;
    DoseNumber?               : number;
    DateAdministered          : Date;
    MedicationId?             : uuid;
    MedicationConsumptionId?  : uuid;
}

export interface VaccinationSearchResults extends BaseSearchResults {
    Items: VaccinationDto[];
}

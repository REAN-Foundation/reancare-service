import { uuid } from "../../../miscellaneous/system.types";

export interface AntenatalMedicationDomainModel {
    id?               : uuid;
    AnteNatalVisitId? : uuid;
    PregnancyId?      : uuid;
    VisitId?          : uuid;
    Name?             : string;
    Given?            : string;
    MedicationId?     : uuid;
}

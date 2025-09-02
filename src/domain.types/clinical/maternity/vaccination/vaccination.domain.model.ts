export interface VaccinationDomainModel {
    id?                      : string;
    PregnancyId              : string;
    VaccineName              : string;
    DoseNumber               : number;
    DateAdministered         : Date;
    MedicationId?            : string;
    MedicationConsumptionId? : string;
}

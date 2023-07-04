import { decimal, uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface LabRecordDto {
    id?             : string;
    EhrId?          : string;
    PatientUserId   : uuid;
    TypeName ?      : string;
    DisplayName ?   : string;
    TypeId ?        : uuid;
    PrimaryValue?   : decimal;
    SecondaryValue? : decimal;
    Unit?           : string;
    ReportId?       : string;
    OrderId?        : string;
    RecordedAt?     : Date;
}

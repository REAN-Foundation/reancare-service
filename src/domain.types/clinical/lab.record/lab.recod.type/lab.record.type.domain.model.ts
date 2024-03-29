import { decimal } from "../../../miscellaneous/system.types";
import { LabRecordType } from "../lab.record/lab.record.types";

export interface LabRecordTypeDomainModel {
    id?             : string;
    TypeName        : string;
    DisplayName     : LabRecordType;
    SnowmedCode ?   : string;
    LoincCode ?     : string;
    NormalRangeMin? : decimal;
    NormalRangeMax? : decimal;
    Unit?           : string;
}

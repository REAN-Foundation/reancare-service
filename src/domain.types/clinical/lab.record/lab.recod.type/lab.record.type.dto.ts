import { decimal, uuid } from "../../../miscellaneous/system.types";
import { LabRecordType } from "../lab.record/lab.record.types";

export interface LabRecordTypeDto {
    id              : uuid;
    TypeName        : string;
    DisplayName     : LabRecordType;
    SnowmedCode ?   : string;
    LoincCode ?     : string;
    NormalRangeMin? : decimal;
    NormalRangeMax? : decimal;
    Unit?           : string;
}

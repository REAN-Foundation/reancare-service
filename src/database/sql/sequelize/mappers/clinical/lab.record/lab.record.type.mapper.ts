import { LabRecordTypeDto } from "../../../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.dto";
export class LabRecordTypeMapper {

    static toTypeDto = (labRecordType ): LabRecordTypeDto => {

        if (labRecordType == null){
            return null;
        }

        const dto: LabRecordTypeDto = {
            id             : labRecordType.id,
            TypeName       : labRecordType.TypeName,
            DisplayName    : labRecordType.DisplayName,
            SnowmedCode    : labRecordType.SnowmedCode,
            LoincCode      : labRecordType.LoincCode,
            NormalRangeMin : labRecordType.NormalRangeMin,
            NormalRangeMax : labRecordType.NormalRangeMax,
            Unit           : labRecordType.Unit,
        };

        return dto;
    };

}

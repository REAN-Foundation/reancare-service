import { LabRecordType } from "../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.types";
import { LabRecordDto } from "../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.dto";

export class LabRecordMapper {

    static toDto = (labRecord ): LabRecordDto => {

        if (labRecord == null){
            return null;
        }

        const dto: LabRecordDto = {
            id             : labRecord.id,
            EhrId          : labRecord.EhrId,
            PatientUserId  : labRecord.PatientUserId,
            TypeId         : labRecord.TypeId,
            TypeName       : labRecord.TypeName,
            DisplayName    : labRecord.DisplayName as LabRecordType,
            PrimaryValue   : labRecord.PrimaryValue,
            SecondaryValue : labRecord.SecondaryValue,
            Unit           : labRecord.Unit,
            ReportId       : labRecord.ReportId,
            OrderId        : labRecord.OrderId,
            RecordedAt     : labRecord.RecordedAt,

        };

        return dto;
    };

}

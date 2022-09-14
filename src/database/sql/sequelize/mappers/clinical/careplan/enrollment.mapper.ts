import { EnrollmentDto } from "../../../../../../domain.types/clinical/careplan/enrollment/enrollment.dto";
import CareplanEnrollment from "../../../models/clinical/careplan/enrollment.model";

///////////////////////////////////////////////////////////////////////////////////

export class EnrollmentMapper {

    static toDto = (enrollment: CareplanEnrollment): EnrollmentDto => {

        if (enrollment == null){
            return null;
        }

        const dto: EnrollmentDto = {
            id            : enrollment.id,
            PatientUserId : enrollment.PatientUserId,
            EnrollmentId  : enrollment.EnrollmentId,
            ParticipantId : enrollment.ParticipantId,
            PlanCode      : enrollment.PlanCode,
            Provider      : enrollment.Provider,
            PlanName      : enrollment.PlanName,
            StartAt       : enrollment.StartDate,
            EndAt         : enrollment.EndDate,
            IsActive      : enrollment.IsActive,
            Complication  : enrollment.Complication,
            HasHighRisk   : enrollment.HasHighRisk,
        };
        return dto;
    };

}

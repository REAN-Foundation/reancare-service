import { EnrollmentDto } from "../../../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import Enrollment from "../../models/careplan/enrollment.model";

///////////////////////////////////////////////////////////////////////////////////

export class EnrollmentMapper {

    static toDto = (enrollment: Enrollment): EnrollmentDto => {

        if (enrollment == null){
            return null;
        }

        const dto: EnrollmentDto = {
            id            : enrollment.id,
            UserId        : enrollment.UserId,
            EnrollmentId  : enrollment.EnrollmentId,
            ParticipantId : enrollment.ParticipantId,
            PlanCode      : enrollment.PlanCode,
            Provider      : "AHA",
            PlanName      : enrollment.PlanName,
            StartAt       : enrollment.StartDate,
            EndAt         : enrollment.EndDate,
            IsActive      : enrollment.IsActive,
        };
        return dto;
    }

}

import { CarePlanEnrollmentDto } from "../../../../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.dto";
import CareplanEnrollment from "../../../models/clinical/careplan/enrollment.model";

///////////////////////////////////////////////////////////////////////////////////

export class EnrollmentMapper {

    static toDto = (enrollment: CareplanEnrollment): CarePlanEnrollmentDto => {

        if (enrollment == null){
            return null;
        }

        const dto: CarePlanEnrollmentDto = {
            id            : enrollment.id,
            EhrId         : enrollment.EhrId,
            PatientUserId : enrollment.PatientUserId,
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
    };

}

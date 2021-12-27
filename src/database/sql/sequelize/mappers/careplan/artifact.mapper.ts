import { CareplanActivityDto } from "../../../../../modules/careplan/domain.types/activity/careplan.activity.dto";
import CareplanArtifact from "../../models/careplan/careplan.artifact.model";

///////////////////////////////////////////////////////////////////////////////////

export class CareplanArtifactMapper {

    static toDto = (careplanArtifact: CareplanArtifact): CareplanActivityDto => {

        if (careplanArtifact == null){
            return null;
        }

        const dto: CareplanActivityDto = {
            id               : careplanArtifact.id,
            PatientUserId    : careplanArtifact.PatientUserId,
            EnrollmentId     : careplanArtifact.EnrollmentId,
            Provider         : careplanArtifact.Provider,
            PlanName         : careplanArtifact.PlanName,
            PlanCode         : careplanArtifact.PlanCode,
            Type             : careplanArtifact.Type,
            ProviderActionId : careplanArtifact.ProviderActionId,
            Title            : careplanArtifact.Title,
            ScheduledAt      : careplanArtifact.ScheduledAt,
            Sequence         : careplanArtifact.Sequence,
            Frequency        : careplanArtifact.Frequency,
            Status           : careplanArtifact.Status,
        };
        return dto;
    }

}

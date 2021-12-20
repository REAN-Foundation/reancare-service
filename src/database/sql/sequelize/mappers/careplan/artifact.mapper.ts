import { CareplanArtifactDto } from "../../../../../modules/careplan/domain.types/artifact/careplan.artifact.dto";
import CareplanArtifact from "../../models/careplan/careplan.artifact.model";

///////////////////////////////////////////////////////////////////////////////////

export class CareplanArtifactMapper {

    static toDto = async (careplanArtifact: CareplanArtifact): Promise<CareplanArtifactDto> => {

        if (careplanArtifact == null){
            return null;
        }

        const dto: CareplanArtifactDto = {
            id               : careplanArtifact.id,
            UserId           : careplanArtifact.UserId,
            EnrollmentId     : careplanArtifact.EnrollmentId,
            CareplanProvider : careplanArtifact.CareplanProvider,
            CareplanName     : careplanArtifact.CareplanName,
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

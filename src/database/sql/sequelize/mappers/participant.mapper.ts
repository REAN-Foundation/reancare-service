import { ParticipantDto } from "../../../../modules/careplan/domain.types/participant/participant.dto";
import CareplanParticipant from "../models/careplan/participant.model";

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantMapper {

    static toDto = async (participant: CareplanParticipant): Promise<ParticipantDto> => {

        if (participant == null){
            return null;
        }

        const dto: ParticipantDto = {
            id            : participant.id,
            PatientUserId : participant.PatientUserId,
            ParticipantId : participant.ParticipantId,
            Provider      : participant.Provider,
            IsActive      : participant.IsActive,
        };
        return dto;
    }

}

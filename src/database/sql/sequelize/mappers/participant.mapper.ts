import { ParticipantDto } from "../../../../modules/careplan/domain.types/participant/participant.dto";
import CareplanParticipant from "../models/careplan/participant.model";

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantMapper {

    static toDto = async (participant: CareplanParticipant): Promise<ParticipantDto> => {

        if (participant == null){
            return null;
        }

        const dto: ParticipantDto = {
            id             : participant.id,
            UserId         : participant.UserId,
            ParticipantId  : participant.ParticipantId,
            Name           : participant.Name,
            IsActive       : participant.IsActive,
            Gender         : participant.Gender,
            Dob            : participant.Dob,
            HeightInInches : participant.Height,
            WeightInLbs    : participant.Weight,
            MaritalStatus  : participant.MaritalStatus,
            ZipCode        : participant.ZipCode,
        };
        return dto;
    }

}

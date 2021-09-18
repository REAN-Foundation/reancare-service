import BodyWeight from '../../models/biometrics/body.weight.model';
import { BodyWeightDto } from '../../../../../domain.types/biometrics/body.weight/body.weight.dto';

///////////////////////////////////////////////////////////////////////////////////

export class BodyWeightMapper {

    static toDto = (bodyWeight: BodyWeight): BodyWeightDto => {
        if (bodyWeight == null){
            return null;
        }

        const dto: BodyWeightDto = {
            id               : bodyWeight.id,
            PatientUserId    : bodyWeight.PatientUserId,
            BodyWeight       : bodyWeight.BodyWeight,
            Unit             : bodyWeight.Unit,
            RecordDate       : bodyWeight.RecordDate,
            RecordedByUserId : bodyWeight.RecordedByUserId
        };
        return dto;
    }

}

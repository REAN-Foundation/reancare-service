import { BodyHeightDto } from '../../../../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import BodyHeight from '../../../models/clinical/biometrics/body.height.model';

///////////////////////////////////////////////////////////////////////////////////

export class BodyHeightMapper {

    static toDto = (bodyHeight: BodyHeight): BodyHeightDto => {
        if (bodyHeight == null){
            return null;
        }

        const dto: BodyHeightDto = {
            id            : bodyHeight.id,
            EhrId         : bodyHeight.EhrId,
            PatientUserId : bodyHeight.PatientUserId,
            BodyHeight    : bodyHeight.BodyHeight,
            Unit          : bodyHeight.Unit,
            RecordDate    : bodyHeight.RecordDate

        };
        return dto;
    };

}

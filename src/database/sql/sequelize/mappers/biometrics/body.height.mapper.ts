import BodyHeight from '../../models/body.height.model';
import { BodyHeightDto } from '../../../../../domain.types/biometrics/body.height/body.height.dto';

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
            Unit          : bodyHeight.Unit
        };
        return dto;
    }

}

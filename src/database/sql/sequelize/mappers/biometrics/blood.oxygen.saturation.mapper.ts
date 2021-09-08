import BloodOxygenSaturationModel from '../../models/biometrics/blood.oxygen.saturation.model';
import { BloodOxygenSaturationDto } from '../../../../../domain.types/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';

///////////////////////////////////////////////////////////////////////////////////

export class BloodOxygenSaturationMapper {

    static toDto = (
        bloodOxygenSaturation: BloodOxygenSaturationModel): BloodOxygenSaturationDto => {
        if (bloodOxygenSaturation == null) {
            return null;
        }
        const dto: BloodOxygenSaturationDto = {
            id                    : bloodOxygenSaturation.id,
            EhrId                 : bloodOxygenSaturation.EhrId,
            PatientUserId         : bloodOxygenSaturation.PatientUserId,
            PatientId             : bloodOxygenSaturation.PatientId,
            BloodOxygenSaturation : bloodOxygenSaturation.BloodOxygenSaturation,
            Unit                  : bloodOxygenSaturation.Unit,
            RecordDate            : bloodOxygenSaturation.RecordDate,
            RecordedByUserId      : bloodOxygenSaturation.RecordedByUserId
        };
        return dto;
    }

}

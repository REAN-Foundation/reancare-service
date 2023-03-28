import { BloodOxygenSaturationDto } from '../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import BloodOxygenSaturationModel from '../../../models/clinical/biometrics/blood.oxygen.saturation.model';

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
            TerraSummaryId        : bloodOxygenSaturation.TerraSummaryId,
            Provider              : bloodOxygenSaturation.Provider,
            BloodOxygenSaturation : bloodOxygenSaturation.BloodOxygenSaturation,
            Unit                  : bloodOxygenSaturation.Unit,
            RecordDate            : bloodOxygenSaturation.RecordDate,
            RecordedByUserId      : bloodOxygenSaturation.RecordedByUserId
        };
        return dto;
    };

}

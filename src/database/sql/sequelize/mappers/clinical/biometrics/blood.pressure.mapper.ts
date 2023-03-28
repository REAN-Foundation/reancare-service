import { BloodPressureDto } from '../../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import BloodPressureModel from '../../../models/clinical/biometrics/blood.pressure.model';

///////////////////////////////////////////////////////////////////////////////////

export class BloodPressureMapper {

    static toDto = (
        bloodPressure: BloodPressureModel): BloodPressureDto => {
        if (bloodPressure == null) {
            return null;
        }
        const dto: BloodPressureDto = {
            id               : bloodPressure.id,
            EhrId            : bloodPressure.EhrId,
            PatientUserId    : bloodPressure.PatientUserId,
            TerraSummaryId   : bloodPressure.TerraSummaryId,
            Provider         : bloodPressure.Provider,
            Systolic         : bloodPressure.Systolic,
            Diastolic        : bloodPressure.Diastolic,
            Unit             : bloodPressure.Unit,
            RecordDate       : bloodPressure.RecordDate,
            RecordedByUserId : bloodPressure.RecordedByUserId
        };
        return dto;
    };

}

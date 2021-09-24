import BloodPressureModel from '../../models/biometrics/blood.pressure.model';
import { BloodPressureDto } from '../../../../../domain.types/biometrics/blood.pressure/blood.pressure.dto';

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
            Systolic         : bloodPressure.Systolic,
            Diastolic        : bloodPressure.Diastolic,
            Unit             : bloodPressure.Unit,
            RecordDate       : bloodPressure.RecordDate,
            RecordedByUserId : bloodPressure.RecordedByUserId
        };
        return dto;
    }

}

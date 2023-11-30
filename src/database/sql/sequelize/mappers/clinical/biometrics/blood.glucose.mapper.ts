import { BloodGlucoseDto } from "../../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import BloodGlucoseModel from '../../../models/clinical/biometrics/blood.glucose.model';

///////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseMapper {

    static toDto = (bloodGlucose: BloodGlucoseModel): BloodGlucoseDto => {

        if (bloodGlucose == null){
            return null;
        }

        const dto : BloodGlucoseDto = {
            id               : bloodGlucose.id,
            EhrId            : bloodGlucose.EhrId,
            PatientUserId    : bloodGlucose.PatientUserId,
            TerraSummaryId   : bloodGlucose.TerraSummaryId,
            Provider         : bloodGlucose.Provider,
            BloodGlucose     : bloodGlucose.BloodGlucose,
            Unit             : bloodGlucose.Unit,
            RecordDate       : bloodGlucose.RecordDate,
            RecordedByUserId : bloodGlucose.RecordedByUserId ?? null,
        };

        return dto;
    };

}

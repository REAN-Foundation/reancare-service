import { BloodCholesterolDto } from '../../../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.dto';
import BloodCholesterolModel from '../../../models/clinical/biometrics/blood.cholesterol.model';

///////////////////////////////////////////////////////////////////////////////////

export class BloodCholesterolMapper {

    static toDto = (
        bloodCholesterol: BloodCholesterolModel): BloodCholesterolDto => {
        if (bloodCholesterol == null) {
            return null;
        }
        const dto: BloodCholesterolDto = {
            id                : bloodCholesterol.id,
            EhrId             : bloodCholesterol.EhrId,
            PatientUserId     : bloodCholesterol.PatientUserId,
            TotalCholesterol  : bloodCholesterol.TotalCholesterol,
            HDL               : bloodCholesterol.HDL,
            LDL               : bloodCholesterol.LDL,
            TriglycerideLevel : bloodCholesterol.TriglycerideLevel,
            Ratio             : bloodCholesterol.Ratio,
            A1CLevel          : bloodCholesterol.A1CLevel,
            Unit              : bloodCholesterol.Unit,
            RecordDate        : bloodCholesterol.RecordDate,
            RecordedByUserId  : bloodCholesterol.RecordedByUserId
        };
        return dto;
    };

}

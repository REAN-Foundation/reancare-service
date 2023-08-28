import path from 'path';
import { Helper } from '../../../../common/helper';
import { BloodPressureDomainModel } from '../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';

// import { Helper } from "../../common/helper";
// import { BloodPressureDomainModel } from "../domain.types/blood.pressure.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class BloodPressureMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'blood.pressure.domain.model.json');
        var bloodPressureObj = Helper.jsonToObj(jsonPath);

        var model: BloodPressureDomainModel = {
            
            PatientUserId    : bloodPressureObj.PatientUserId,
            EhrId            : bloodPressureObj.EhrId,
            Unit             : bloodPressureObj.Unit,
            RecordedByUserId : bloodPressureObj.RecordedByUserId,
            RecordedByEhrId  : bloodPressureObj.RecordedByEhrId,
            RecordDate       : bloodPressureObj.RecordDate,
            Systolic         : bloodPressureObj.Systolic,
            Diastolic        : bloodPressureObj.Diastolic,
        };

        return model;
    };

}

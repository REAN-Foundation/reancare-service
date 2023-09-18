import path from 'path';
import { Helper } from "../../../../common/helper";
import { BloodGlucoseDomainModel } from "../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','blood.sugar.domain.model.json');
        var bloodSugarObj = Helper.jsonToObj(jsonPath);

        var model: BloodGlucoseDomainModel = {
            PatientUserId    : bloodSugarObj.PatientUserId,
            EhrId            : bloodSugarObj.PatientEhrId,
            Unit             : bloodSugarObj.Unit,
            RecordedByUserId : bloodSugarObj.RecordedByUserId,
            RecordedByEhrId  : bloodSugarObj.RecordedByEhrId,
            RecordDate       : bloodSugarObj.RecordDate,
            BloodGlucose     : bloodSugarObj.BloodGlucose,
        };

        return model;
    };

}

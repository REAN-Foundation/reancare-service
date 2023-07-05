import path from "path";
import { Helper } from "../../../../common/helper";
import { BloodOxygenSaturationDomainModel } from '../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class BloodOxygenSaturationMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','blood.oxygen.saturation.domain.model.json');
        var bloodOxygenSaturationObj = Helper.jsonToObj(jsonPath);

        var model: BloodOxygenSaturationDomainModel = {
            PatientUserId         : bloodOxygenSaturationObj.PatientUserId,
            EhrId                 : bloodOxygenSaturationObj.PatientEhrId,
            Unit                  : bloodOxygenSaturationObj.Unit,
            RecordedByUserId      : bloodOxygenSaturationObj.RecordedByEhrId,
            RecordDate            : bloodOxygenSaturationObj.RecordDate,
            BloodOxygenSaturation : bloodOxygenSaturationObj.BloodOxygenSaturation,

        };

        return model;
    };

}

import path from 'path';
import { Helper } from "../../../../common/helper";
import { BodyWeightDomainModel } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class BodyWeightMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','biometrics.weight.domain.model.json');
        var biometricsWeightObj = Helper.jsonToObj(jsonPath);

        var model: BodyWeightDomainModel = {
            PatientUserId    : biometricsWeightObj.PatientUserId,
            EhrId            : biometricsWeightObj.EhrId,
            Unit             : biometricsWeightObj.Unit,
            RecordedByUserId : biometricsWeightObj.RecordedByUserId,
            RecordedByEhrId  : biometricsWeightObj.RecordedByEhrId,
            RecordDate       : biometricsWeightObj.RecordDate,
            BodyWeight       : biometricsWeightObj.BodyWeight,
        };

        return model;
    };

}

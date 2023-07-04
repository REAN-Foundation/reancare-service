import path from 'path';
import { Helper } from '../../../../common/helper';
import { BodyHeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class BiometricsHeightMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'biometrics.height.domain.model.json');
        var biometricsHeightObj = Helper.jsonToObj(jsonPath);

        var model: BodyHeightDomainModel = {
            PatientUserId    : biometricsHeightObj.PatientUserId,
            EhrId            : biometricsHeightObj.EhrId,
            Unit             : biometricsHeightObj.Unit,
            RecordedByUserId : biometricsHeightObj.RecordedByUserId,
            RecordDate       : biometricsHeightObj.RecordDate,
            BodyHeight       : biometricsHeightObj.BodyHeight,
        };

        return model;
    };

}

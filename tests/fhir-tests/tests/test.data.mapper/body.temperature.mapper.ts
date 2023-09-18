import path from 'path';
import { Helper } from "../../../../common/helper";
import { BodyTemperatureDomainModel } from "../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','biometrics.temperature.domain.model.json');
        var temperatureObj = Helper.jsonToObj(jsonPath);
        
        var model: BodyTemperatureDomainModel = {
            PatientUserId    : temperatureObj.PatientUserId,
            EhrId            : temperatureObj.EhrId,
            Unit             : temperatureObj.Unit,
            RecordedByEhrId  : temperatureObj.RecordedByEhrId,
            RecordedByUserId : temperatureObj.RecordedByUserId,
            RecordDate       : temperatureObj.RecordDate,
            BodyTemperature  : temperatureObj.BodyTemperature,
        };

        return model;
    };

}

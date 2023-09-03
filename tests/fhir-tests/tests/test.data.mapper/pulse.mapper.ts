import path from 'path';
import { Helper } from "../../../../common/helper";
import { PulseDomainModel } from "../../../../domain.types/clinical/biometrics/pulse/pulse.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class PulseMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','biometrics.pulse.domain.model.json');
        var pulseObj = Helper.jsonToObj(jsonPath);
        //  var pulseObj = Helper.readJsonResource('biometrics.pulse.domain.model.json');

        var model: PulseDomainModel = {
            PatientUserId    : pulseObj.PatientUserId,
            EhrId            : pulseObj.EhrId,
            // VisitId: pulseObj.VisitId,
            // VisitEhrId: pulseObj.VisitEhrId,
            Unit             : pulseObj.Unit,
            // RecordedBy: pulseObj.RecordedBy,
            RecordedByUserId : pulseObj.RecordedByEhrId,
            RecordDate       : pulseObj.RecordDate,
            Pulse            : pulseObj.Pulse
        };

        return model;
    };

}

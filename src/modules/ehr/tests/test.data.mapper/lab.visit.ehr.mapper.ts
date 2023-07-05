import path from 'path';
import { LabVisitDomainModel } from '../../../../domain.types/clinical/lab.visit/lab.visit.domain.model';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export class LabVisitMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'lab.visit.domain.model.json');

        var labVisitObj = Helper.jsonToObj(jsonPath);

        var model: LabVisitDomainModel = {

            DisplayId        : labVisitObj.DisplayId,
            DisplayEhrId     : labVisitObj.DisplayEhrId,
            PatientUserId    : labVisitObj.PatientUserId,
            EhrId            : labVisitObj.EhrId,
            LabAppointmentId : labVisitObj.LabAppointmentId,
            DoctorVisitId    : labVisitObj.DoctorVisitId,
            DoctorVisitEhrId : labVisitObj.DoctorVisitEhrId,
            SuggestedLabId   : labVisitObj.SuggestedLabId,
            CreatedBy        : labVisitObj.CreatedBy,
            CurrentState     : labVisitObj.CurrentState
        };

        return model;
    };

}

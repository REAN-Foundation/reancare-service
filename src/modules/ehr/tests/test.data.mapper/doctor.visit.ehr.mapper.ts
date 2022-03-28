import path from "path";
import { Helper } from "../../../../common/helper";
import { DoctorVisitDomainModel } from "../../../../domain.types/doctor.visit/doctor.visit.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class DoctorVisitMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'doctor.visit.domain.model.json');
        var obj = Helper.jsonToObj(jsonPath);

        var model: DoctorVisitDomainModel = {
            PatientUserId  : obj.PatientUserId,
            EhrId          : obj.EhrId,
            DoctorUserId   : obj.DoctorUserId,
            DoctorEhrId    : obj.DoctorEhrId,
            PastVisitId    : obj.PastVisitId,
            PastVisitEhrId : obj.PastVisitEhrId,
            StartDate      : obj.StartDate,
            EndDate        : obj.EndDate,
            CreatedByUser  : obj.CreatedByUser,
        };

        return model;
    }

}

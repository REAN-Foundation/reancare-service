import path from 'path';
import { Helper } from "../../../../common/helper";
import { CarePlanEnrollmentDomainModel } from '../../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class CarePlanMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','care.plan.domain.model.json');
        var carePlanObj = Helper.jsonToObj(jsonPath);

        var model: CarePlanEnrollmentDomainModel = {
            id            : carePlanObj.id,
            PatientUserId : carePlanObj.PatientUserId,
            EnrollmentId  : carePlanObj.EnrollmentId,
            Provider      : carePlanObj.Provider,
            PlanName      : carePlanObj.PlanName,
            PlanCode      : carePlanObj.PlanCode,
            StartDate     : carePlanObj.StartDate,
            EndDate       : carePlanObj.EndDate,
            Name          : carePlanObj.Name,
        };

        return model;
    }

}

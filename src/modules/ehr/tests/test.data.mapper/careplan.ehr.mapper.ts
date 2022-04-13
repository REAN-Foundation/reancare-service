import path from 'path';
import { CarePlanDomainModel } from '../../../../domain.types/clinical/careplan/careplandomain.model';
import { Helper } from "../../../../common/helper";

///////////////////////////////////////////////////////////////////////////////////

export class CarePlanMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','care.plan.domain.model.json');
        var carePlanObj = Helper.jsonToObj(jsonPath);

        var model: CarePlanDomainModel = {
            id               : carePlanObj.id,
            PatientUserId    : carePlanObj.PatientUserId,
            RegistrationId   : carePlanObj.RegistrationId,
            EnrollmentId     : carePlanObj.EnrollmentId,
            Provider         : carePlanObj.Provider,
            PlanName         : carePlanObj.PlanName,
            PlanCode         : carePlanObj.PlanCode,
            CarePlanType     : carePlanObj.CarePlanType,
            RegistrationDate : carePlanObj.RegistrationDate,
            StartDate        : carePlanObj.StartDate,
            EndDate          : carePlanObj.EndDate,
            Description      : carePlanObj.Description
        };

        return model;
    }

}

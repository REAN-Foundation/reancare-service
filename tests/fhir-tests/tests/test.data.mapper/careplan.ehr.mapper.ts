import path from 'path';
import { Helper } from "../../../../common/helper";
import { CareplanActivityDomainModel
} from '../../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class CarePlanMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','care.plan.domain.model.json');
        var carePlanObj = Helper.jsonToObj(jsonPath);

        var model: CareplanActivityDomainModel = {
            PatientUserId    : carePlanObj.PatientUserId,
            EhrId            : carePlanObj.EhrId,
            ParticipantId    : carePlanObj.ParticipantId,
            EnrollmentId     : carePlanObj.EnrollmentId,
            Provider         : carePlanObj.Provider,
            PlanName         : carePlanObj.PlanName,
            PlanCode         : carePlanObj.PlanCode,
            Type             : carePlanObj.Type,
            Category         : carePlanObj.Category,
            ProviderActionId : carePlanObj.ProviderActionId,
            Title            : carePlanObj.Title,
            Description      : carePlanObj.Description,
            Url              : carePlanObj.Url,
            Language         : carePlanObj.Language,
            ScheduledAt      : carePlanObj.ScheduledAt,
            Sequence         : carePlanObj.Sequence,
            Frequency        : carePlanObj.Frequency,
            Status           : carePlanObj.Status
        };

        return model;
    };

}

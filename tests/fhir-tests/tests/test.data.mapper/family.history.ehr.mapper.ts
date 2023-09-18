import path from "path";
import { Helper } from "../../../../common/helper";
import { FamilyHistoryDomainModel } from "../../../../domain.types/clinical/family.history/family.history.domain.model";

export class FamilyHistoryMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'family.history.domain.model.json');
        var obj = Helper.jsonToObj(jsonPath);

        var model: FamilyHistoryDomainModel = {
            PatientUserId : obj.PatientUserId,
            EhrId         : obj.EhrId,
            Relationship  : obj.Relationship,
            Condition     : obj.Condition,
            ConditionId   : obj.ConditionId,
            Status        : obj.Status,
            Date          : obj.Date
        };

        return model;
    };

}

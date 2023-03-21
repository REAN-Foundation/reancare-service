import express from 'express';
import { InputValidationError } from '../../../../common/input.validation.error';
import {
    BloodGroup,
    BloodGroupList,
    MaritalStatus,
    MaritalStatusList,
    Severity,
    SeverityList
} from '../../../../domain.types/miscellaneous/system.types';
import { HealthProfileDomainModel } from '../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileValidator extends BaseValidator {

    getDomainModel = (request: express.Request): HealthProfileDomainModel => {

        const model: HealthProfileDomainModel = {
            BloodGroup            : request.body.BloodGroup ?? undefined,
            BloodTransfusionDate  : request.body.BloodTransfusionDate ?? undefined,
            BloodDonationCycle    : request.body.BloodDonationCycle ?? undefined,
            MajorAilment          : request.body.MajorAilment ?? undefined,
            OtherConditions       : request.body.OtherConditions ?? undefined,
            IsDiabetic            : request.body.IsDiabetic ?? undefined,
            HasHeartAilment       : request.body.HasHeartAilment ?? undefined,
            MaritalStatus         : request.body.MaritalStatus ?? undefined,
            Ethnicity             : request.body.Ethnicity ?? undefined,
            Race                  : request.body.Race ?? undefined,
            Nationality           : request.body.Nationality ?? undefined,
            Occupation            : request.body.Occupation ?? undefined,
            SedentaryLifestyle    : request.body.SedentaryLifestyle ?? undefined,
            IsSmoker              : request.body.IsSmoker ?? undefined,
            SmokingSeverity       : request.body.SmokingSeverity ?? undefined,
            SmokingSince          : request.body.SmokingSince ?? undefined,
            IsDrinker             : request.body.IsDrinker ?? undefined,
            DrinkingSeverity      : request.body.DrinkingSeverity ?? undefined,
            DrinkingSince         : request.body.DrinkingSince ?? undefined,
            SubstanceAbuse        : request.body.SubstanceAbuse ?? undefined,
            ProcedureHistory      : request.body.ProcedureHistory ?? undefined,
            ObstetricHistory      : request.body.ObstetricHistory ?? undefined,
            OtherInformation      : request.body.OtherInformation ?? undefined,
            TobaccoQuestionAns    : request.body.TobaccoQuestionAns ?? undefined,
            TypeOfStroke          : request.body.TypeOfStroke ?? undefined,
            HasHighBloodPressure  : request.body.HasHighBloodPressure ?? undefined,
            HasHighCholesterol    : request.body.HasHighCholesterol ?? undefined,
            HasAtrialFibrillation : request.body.HasAtrialFibrillation ?? undefined,
        };

        return model;
    };

    update = async (request: express.Request): Promise<HealthProfileDomainModel> => {
        await this.validateBody(request);
        const patientUserId = await this.getParamUuid(request, 'patientUserId');
        const domainModel = this.getDomainModel(request);
        domainModel.PatientUserId = patientUserId;
        return domainModel;
    };

    private async validateBody(request) {

        await this.validateString(request, 'BloodGroup', Where.Body, false, true);
        await this.validateInt(request, 'BloodDonationCycle', Where.Body, false, true);
        await this.validateDate(request, 'BloodTransfusionDate', Where.Body, false, true);
        await this.validateString(request, 'MajorAilment', Where.Body, false, true);
        await this.validateString(request, 'OtherConditions', Where.Body, false, true);
        await this.validateBoolean(request, 'IsDiabetic', Where.Body, false, true);
        await this.validateBoolean(request, 'HasHeartAilment', Where.Body, false, true);
        await this.validateString(request, 'MaritalStatus', Where.Body, false, true);
        await this.validateString(request, 'Ethnicity', Where.Body, false, true);
        await this.validateString(request, 'Nationality', Where.Body, false, true);
        await this.validateString(request, 'Occupation', Where.Body, false, true);
        await this.validateBoolean(request, 'SedentaryLifestyle', Where.Body, false, true);
        await this.validateBoolean(request, 'IsSmoker', Where.Body, false, true);
        await this.validateString(request, 'SmokingSeverity', Where.Body, false, true);
        await this.validateDate(request, 'SmokingSince', Where.Body, false, true);
        await this.validateBoolean(request, 'IsDrinker', Where.Body, false, true);
        await this.validateString(request, 'DrinkingSeverity', Where.Body, false, true);
        await this.validateDate(request, 'DrinkingSince', Where.Body, false, true);
        await this.validateBoolean(request, 'SubstanceAbuse', Where.Body, false, true);
        await this.validateString(request, 'ProcedureHistory', Where.Body, false, true);
        await this.validateString(request, 'ObstetricHistory', Where.Body, false, true);
        await this.validateString(request, 'OtherInformation', Where.Body, false, true);
        await this.validateBoolean(request, 'TobaccoQuestionAns', Where.Body, false, true);
        await this.validateString(request, 'TypeOfStroke', Where.Body, false, true);
        await this.validateBoolean(request, 'HasHighBloodPressure', Where.Body, false, true);
        await this.validateBoolean(request, 'HasHighCholesterol', Where.Body, false, true);
        await this.validateBoolean(request, 'HasAtrialFibrillation', Where.Body, false, true);

        this.validateRequest(request);

        if (this.isTruthy(request.body.BloodGroup) &&
            !BloodGroupList.includes(request.body.BloodGroup as BloodGroup)) {
            var bloodGroups = BloodGroupList.join(',');
            throw new InputValidationError([`Blood group should be either of ${bloodGroups}.`]);
        }

        if (this.isTruthy(request.body.MaritalStatus) &&
            !MaritalStatusList.includes(request.body.MaritalStatus as MaritalStatus)) {
            var maritalStatuses = MaritalStatusList.join(',');
            throw new InputValidationError([`Marital status should be either of ${maritalStatuses}.`]);
        }

        const severities = SeverityList.join(',');

        if (this.isTruthy(request.body.SmokingSeverity) &&
            !SeverityList.includes(request.body.SmokingSeverity as Severity)) {
            throw new InputValidationError([`Smoking severity should be either of ${severities}.`]);
        }

        if (this.isTruthy(request.body.DrinkingSeverity) &&
            !SeverityList.includes(request.body.DrinkingSeverity as Severity)) {
            throw new InputValidationError([`Drinking severity should be either of ${severities}.`]);
        }

    }

}

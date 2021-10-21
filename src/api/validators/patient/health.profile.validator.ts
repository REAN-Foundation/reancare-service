import express from 'express';
import { ValidationError } from 'sequelize';
import {
    BloodGroup,
    BloodGroupList,
    MaritalStatus,
    MaritalStatusList,
    Severity,
    SeverityList
} from '../../../domain.types/miscellaneous/system.types';
import { HealthProfileDomainModel } from '../../../domain.types/patient/health.profile/health.profile.domain.model';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileValidator extends BaseValidator {

    getDomainModel = (request: express.Request): HealthProfileDomainModel => {

        const model: HealthProfileDomainModel = {
            BloodGroup         : request.body.BloodGroup ?? null,
            MajorAilment       : request.body.MajorAilment ?? null,
            OtherConditions    : request.body.OtherConditions ?? null,
            IsDiabetic         : request.body.IsDiabetic ?? null,
            HasHeartAilment    : request.body.HasHeartAilment ?? null,
            MaritalStatus      : request.body.MaritalStatus ?? null,
            Ethnicity          : request.body.Ethnicity ?? null,
            Nationality        : request.body.Nationality ?? null,
            Occupation         : request.body.Occupation ?? null,
            SedentaryLifestyle : request.body.SedentaryLifestyle ?? null,
            IsSmoker           : request.body.IsSmoker ?? null,
            SmokingSeverity    : request.body.SmokingSeverity ?? null,
            SmokingSince       : request.body.SmokingSince ?? null,
            IsDrinker          : request.body.IsDrinker ?? null,
            DrinkingSeverity   : request.body.DrinkingSeverity ?? null,
            DrinkingSince      : request.body.DrinkingSince ?? null,
            SubstanceAbuse     : request.body.SubstanceAbuse ?? null,
            ProcedureHistory   : request.body.ProcedureHistory ?? null,
            ObstetricHistory   : request.body.ObstetricHistory ?? null,
            OtherInformation   : request.body.OtherInformation ?? null,
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

        this.validateRequest(request);
        
        if (this.isTruthy(request.body.BloodGroup) &&
            !BloodGroupList.includes(request.body.BloodGroup as BloodGroup)) {
            var bloodGroups = BloodGroupList.join(',');
            throw new ValidationError(`Blood group should be either of ${bloodGroups}.`);
        }

        if (this.isTruthy(request.body.MaritalStatus) &&
            !MaritalStatusList.includes(request.body.MaritalStatus as MaritalStatus)) {
            var maritalStatuses = MaritalStatusList.join(',');
            throw new ValidationError(`Marital status should be either of ${maritalStatuses}.`);
        }

        const severities = SeverityList.join(',');
        
        if (this.isTruthy(request.body.SmokingSeverity) &&
            !SeverityList.includes(request.body.SmokingSeverity as Severity)) {
            throw new ValidationError(`Smoking severity should be either of ${severities}.`);
        }
        
        if (this.isTruthy(request.body.DrinkingSeverity) &&
            !SeverityList.includes(request.body.DrinkingSeverity as Severity)) {
            throw new ValidationError(`Drinking severity should be either of ${severities}.`);
        }
        
    }

}

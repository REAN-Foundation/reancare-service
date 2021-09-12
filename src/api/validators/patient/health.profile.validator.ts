import express from 'express';
import { body, param, validationResult } from 'express-validator';

import { Helper } from '../../../common/helper';
import { HealthProfileDomainModel } from '../../../domain.types/patient/health.profile/health.profile.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileValidator {

    static getDomainModel = (request: express.Request): HealthProfileDomainModel => {

        const model: HealthProfileDomainModel = {
            BloodGroup         : request.body.BloodGroup ?? null,
            MajorAilment       : request.body.MajorAilment,
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

    static validatePatientUserId = async (request: express.Request): Promise<string> => {

        await param('patientUserId')
            .trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.patientUserId;

    };

    static update = async (request: express.Request): Promise<HealthProfileDomainModel> => {

        const patientUserId = await HealthProfileValidator.validatePatientUserId(request);
        await HealthProfileValidator.validateBody(request);

        const domainModel = HealthProfileValidator.getDomainModel(request);
        domainModel.PatientUserId = patientUserId;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('BloodGroup')
            .optional()
            .trim()
            .isIn(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-','O-', 'AB-'])
            .run(request);

        await body('MajorAilment')
            .optional()
            .trim()
            .run(request);

        await body('OtherConditions')
            .optional()
            .trim()
            .run(request);

        await body('IsDiabetic')
            .optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await body('HasHeartAilment')
            .optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await body('MaritalStatus')
            .optional()
            .trim()
            .isIn(['Single', 'Married', 'Widowed', 'Divorcee', 'Live-in'])
            .run(request);

        await body('Ethnicity')
            .optional()
            .trim()
            .isLength({ min: 1 })
            .run(request);

        await body('Nationality')
            .optional()
            .trim()
            .isLength({ min: 1 })
            .run(request);

        await body('Occupation')
            .optional()
            .trim()
            .isLength({ min: 1 })
            .run(request);

        await body('SedentaryLifestyle')
            .optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('IsSmoker')
            .optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('SmokingSeverity')
            .optional()
            .trim()
            .isIn(['Low', 'Medium', 'High', 'Critical'])
            .run(request);

        await body('SmokingSince')
            .optional()
            .trim()
            .isDate()
            .run(request);

        await body('IsDrinker')
            .optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('DrinkingSeverity')
            .optional()
            .trim()
            .isIn(['Low', 'Medium', 'High', 'Critical'])
            .run(request);

        await body('DrinkingSince')
            .optional()
            .trim()
            .isDate()
            .run(request);

        await body('SubstanceAbuse')
            .optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('ProcedureHistory')
            .optional()
            .trim()
            .isLength({ min: 1 })
            .run(request);

        await body('ObstetricHistory')
            .optional()
            .trim()
            .isLength({ min: 1 })
            .run(request);

        await body('OtherInformation')
            .optional()
            .trim()
            .isLength({ min: 1 })
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

}

import express from 'express';
import { QueryResponseType } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AssessmentDomainModel => {

        const patientAssessmentModel: AssessmentDomainModel = {
            PatientUserId          : request.body.PatientUserId ?? null,
            Title                  : request.body.Title ?? null,
            Type                   : request.body.Type ?? null,
            AssessmentTemplateId   : request.body.AssessmentTemplateId ?? null,
            ProviderEnrollmentId   : request.body.ProviderEnrollmentId ?? null,
            ProviderAssessmentCode : request.body.ProviderAssessmentCode ?? null,
            Provider               : request.body.Provider ?? null,
            Status                 : request.body.Status ?? null,
        };

        return patientAssessmentModel;
    };

    create = async (request: express.Request): Promise<AssessmentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (
        request: express.Request
    ): Promise<AssessmentSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false, true);
        await this.validateString(request, 'type', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);

    };
        
    answerQuestion = async (request: express.Request) => {

        await this.validateString(request, 'ResponseType', Where.Body, true, false, false);

        var answerModel = {
            AssessmentId   : request.params.id,
            QuestionNodeId : request.params.questionId,
            ResponseType   : request.body.ResponseType,
        };
        
        const responseType = request.body.ResponseType;
        if (responseType === QueryResponseType.SingleChoiceSelection ||
            responseType === QueryResponseType.Integer) {
            await this.validateInt(request, 'Answer', Where.Body, true, false);
            answerModel['IntegerValue'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.MultiChoiceSelection) {
            await this.validateArray(request, 'Answer', Where.Body, true, false);
            answerModel['IntegerValue'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.Text ||
            responseType === QueryResponseType.Ok) {
            await this.validateString(request, 'Answer', Where.Body, true, false);
            answerModel['TextValue'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.Float) {
            await this.validateDecimal(request, 'Answer', Where.Body, true, false);
            answerModel['FloatValue'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.Boolean) {
            await this.validateBoolean(request, 'Answer', Where.Body, true, false);
            answerModel['BooleanValue'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.Biometrics) {
            await this.validateArray(request, 'Answer', Where.Body, true, false);
            answerModel['Biometrics'] = request.body.Answer;
        }

        return answerModel;
    }

    private getFilter(request): AssessmentSearchFilters {

        var filters: AssessmentSearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Title         : request.query.title ?? null,
            Type          : request.query.type ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    update = async (request: express.Request): Promise<AssessmentDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateString(request, 'AssessmentTemplateId', Where.Body, true, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'AssessmentTemplateId', Where.Body, false, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);

        this.validateRequest(request);
        
    }

}

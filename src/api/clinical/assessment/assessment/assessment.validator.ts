import express from 'express';
import { QueryResponseType } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.search.types';
import { BaseValidator, Where } from '../../../base.validator';
import { AssessmentAnswerDomainModel } from '../../../../domain.types/clinical/assessment/assessment.answer.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AssessmentDomainModel => {

        var dateStr = request.body.ScheduledDate ? new Date(request.body.ScheduledDate).toISOString()
            .split('T')[0] : null;

        const patientAssessmentModel: AssessmentDomainModel = {
            PatientUserId          : request.body.PatientUserId ?? null,
            Title                  : request.body.Title ?? null,
            Type                   : request.body.Type ?? null,
            AssessmentTemplateId   : request.body.AssessmentTemplateId ?? null,
            ScoringApplicable      : request.body.ScoringApplicable ?? false,
            ScoreDetails           : request.body.ScoreDetails ? JSON.stringify(request.body.ScoreDetails) : null,
            ProviderEnrollmentId   : request.body.ProviderEnrollmentId ?? null,
            ProviderAssessmentCode : request.body.ProviderAssessmentCode ?? null,
            Provider               : request.body.Provider ?? null,
            Status                 : request.body.Status ?? null,
            ScheduledDateString    : dateStr
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
        await this.validateString(request, 'templateId', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    answerQuestion = async (request: express.Request) => {

        await this.validateString(request, 'ResponseType', Where.Body, true, false, false);

        var answerModel: AssessmentAnswerDomainModel = {
            AssessmentId   : request.params.id,
            QuestionNodeId : request.params.questionId,
            ResponseType   : request.body.ResponseType,
        };

        const responseType = request.body.ResponseType;

        if (responseType === QueryResponseType.SingleChoiceSelection ||
            responseType === QueryResponseType.Integer) {
            await this.validateInt(request, 'Answer', Where.Body, true, false);
            answerModel['IntegerValue'] = parseInt(request.body.Answer);
        }
        else if (responseType === QueryResponseType.MultiChoiceSelection) {
            await this.validateArray(request, 'Answer', Where.Body, true, false);
            answerModel['IntegerArray'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.Text ||
            responseType === QueryResponseType.Ok) {
            await this.validateString(request, 'Answer', Where.Body, true, false);
            answerModel['TextValue'] = request.body.Answer;
        }
        else if (responseType === QueryResponseType.Date) {
            await this.validateDateString(request, 'Answer', Where.Body, true, false);
            answerModel['DateValue'] = new Date(request.body.Answer);
        }
        else if (responseType === QueryResponseType.File) {
            answerModel['FieldName'] = request.body.Answer.FileName ?? null;
            answerModel['Url'] = request.body.Answer.Url ?? null;
            answerModel['ResourceId'] = request.body.Answer.ResourceId ?? null;
        }
        else if (responseType === QueryResponseType.Float) {
            await this.validateDecimal(request, 'Answer', Where.Body, true, false);
            answerModel['FloatValue'] = parseFloat(request.body.Answer);
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
    };

    answerQuestionList = async (request: express.Request)
        :  Promise<AssessmentAnswerDomainModel[]> => {

        await this.validateArray(request, 'Answers', Where.Body, true, false);

        var answerModelList: AssessmentAnswerDomainModel[] = [];

        for (let i = 0; i < request.body.Answers.length; i++) {

            var answerModel: AssessmentAnswerDomainModel = {
                AssessmentId   : request.params.id,
                QuestionNodeId : request.body.Answers[i].QuestionId,
                ResponseType   : request.body.Answers[i].ResponseType,
            };

            const responseType = request.body.Answers[i].ResponseType;

            if (responseType === QueryResponseType.SingleChoiceSelection ||
            responseType === QueryResponseType.Integer) {
                await this.validateInt(request, 'Answers.Answer', Where.Body, true, false);
                answerModel['IntegerValue'] = parseInt(request.body.Answers[i].Answer);
            }
            else if (responseType === QueryResponseType.MultiChoiceSelection) {
                await this.validateArray(request, 'Answer', Where.Body, true, false);
                answerModel['IntegerArray'] = request.body.Answers[i].Answer;
            }
            else if (responseType === QueryResponseType.Text ||
            responseType === QueryResponseType.Ok) {
                await this.validateString(request, 'Answer', Where.Body, true, false);
                answerModel['TextValue'] = request.body.Answers[i].Answer;
            }
            else if (responseType === QueryResponseType.Date) {
                await this.validateDateString(request, 'Answer', Where.Body, true, false);
                answerModel['DateValue'] = new Date(request.body.Answers[i].Answer);
            }
            else if (responseType === QueryResponseType.File) {
                answerModel['FieldName'] = request.body.Answers[i].Answer.FileName ?? null;
                answerModel['Url'] = request.body.Answers[i].Answer.Url ?? null;
                answerModel['ResourceId'] = request.body.Answers[i].Answer.ResourceId ?? null;
            }
            else if (responseType === QueryResponseType.Float) {
                await this.validateDecimal(request, 'Answer', Where.Body, true, false);
                answerModel['FloatValue'] = parseFloat(request.body.Answers[i].Answer);
            }
            else if (responseType === QueryResponseType.Boolean) {
                await this.validateBoolean(request, 'Answer', Where.Body, true, false);
                answerModel['BooleanValue'] = request.body.Answers[i].Answer;
            }
            else if (responseType === QueryResponseType.Biometrics) {
                await this.validateArray(request, 'Answer', Where.Body, true, false);
                answerModel['Biometrics'] = request.body.Answers[i].Answer;
            }

            answerModelList.push(answerModel);
        }
        return answerModelList;
    };

    private getFilter(request): AssessmentSearchFilters {

        var filters: AssessmentSearchFilters = {
            PatientUserId        : request.query.patientUserId ?? null,
            Title                : request.query.title ?? null,
            Type                 : request.query.type ?? null,
            AssessmentTemplateId : request.query.templateId ?? null,
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
        await this.validateBoolean(request, 'ScoringApplicable', Where.Body, false, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledDate', Where.Body, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'AssessmentTemplateId', Where.Body, false, false);
        await this.validateBoolean(request, 'ScoringApplicable', Where.Body, false, false);
        await this.validateObject(request, 'ScoreDetails', Where.Body, false, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledDate', Where.Body, false, false);

        this.validateRequest(request);

    }

}

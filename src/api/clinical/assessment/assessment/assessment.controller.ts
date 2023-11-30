import express, { response } from 'express';
import { ProgressStatus, uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { AssessmentService } from '../../../../services/clinical/assessment/assessment.service';
import { CareplanService } from '../../../../services/clinical/careplan.service';
import { UserTaskService } from '../../../../services/users/user/user.task.service';
import { Loader } from '../../../../startup/loader';
import { AssessmentValidator } from './assessment.validator';
import { BaseController } from '../../../base.controller';
import { AssessmentQuestionResponseDto } from '../../../../domain.types/clinical/assessment/assessment.question.response.dto';
import { AssessmentNodeType, CAssessmentListNode } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentHelperRepo } from '../../../../database/sql/sequelize/repositories/clinical/assessment/assessment.helper.repo';
import { CustomActionsHandler } from '../../../../custom/custom.actions.handler';
import { AssessmentDto } from '../../../../domain.types/clinical/assessment/assessment.dto';
import { Logger } from '../../../../common/logger';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentController extends BaseController{

    //#region member variables and constructors

    _service: AssessmentService = null;

    _serviceHelperRepo: AssessmentHelperRepo = null;

    _careplanService: CareplanService = null;

    _userTaskService: UserTaskService = null;

    _validator: AssessmentValidator = new AssessmentValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor() {
        super();
        this._service = Loader.container.resolve(AssessmentService);
        this._serviceHelperRepo = Loader.container.resolve(AssessmentHelperRepo);
        this._careplanService = Loader.container.resolve(CareplanService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.Create', request, response);

            const model = await this._validator.create(request);
            const assessment = await this._service.create(model);
            if (assessment == null) {
                throw new ApiError(400, 'Cannot create record for assessment!');
            }

            ResponseHandler.success(request, response, 'Assessment record created successfully!', 201, {
                Assessment : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }

            ResponseHandler.success(request, response, 'Assessment record retrieved successfully!', 200, {
                Assessment : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} assessment records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                AssessmentRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update assessment record!');
            }

            ResponseHandler.success(request, response, 'Assessment record updated successfully!', 200, {
                Assessment : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Assessment record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Assessment record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    startAssessment = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.StartAssessment', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            const next = await this._service.startAssessment(id);

            ResponseHandler.success(request, response, 'Assessment started successfully!', 200, {
                Next : next,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    scoreAssessment = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.StartAssessment', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            if (assessment.ScoringApplicable) {
                var { score, reportUrl } = await this.generateScoreReport(assessment);
                ResponseHandler.success(request, response, 'Assessment started successfully!', 200, {
                    AssessmentId : assessment.id,
                    Score        : score,
                    ReportUrl    : reportUrl,
                });
            }
            else {
                ResponseHandler.failure(request, response, `This assessment does not have scoring!`, 400);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getNextQuestion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.GetNextQuestion', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            const progressStatus: ProgressStatus = await this._service.getAssessmentStatus(id);
            if (progressStatus === ProgressStatus.Pending) {
                const next = await this._service.startAssessment(id);
                ResponseHandler.success(request, response, 'Assessment next question retrieved successfully!', 200, {
                    Next : next,
                });
            }
            else if (progressStatus === ProgressStatus.InProgress) {
                const next = await this._service.getNextQuestion(id);
                if (next === null) {
                    await this.completeAssessmentTask(id);
                    ResponseHandler.failure(request, response, 'Assessment has already completed!', 422);
                    return;
                }
                ResponseHandler.success(request, response, 'Assessment next question retrieved successfully!', 200, {
                    Next : next,
                });
            }
            else if (progressStatus === ProgressStatus.Completed) {
                ResponseHandler.failure(request, response, 'The assessment is already completed!', 404);
            }
            else if (progressStatus === ProgressStatus.Cancelled) {
                ResponseHandler.failure(request, response, 'The assessment is cancelled!', 404);
            }
            else {
                ResponseHandler.failure(request, response, 'The assessment is in invalid state!', 404);
            }

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getQuestionById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.GetQuestionById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            const questionId: uuid = await this._validator.getParamUuid(request, 'questionId');
            const question = await this._service.getQuestionById(id, questionId);
            if (question == null) {
                throw new ApiError(404, 'Assessment question not found.');
            }
            ResponseHandler.success(request, response, 'Assessment question retrieved successfully!', 200, {
                Question : question,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    answerQuestion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.AnswerQuestion', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const questionId: uuid = await this._validator.getParamUuid(request, 'questionId');
            const answerModel = await this._validator.answerQuestion(request);

            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }

            const question = await this._service.getQuestionById(id, questionId);
            if (question == null) {
                throw new ApiError(404, 'Assessment question not found.');
            }

            const isAnswered = await this._service.isAnswered(assessment.id, questionId);
            if (isAnswered) {
                throw new ApiError(400, `The question has already been answered!`);
            }

            var answerResponse: AssessmentQuestionResponseDto =
                await this._service.answerQuestion(answerModel);

            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(answerResponse.Parent.PatientUserId);
            var options = await this._service.getQuestionById(assessment.id, answerResponse.Answer.NodeId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(answerResponse, assessment, options, appName);   
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${answerResponse.Parent.PatientUserId}`);
            }

            const isAssessmentCompleted = answerResponse === null || answerResponse?.Next === null;
            if ( isAssessmentCompleted) {
                //Assessment has no more questions left and is completed successfully!
                await this.completeAssessmentTask(id);
                //If the assessment has scoring enabled, score the assessment
                if (assessment.ScoringApplicable) {
                    var { score, reportUrl } = await this.generateScoreReport(assessment);
                    if (score) {
                        answerResponse['AssessmentScore'] = score;
                        answerResponse['AssessmentScoreReport'] = reportUrl;
                    }
                }
                if (eligibleAppNames.length > 0) {
                    var updatedAssessment = await this._service.getById(assessment.id);
                    for await (var appName of eligibleAppNames) { 
                        this._service.addEHRRecord(null, updatedAssessment, null, appName);
                    }
                } else {
                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${answerResponse.Parent.PatientUserId}`);
                }
                ResponseHandler.success(request, response, 'Assessment has completed successfully!', 200, {
                    AnswerResponse : answerResponse,
                });
                return;
            }
            ResponseHandler.success(request, response, 'Assessment question answered successfully!', 200, {
                AnswerResponse : answerResponse,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    answerQuestionList = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Assessment.AnswerQuestionList', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const listId: uuid = await this._validator.getParamUuid(request, 'listId');

            const node = await this._service.getNodeById(listId);
            Logger.instance().log(`Node: ${JSON.stringify(node)}`);

            if (!node || node?.NodeType !== AssessmentNodeType.NodeList) {
                throw new ApiError(404, 'Question list not found!');
            }
            const listNode: CAssessmentListNode = node as CAssessmentListNode;
            if (listNode.ServeListNodeChildrenAtOnce === false) {
                throw new ApiError(400, 'Cannot accept array of answers for this list. Answer questions one by one!');
            }
            const childrenIds = listNode.ChildrenNodeIds;

            const answerModels = await this._validator.answerQuestionList(request);
            const answeredQuestionIds = answerModels.map(x => x.QuestionNodeId);

            if (childrenIds.length !== answeredQuestionIds.length) {
                throw new ApiError(400, 'Discrepancy in answered question list!');
            }

            for (var q of answeredQuestionIds) {
                if (!childrenIds.includes(q)) {
                    throw new ApiError(400, 'Discrepancy in answered question list!');
                }
            }

            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }

            var answerResponse = await this._service.answerQuestionList(assessment.id, listNode, answerModels);
            Logger.instance().log(`AnswerResponse: ${JSON.stringify(answerResponse)}`);

            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(answerResponse.Parent.PatientUserId);
            if (eligibleAppNames.length > 0) {
                var updatedAssessment = await this._service.getById(assessment.id);
                for await (var appName of eligibleAppNames) {
                    for await (var ar of answerResponse.Answer) {
                        ar = JSON.parse(JSON.stringify(ar));
                        ar.Answer['SubQuestion']  = ar.Answer.Title;
                        ar.Answer.Title = listNode.Title;
                        this._service.addEHRRecord(ar, assessment, ar.Parent, appName);
                    }
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${answerResponse.Parent.PatientUserId}`);
            }
            answerResponse['AssessmentScore'] = null;

            const isAssessmentCompleted = answerResponse === null || answerResponse?.Next === null;
            if ( isAssessmentCompleted) {
                //Assessment has no more questions left and is completed successfully!
                await this.completeAssessmentTask(id);

                //If the assessment has scoring enabled, score the assessment
                if (assessment.ScoringApplicable) {
                    var { score, reportUrl } = await this.generateScoreReport(assessment);
                    if (score) {
                        answerResponse['AssessmentScore'] = score;
                        answerResponse['AssessmentScoreReport'] = reportUrl;
                    }
                }
                if (eligibleAppNames.length > 0) {
                    var updatedAssessment = await this._service.getById(assessment.id);
                    updatedAssessment['Score'] = JSON.stringify(answerResponse['AssessmentScore']);
                    for await (var appName of eligibleAppNames) {
                        this._service.addEHRRecord(null, updatedAssessment, null, appName);
                    }
                } else {
                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${answerResponse.Parent.PatientUserId}`);
                }
                ResponseHandler.success(request, response, 'Assessment has completed successfully!', 200, {
                    AnswerResponse : answerResponse,
                });
                return;
            }

            ResponseHandler.success(request, response, 'Assessment question list answered successfully!', 200, {
                AnswerResponse : answerResponse,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }

    };

    //#endregion

    //#region Privates

    private async completeAssessmentTask(assessmentId: uuid) {
        var assessment = await this._service.completeAssessment(assessmentId);
        var parentActivityId = assessment.ParentActivityId;
        if (parentActivityId !== null) {
            var activity = await this._careplanService.getAction(parentActivityId);
            if (activity !== null) {
                var userTaskId = activity.UserTaskId;
                await this._userTaskService.finishTask(userTaskId);
            }
            await this._careplanService.completeAction(parentActivityId, new Date(), true, assessment);
        }
        else {
            var task = await this._userTaskService.getByActionId(assessmentId);
            if (task) {
                await this._userTaskService.finishTask(task.id);
            }
        }

    }

    private async generateScoreReport(assessment: AssessmentDto) {

        var customActions = new CustomActionsHandler();

        var score = await customActions.performActions_PostAssessmentScoring(
            assessment.PatientUserId, assessment.id);

        Logger.instance().log(`Score: ${JSON.stringify(score, null, 2)}`);

        const reportUrl = await customActions.performActions_GenerateAssessmentReport(
            assessment.PatientUserId, assessment.id, score);

        Logger.instance().log(`Report Url: ${JSON.stringify(reportUrl, null, 2)}`);

        const scoreStr = JSON.stringify(score);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updatedAssessment = await this._service.update(assessment.id, {
            ScoreDetails : scoreStr,
            ReportUrl    : reportUrl
        });

        return { score, reportUrl };
    }

    //#endregion

}

import express from 'express';
import { ProgressStatus, uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { AssessmentService } from '../../../../services/clinical/assessment/assessment.service';
import { CareplanService } from '../../../../services/clinical/careplan.service';
import { UserTaskService } from '../../../../services/user/user.task.service';
import { Loader } from '../../../../startup/loader';
import { AssessmentValidator } from '../../../validators/clinical/assessment/assessment.validator';
import { BaseController } from '../../base.controller';
import { AssessmentQuestionResponseDto } from '../../../../domain.types/clinical/assessment/assessment.question.response.dto';
import { AssessmentType } from '../../../../domain.types/clinical/assessment/assessment.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentController extends BaseController{

    //#region member variables and constructors

    _service: AssessmentService = null;

    _careplanService: CareplanService = null;

    _userTaskService: UserTaskService = null;

    _validator: AssessmentValidator = new AssessmentValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(AssessmentService);
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
            
            ResponseHandler.success(request, response, 'Assessment record started successfully!', 200, {
                Next : next,
            });
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

            const answerResponse: AssessmentQuestionResponseDto =
                await this._service.answerQuestion(answerModel);

            if (answerResponse.Next === null) {
                //Assessment has no more questions left and is completed successfully!
                await this.completeAssessmentTask(id);
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

    private async completeAssessmentTask(assessmentId: uuid) {
        var assessment = await this._service.completeAssessment(assessmentId);
        var parentActivityId = assessment.ParentActivityId;
        if (assessment.Type === AssessmentType.Careplan && parentActivityId !== null) {
            var activity = await this._careplanService.getAction(parentActivityId);
            if (activity !== null) {
                var userTaskId = activity.UserTaskId;
                await this._userTaskService.finishTask(userTaskId);
            }
            await this._careplanService.completeAction(parentActivityId, new Date(), true);
        }
    }

    //#endregion

}

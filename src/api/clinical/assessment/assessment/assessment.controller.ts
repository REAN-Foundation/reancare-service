import express from 'express';
import { ProgressStatus, uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { AssessmentService } from '../../../../services/clinical/assessment/assessment.service';
import { CareplanService } from '../../../../services/clinical/careplan.service';
import { UserTaskService } from '../../../../services/users/user/user.task.service';
import { Injector } from '../../../../startup/injector';
import { AssessmentValidator } from './assessment.validator';
import { AssessmentQuestionResponseDto } from '../../../../domain.types/clinical/assessment/assessment.question.response.dto';
import { AssessmentNodeType, AssessmentType, CAssessmentListNode } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentHelperRepo } from '../../../../database/sql/sequelize/repositories/clinical/assessment/assessment.helper.repo';
import { CustomActionsHandler } from '../../../../custom/custom.actions.handler';
import { AssessmentDto } from '../../../../domain.types/clinical/assessment/assessment.dto';
import { Logger } from '../../../../common/logger';
import { EHRAssessmentService } from '../../../../modules/ehr.analytics/ehr.services/ehr.assessment.service';
import { BaseController } from '../../../../api/base.controller';
import { AssessmentDomainModel, AssessmentSubmissionDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { AssessmentSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.search.types';
import { EHRPatientService } from '../../../../modules/ehr.analytics/ehr.services/ehr.patient.service';
import { HealthProfileService } from '../../../../services/users/patient/health.profile.service';
import { AssessmentEvents } from '../assessment.events';
import { ActivityTrackerHandler } from '../../../../services/users/patient/activity.tracker/activity.tracker.handler';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { AssessmentTemplateService } from '../../../../services/clinical/assessment/assessment.template.service';
import { TenantService } from '../../../../services/tenant/tenant.service';
import { AssessmentWhatsappFormSubmissionService } from '../../../../services/clinical/assessment/assessment.whatsapp.form.submission.service';
import { AssessmentHelperService } from '../../../../services/clinical/assessment/assessment.helper';
import { PatientDomainModel } from '../../../../domain.types/users/patient/patient/patient.domain.model';
import { UserHelper } from '../../../../api/users/user.helper';
import { UserService } from '../../../../services/users/user/user.service';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { Roles } from '../../../../domain.types/role/role.types';
import { DoctorDomainModel } from '../../../../domain.types/users/doctor/doctor.domain.model';
import { UserBasicDetails, UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { PersonDetailsDto } from '../../../../domain.types/person/person.dto';
import { RoleService } from '../../../../services/role/role.service';
import { UserDetailsDto } from '../../../../domain.types/users/user/user.dto';
import { PersonService } from '../../../../services/person/person.service';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentController extends BaseController {

    //#region member variables and constructors

    _service = Injector.Container.resolve(AssessmentService);

    _serviceHelperRepo = Injector.Container.resolve(AssessmentHelperRepo);

    _careplanService = Injector.Container.resolve(CareplanService);

    _userTaskService = Injector.Container.resolve(UserTaskService);

    _ehrAssessmentService = Injector.Container.resolve(EHRAssessmentService);

    _ehrPatientService = Injector.Container.resolve(EHRPatientService);

    _healthProfileService = Injector.Container.resolve(HealthProfileService);

    _patientService = Injector.Container.resolve(PatientService);

    _assessmentTemplateService = Injector.Container.resolve(AssessmentTemplateService);

    _tenantService = Injector.Container.resolve(TenantService);

    _userHelper: UserHelper = new UserHelper();

    _assessmentWhatsappFormSubmissionService = Injector.Container.resolve(AssessmentWhatsappFormSubmissionService);

    _validator: AssessmentValidator = new AssessmentValidator();

   _userService: UserService = Injector.Container.resolve(UserService);
   
     _roleService: RoleService = Injector.Container.resolve(RoleService);
     
    _personService: PersonService = Injector.Container.resolve(PersonService);

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: AssessmentDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId);
            const assessment = await this._service.create(model);
            if (assessment == null) {
                throw new ApiError(400, 'Cannot create record for assessment!');
            }

            AssessmentEvents.onAssessmentCreated(request, assessment, 'assessment');

            ResponseHandler.success(request, response, 'Assessment record created successfully!', 201, {
                Assessment : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            ResponseHandler.success(request, response, 'Assessment record retrieved successfully!', 200, {
                Assessment : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message = count === 0 ? 'No records found!' : `Total ${count} assessment records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                AssessmentRecords : searchResults,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Assessment record cannot be deleted.');
            }

            AssessmentEvents.onAssessmentDeleted(request, record, 'assessment');

            ResponseHandler.success(request, response, 'Assessment record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    startAssessment = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const next = await this._service.startAssessment(id);

            AssessmentEvents.onAssessmentStarted(request, record, 'assessment');

            ResponseHandler.success(request, response, 'Assessment started successfully!', 200, {
                Next : next,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    scoreAssessment = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            if (record.ScoringApplicable) {
                const { score, reportUrl } = await this.generateScoreReport(record);
                ResponseHandler.success(request, response, 'Assessment started successfully!', 200, {
                    AssessmentId : record.id,
                    Score        : score,
                    ReportUrl    : reportUrl,
                });
            } else {
                ResponseHandler.failure(request, response, `This assessment does not have scoring!`, 400);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getNextQuestion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, assessment.PatientUserId);
            const progressStatus: ProgressStatus = await this._service.getAssessmentStatus(id);
            if (progressStatus === ProgressStatus.Pending) {
                const next = await this._service.startAssessment(id);
                ResponseHandler.success(request, response, 'Assessment next question retrieved successfully!', 200, {
                    Next : next,
                });
            } else if (progressStatus === ProgressStatus.InProgress) {
                const next = await this._service.getNextQuestion(id);
                if (next === null) {
                    await this.completeAssessmentTask(id);
                    ResponseHandler.failure(request, response, 'Assessment has already completed!', 422);
                    return;
                }
                ResponseHandler.success(request, response, 'Assessment next question retrieved successfully!', 200, {
                    Next : next,
                });
            } else if (progressStatus === ProgressStatus.Completed) {
                ResponseHandler.failure(request, response, 'The assessment is already completed!', 404);
            } else if (progressStatus === ProgressStatus.Cancelled) {
                ResponseHandler.failure(request, response, 'The assessment is cancelled!', 404);
            } else {
                ResponseHandler.failure(request, response, 'The assessment is in invalid state!', 404);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getQuestionById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, assessment.PatientUserId);
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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const questionId: uuid = await this._validator.getParamUuid(request, 'questionId');
            const answerModel = await this._validator.answerQuestion(request);

            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, assessment.PatientUserId);
            const question = await this._service.getQuestionById(id, questionId);
            if (question == null) {
                throw new ApiError(404, 'Assessment question not found.');
            }

            const isAnswered = await this._service.isAnswered(assessment.id, questionId);
            if (isAnswered) {
                throw new ApiError(400, `The question has already been answered!`);
            }

            var answerResponse: AssessmentQuestionResponseDto = await this._service.answerQuestion(answerModel);

            await this._ehrAssessmentService.addEHRRecordForAppNames(assessment, answerResponse, question);

            //check if questions are related to race and ethnicity
            if (assessment.Provider && assessment.Provider === 'REAN' ) {
                await this.updateHealthProfileAndEhrDataForPatient(answerResponse, question, assessment);
            }

            const isAssessmentCompleted = answerResponse === null || answerResponse?.Next === null;
            if (isAssessmentCompleted) {
                //Assessment has no more questions left and is completed successfully!
                Logger.instance().log(`above completeAssessmentTask`);
                await this.completeAssessmentTask(id);
                Logger.instance().log(`below completeAssessmentTask`);
                //If the assessment has scoring enabled, score the assessment
                if (assessment.ScoringApplicable) {
                    var { score, reportUrl } = await this.generateScoreReport(assessment);
                    if (score) {
                        answerResponse['AssessmentScore'] = score;
                        answerResponse['AssessmentScoreReport'] = reportUrl;
                    }
                }
                var updatedAssessment = await this._service.getById(assessment.id);
                await this._ehrAssessmentService.addEHRRecordForAppNames(updatedAssessment, null, null);

                AssessmentEvents.onAssessmentCompleted(request, updatedAssessment, 'assessment');
            }

            const message = isAssessmentCompleted
                ? 'Assessment has completed successfully!'
                : 'Assessment question answered successfully!';

            AssessmentEvents.onAssessmentQuestionAnswered(request, answerResponse, assessment, 'assessment');

            ResponseHandler.success(request, response, message, 200, { AnswerResponse: answerResponse });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    answerQuestionList = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const listId: uuid = await this._validator.getParamUuid(request, 'listId');

            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, assessment.PatientUserId);

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
            const answeredQuestionIds = answerModels.map((x) => x.QuestionNodeId);

            if (childrenIds.length !== answeredQuestionIds.length) {
                throw new ApiError(400, 'Discrepancy in answered question list!');
            }

            for (var q of answeredQuestionIds) {
                if (!childrenIds.includes(q)) {
                    throw new ApiError(400, 'Discrepancy in answered question list!');
                }
            }

            var answerResponse = await this._service.answerQuestionList(assessment.id, listNode, answerModels);
            Logger.instance().log(`AnswerResponse: ${JSON.stringify(answerResponse)}`);

            for await (var ar of answerResponse.Answer) {
                ar = JSON.parse(JSON.stringify(ar));
                ar.Answer['SubQuestion']  = ar.Answer.Title;
                ar.Answer.Title = listNode.Title;
                this._ehrAssessmentService.addEHRRecordForAppNames(assessment, ar, ar.Parent);
            }

            answerResponse['AssessmentScore'] = null;

            const isAssessmentCompleted = answerResponse === null || answerResponse?.Next === null;
            if (isAssessmentCompleted) {
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
                var updatedAssessment = await this._service.getById(assessment.id);
                updatedAssessment['Score'] = JSON.stringify(answerResponse['AssessmentScore']);
                await this._ehrAssessmentService.addEHRRecordForAppNames(updatedAssessment, null, null);

                AssessmentEvents.onAssessmentCompleted(request, updatedAssessment, 'assessment');
            }

            const message = isAssessmentCompleted
                ? 'Assessment has completed successfully!'
                : 'Assessment question list answered successfully!';
            
            const answerRes = answerResponse.Answer.length > 0 ? answerResponse.Answer[0] : null;
            AssessmentEvents.onAssessmentQuestionAnswered(request, answerRes, assessment, 'assessment');

            ResponseHandler.success(request, response, message, 200, { AnswerResponse: answerResponse });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    skipQuestion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const questionId: uuid = await this._validator.getParamUuid(request, 'questionId');

            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment record not found.');
            }
            await this.authorizeOne(request, assessment.PatientUserId);

            const question = await this._service.getQuestionById(id, questionId);
            if (question == null) {
                throw new ApiError(404, 'Assessment question not found.');
            }

            const isAnswered = await this._service.isAnswered(assessment.id, questionId);
            if (isAnswered) {
                throw new ApiError(400, `The question has already been answered!`);
            }

            if (question.Required) {
                throw new ApiError(400, `The question is not skippable!`);
            }
            //Check if the question is of type list
            if (question.NodeType !== AssessmentNodeType.Question) {
                throw new ApiError(400, `The node is not skippable!`);
            }

            var skipResponse: AssessmentQuestionResponseDto = await this._service.skipQuestion(id, questionId);
            const isAssessmentCompleted = skipResponse === null || skipResponse?.Next === null;
            if (isAssessmentCompleted) {
                //Assessment has no more questions left and is completed successfully!
                await this.completeAssessmentTask(id);
                //If the assessment has scoring enabled, score the assessment
                if (assessment.ScoringApplicable) {
                    var { score, reportUrl } = await this.generateScoreReport(assessment);
                    if (score) {
                        skipResponse['AssessmentScore'] = score;
                        skipResponse['AssessmentScoreReport'] = reportUrl;
                    }
                }
                var updatedAssessment = await this._service.getById(assessment.id);
                updatedAssessment['Score'] = JSON.stringify(skipResponse['AssessmentScore']);
                await this._ehrAssessmentService.addEHRRecordForAppNames(updatedAssessment, null, null);

                AssessmentEvents.onAssessmentCompleted(request, updatedAssessment, 'assessment');
            }

            const message = skipResponse === null || skipResponse?.Next === null
                ? 'Assessment has completed successfully!'
                : 'Assessment question skipped successfully!';

            AssessmentEvents.onAssessmentQuestionSkipped(request, skipResponse, assessment, 'assessment');

            ResponseHandler.success(request, response, message, 200, { AnswerResponse: skipResponse });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    submitAtOnce = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this._validator.getParamUuid(request, 'templateId');
            await this._validator.getParamStr(request, 'submissionType');
            
            const submissionModel: AssessmentSubmissionDomainModel = await this._validator.submitAtOnce(request);
            await this.authorizeOne(request, submissionModel.PatientUserId);
            
            const patient = await this._patientService.getByUserId(submissionModel.PatientUserId);
            if (patient == null) {
                throw new ApiError(404, 'Patient not found.');
            }

            const template = await this._assessmentTemplateService.getById(submissionModel.AssessmentTemplateId);
            if (template == null) {
                throw new ApiError(404, 'Assessment template not found.');
            }

            const tenant = await this._tenantService.getById(submissionModel.TenantId);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            
            const completedAssessment = await this._assessmentWhatsappFormSubmissionService.submitAtOnce(submissionModel);
            
            let message = 'Assessment submitted successfully.';
            if (completedAssessment.Type === AssessmentType.UserRegistration) {
                const status = await this.registerAssessmentTargetUser(completedAssessment.id, submissionModel.TenantId);
                message = message + ' ' + status;
            }

            if (completedAssessment.Type === AssessmentType.Clinical) {
                const status = await this.verifyAssessmentTargetUser(completedAssessment.id, submissionModel.TenantId);
                message = message + ' ' + status;
            }

            ResponseHandler.success(request, response, message, 200, { Assessment: completedAssessment });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private verifyAssessmentTargetUser = async (assessmentId: uuid, tenantId: uuid =  null) => {
        try {
            const assessment = await this._service.getById(assessmentId);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment not found.');
            }
            const userData = AssessmentHelperService.extractFieldIdentifierData(assessment);
            const userName = this._validator.validateAssessmentTargetUser(userData);
            if (!userName) {
                return;
            }
            const user = await this._userService.getByUserName(userName);
            if (user == null) {
                throw new ApiError(404, 'Invalid user name. Please resubmit the assessment with valid user name.');
            }
            return 'EMR Id ' + userName + ' validated successfully.';
        } catch (error) {
            Logger.instance().log(`Error in post user validation: ${error}`);
            await this._service.delete(assessmentId);
            return error.message || 'Unable to validate user.';
        }
    };

    private registerAssessmentTargetUser  = async (assessmentId: uuid, tenantId: uuid =  null) => {
        try {
            const assessment = await this._service.getById(assessmentId);
            if (assessment == null) {
                throw new ApiError(404, 'Assessment not found.');
            }
            const template = await this._assessmentTemplateService.getById(assessment.AssessmentTemplateId);
            if (template == null) {
                throw new ApiError(404, 'Assessment template not found.');
            }
            const rawData = template.RawData ?? null;

            const userRole: Roles  = AssessmentHelperService.extractUserRole(rawData);

            const userData = AssessmentHelperService.extractFieldIdentifierData(assessment);
            const model: PersonDomainModel = this._validator.userRegistration(userData);

            const createdUser = await this.createUser(model, userRole, tenantId);

            if (createdUser) {
                return `Welcome ${createdUser.Person?.FirstName ?? 'Dear'} ${createdUser.Person?.LastName ?? ''}!. Please note your username is ${createdUser.UserName}`;
            }

            throw new ApiError(400, `User already exists with the Phone ${createdUser?.Person?.Phone} and user name is ${createdUser?.UserName}`);
        } catch (error) {
            Logger.instance().log(`Error in post user registration: ${error}`);
            await this._service.delete(assessmentId);
            return error.message || 'Unable to register user.';
        }
    
    };
    
    private createUser = async (model: PersonDomainModel, userRole: Roles, tenantId: uuid) => {
        if (userRole === Roles.Patient) {
            return await this.createPatientUser(model, tenantId);
        }
    
        if (userRole === Roles.Doctor) {
            return await this.createDoctorUser(model, tenantId);
        }
    
        return await this.createGenericUser(model, userRole, tenantId);
    };

    private async createPatientUser(model: PersonDomainModel, tenantId: uuid) {
        const patientDomainModel: PatientDomainModel = {
            User : {
                Person : model
            },
            HealthProfile : {
                BloodGroup           : null,
                BloodTransfusionDate : null,
                BloodDonationCycle   : null,
                OtherInformation     : null,
            },
            UserId                        : null,
            Address                       : null,
            CohortId                      : null,
            ExternalMedicalRegistrationId : null,
            GenerateOtp                   : true,
        };
    
        if (tenantId) {
            patientDomainModel.User.TenantId = tenantId;
        }
    
        const [patient, createdNew] = await this._userHelper.createPatient(patientDomainModel);
    
        if (createdNew) {
            return await this._userService.getById(patient.User.id);
        }
    
        return patient.User;
    }
    
    private async createDoctorUser(model: PersonDomainModel, tenantId: uuid) {
        const doctorDomainModel: DoctorDomainModel = {
            User : { Person: model },
        };
    
        if (tenantId) {
            doctorDomainModel.User.TenantId = tenantId;
        }
    
        const [doctor, createdNew] = await this._userHelper.createDoctor(doctorDomainModel);
    
        if (createdNew) {
            return await this._userService.getById(doctor.User.id);
        }
    
        return doctor.User;
    }
    
    private async createGenericUser(model: PersonDomainModel, userRole: Roles, tenantId: uuid) {
        const userDomainModel: UserDomainModel = { Person: model };
    
        if (tenantId) {
            userDomainModel.TenantId = tenantId;
        }
    
        const role = await this._roleService.getByName(userRole);
        userDomainModel.RoleId = role?.id;
    
        let person: PersonDetailsDto = null;
        let user: UserDetailsDto = null;

        const basicDetails: UserBasicDetails = {
            Phone      : userDomainModel.Person.Phone,
            Email      : userDomainModel.Person.Email,
            UserName   : userDomainModel.UserName,
            TenantId   : userDomainModel.TenantId,
            TenantCode : userDomainModel.TenantCode,
        };
    
        await this._userHelper.performDuplicatePersonCheck(basicDetails.Phone, basicDetails.Email);
    
        const existingPerson = await this._userService.getExistingPerson(basicDetails);
    
        if (existingPerson == null) {
            person = await this._personService.create(userDomainModel.Person);
            if (person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
        }
        else {
            person = existingPerson;
            var existingUserWithRole = await this._userService.getUserByPersonIdAndRole(
                existingPerson.id, userDomainModel.RoleId
            );
            if (existingUserWithRole) {
                throw new ApiError(409, `User already exists with the same role.`);
            }
            await this._userHelper.checkMultipleAdministrativeRoles(userDomainModel.RoleId, existingPerson.id);
        }

        userDomainModel.Person.id = person.id;

        const updatedPerson = await this._userHelper.updatePersonInformation(person, userDomainModel);

        if (!updatedPerson) {
            throw new ApiError(409, `User already exists with the same email.`);
        }

        if (!userDomainModel.UserName) {
            userDomainModel.UserName = await this._userService.generateUserName(
                userDomainModel.Person.FirstName, userDomainModel.Person.LastName
            );
        }

        user = await this._userService.create(userDomainModel);
        if (user == null) {
            throw new ApiError(400, 'Cannot create user!');
        }
        return await this._userService.getById(user.id);
    }

    private async completeAssessmentTask(assessmentId: uuid) {
        var assessment = await this._service.completeAssessment(assessmentId);
        var parentActivityId = assessment.ParentActivityId;
        if (parentActivityId !== null) {
            var activity = await this._careplanService.getAction(parentActivityId);
            if (activity !== null) {
                var userTaskId = activity.UserTaskId;
                await this._userTaskService.finishTask(userTaskId);
                ActivityTrackerHandler.addOrUpdateActivity({
                    PatientUserId      : assessment.PatientUserId,
                    RecentActivityDate : new Date(),
                });
            }
            await this._careplanService.completeAction(parentActivityId, new Date(), true, assessment);
        } else {
            var task = await this._userTaskService.getByActionId(assessmentId);
            if (task) {
                await this._userTaskService.finishTask(task.id);
                ActivityTrackerHandler.addOrUpdateActivity({
                    PatientUserId      : assessment.PatientUserId,
                    RecentActivityDate : new Date(),
                });
            }
        }
        if (assessment.Type === AssessmentType.UserRegistration) {
            await this.registerAssessmentTargetUser(assessmentId);
        }
        if (assessment.Type === AssessmentType.Clinical) {
            await this.verifyAssessmentTargetUser(assessmentId);
        }
    }

    private async generateScoreReport(assessment: AssessmentDto) {
        var customActions = new CustomActionsHandler();

        var score = await customActions.performActionsPostAssessmentScoring(assessment.PatientUserId, assessment.id);

        Logger.instance().log(`Score: ${JSON.stringify(score, null, 2)}`);

        const reportUrl = await customActions.performActions_GenerateAssessmentReport(
            assessment.PatientUserId,
            assessment.id,
            score
        );

        Logger.instance().log(`Report Url: ${JSON.stringify(reportUrl, null, 2)}`);

        const scoreStr = JSON.stringify(score);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updatedAssessment = await this._service.update(assessment.id, {
            ScoreDetails : scoreStr,
            ReportUrl    : reportUrl,
        });

        return { score, reportUrl };
    }

    private async updateHealthProfileAndEhrDataForPatient(answerResponse: any, question : any, assessment: AssessmentDto) {
        try {
            var updated = null;
            if (question.Title && question.Title.includes('What is your race?')) {
                updated = {
                    Race : answerResponse.Answer.ChosenOption.Text
                };
    
                Logger.instance().log(`Race Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
    
            } else if (question.Title && question.Title.includes('What is your ethnicity?')) {
                updated = {
                    Ethnicity : answerResponse.Answer.ChosenOption.Text
                };
    
                Logger.instance().log(`Ethnicity Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
    
            } else if (question.Title && question.Title.includes('What is your marital status?')) {
                updated = {
                    MaritalStatus : answerResponse.Answer.ChosenOption.Text
                };
                Logger.instance().log(`Marital status Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
            } else if (question.Title && question.Title.includes('Do you currently smoke')) {
                updated = {
                    IsSmoker : answerResponse.Answer.ChosenOption.Text === 'Yes' ? 1 : 0
                };
                Logger.instance().log(`Is smoking Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
            } else if (question.Title && question.Title.includes('survivor or caregiver')) {
                updated = {
                    StrokeSurvivorOrCaregiver : answerResponse.Answer.ChosenOption.Text
                };
                Logger.instance().log(`Survivor or Caregiver Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
            } else if (question.Title && question.Title.includes('live alone')) {
                updated = {
                    LivingAlone : answerResponse.Answer.ChosenOption.Text === 'Yes' ? 1 : 0
                };
                Logger.instance().log(`Live alone Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
            } else if (question.Title && question.Title.includes('work prior to your stroke')) {
                updated = {
                    WorkedPriorToStroke : answerResponse.Answer.ChosenOption.Text === 'Yes' ? 1 : 0
                };
                Logger.instance().log(`Work prior to your stroke Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
            } else if (question.Title && question.Title.includes('alcoholic drink')) {
                updated = {
                    IsDrinker : answerResponse.Answer.ChosenOption.Text === 'Yes' ? 1 : 0
                };
                Logger.instance().log(`Alcoholic drink Question and Answer :: ${JSON.stringify(question.Title)} :: ${JSON.stringify(updated)}`);
            }
    
            if (updated) {
                Logger.instance().log(`Updating patient profile and EHR data : ${assessment.PatientUserId}`);
                await this._healthProfileService.updateByPatientUserId(assessment.PatientUserId, updated);
                updated['PatientUserId'] = assessment.PatientUserId;
                await this._ehrPatientService.addEHRRecordHealthProfileForAppNames(updated);
                return true;
            }
    
            return false;
    
        } catch (error) {
            Logger.instance().log(`Error in updating health profile & ehr static data through assessment: ${error}`);
        }
        
    }

    //#endregion

    //#region Authorization

    authorizeSearch = async (
        request: express.Request,
        searchFilters: AssessmentSearchFilters): Promise<AssessmentSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };

    //#endregion

}

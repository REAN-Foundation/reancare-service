import { PatientService } from '../services/patient/patient.service';
import { Loader } from '../startup/loader';
import { PatientDetailsDto } from '../domain.types/patient/patient/patient.dto';
import { TimeHelper } from '../common/time.helper';
import { CustomTaskDomainModel } from '../domain.types/user/custom.task/custom.task.domain.model';
import { UserTaskCategory } from '../domain.types/user/user.task/user.task.types';
import { Logger } from '../common/logger';
import { AssessmentTemplateService } from '../services/clinical/assessment/assessment.template.service';
import { AssessmentService } from '../services/clinical/assessment/assessment.service';
import { UserTaskService } from '../services/user/user.task.service';
import { UserTaskSearchFilters } from '../domain.types/user/user.task/user.task.search.types';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { CommonActions } from './common.actions';
import { EnrollmentDomainModel } from '../domain.types/clinical/careplan/enrollment/enrollment.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class AHAActions {

    _commonActions: CommonActions = new CommonActions();

    _assessmentService: AssessmentService = null;

    _patientService: PatientService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    constructor() {
        this._patientService = Loader.container.resolve(PatientService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
    }

    //#region Public

    public performActions_PostRegistration = async (patient: PatientDetailsDto) => {
        try {
            await this.createAHAHealthSurveyTask(patient);
            await this._commonActions.createAssessmentTask(patient.UserId, 'Quality of Life Questionnaire');
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public scheduledMonthlyRecurrentTasks = async () => {
        try {
            const patientUserIds = await this._patientService.getAllPatientUserIds();
            Logger.instance().log(`Patients being processed for custom task: ${JSON.stringify(patientUserIds.length)}`);
            for await (var patientUserId of patientUserIds) {
                const assessmentTemplateName = 'Quality of Life Questionnaire';
                await this.triggerAssessmentTask_QualityOfLife(patientUserId, assessmentTemplateName);
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public performActions_PostCareplanEnrollment = async (model: EnrollmentDomainModel) => {
        try {
            //Please move post enrollment actions here...
            Logger.instance().log(`Performing post careplan enrollment actions ...`);
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public performActions_PostAssessmentScoring = async (patientUserId: uuid, assessmentId: uuid) => {
        try {
            Logger.instance().log(`Performing post assessment scoring actions ...`);
            const assessment = await this._assessmentService.getById(assessmentId);
            const userResponses = assessment.UserResponses;
            Logger.instance().log(`${JSON.stringify(userResponses, null, 2)}`);
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    //#endregion

    //#region Privates

    private createAHAHealthSurveyTask = async (patient: PatientDetailsDto) => {

        //Add AHA specific tasks, events and handlers here...
        const userId = patient.User.id;

        //Adding survey task for AHA patients
        const domainModel: CustomTaskDomainModel = {
            UserId      : userId,
            Task        : "Survey",
            Description : "Take a survey to help us understand you better!",
            Category    : UserTaskCategory.Custom,
            Details     : {
                Link : "https://americanheart.co1.qualtrics.com/jfe/form/SV_b1anZr9DUmEOsce",
            },
            ScheduledStartTime : new Date(),
            ScheduledEndTime   : new Date("2022-10-31 23:59:59")
        };

        const task = await this._commonActions.createCustomTask(domainModel);
        if (task == null) {
            Logger.instance().log('Unable to create AHA survey task!');
        }

    };

    private triggerAssessmentTask_QualityOfLife = async (
        patientUserId: uuid,
        assessmentTemplateName: string): Promise<void> => {

        const filters: UserTaskSearchFilters = {
            UserId       : patientUserId,
            Task         : assessmentTemplateName,
            OrderBy      : 'CreatedAt',
            Order        : 'descending',
            ItemsPerPage : 1
        };

        const userTask = await this._userTaskService.search(filters);
        if (userTask.TotalCount === 0) {
            Logger.instance().log(`Creating custom task as no task found. PatientUserId:
                    ${JSON.stringify(patientUserId)}`);
            await this._commonActions.createAssessmentTask(patientUserId, assessmentTemplateName);
        }
        else {
            const taskCreationDate = userTask.Items[0].CreatedAt;
            const dayDiff = TimeHelper.dayDiff(new Date(), taskCreationDate);
            if (dayDiff > 30) {
                Logger.instance().log(`Creating custom task as 30 days have passed.
                        PatientUserId: ${JSON.stringify(patientUserId)}`);
                await this._commonActions.createAssessmentTask(patientUserId, assessmentTemplateName);
            } else {
                Logger.instance().log(`No custom task created for patient UserId:
                        ${JSON.stringify(patientUserId)}`);
            }
        }
    };

    //#endregion

}

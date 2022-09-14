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
import { CareplanService } from '../services/clinical/careplan.service';

///////////////////////////////////////////////////////////////////////////////////////

export class AHAActions {

    _commonActions: CommonActions = new CommonActions();

    _assessmentService: AssessmentService = null;

    _patientService: PatientService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _careplanService: CareplanService = null;

    constructor() {
        this._patientService = Loader.container.resolve(PatientService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
        this._careplanService = Loader.container.resolve(CareplanService);
    }

    //#region Public

    public performActions_PostRegistration = async (patient: PatientDetailsDto, clientCode: string) => {
        try {
            var skipClientList = ["HCHLSTRL"];
            if (skipClientList.indexOf(clientCode) === -1) {
                await this.createAHAHealthSurveyTask(patient);
                await this._commonActions.createAssessmentTask(patient.UserId, 'Quality of Life Questionnaire');
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public scheduledMonthlyRecurrentTasks = async () => {
        try {
            const patientUserIds = await this._patientService.getAllPatientUserIds();
            Logger.instance().log(`[KCCQTask] Patients being processed for custom task: ${JSON.stringify(patientUserIds.length)}`);
            for await (var patientUserId of patientUserIds) {
                var enrollments = await this._careplanService.getPatientEnrollments(patientUserId);
                var activeEnrollments = [];
                enrollments.forEach(enrollment => {
                    activeEnrollments.push(enrollment.PlanCode);
                });

                if (activeEnrollments.length > 0 && activeEnrollments.indexOf('HeartFailure') !== -1) {
                    Logger.instance().log(`Creating quality of life questionnaire task for patient:${patientUserId}`);
                    const assessmentTemplateName = 'Quality of Life Questionnaire';
                    await this.triggerAssessmentTask_QualityOfLife(patientUserId, assessmentTemplateName);
                } else {
                    Logger.instance().log(`Skip creating task for patient:${patientUserId}`);
                }
            }
        }
        catch (error) {
            Logger.instance().log(`[KCCQTask] Error performing post registration custom actions.`);
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

    public performActions_PostAssessmentScoring = async (patientUserId: uuid, assessmentId: uuid): Promise<any> => {
        try {
            Logger.instance().log(`Performing post assessment scoring actions ...`);
            const assessment = await this._assessmentService.getById(assessmentId);
            const userResponses = assessment.UserResponses;

            var score = null;
            if (assessment.Title.includes("Quality of Life Questionnaire")) {
                //This is KCCQ assessment,...
                score = this.scoreKCCQAssessment(userResponses);
            }
            return score;
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    //#endregion

    //#region Privates

    private scoreKCCQAssessment = (userResponses) => {

        //Logger.instance().log(`${JSON.stringify(userResponses, null, 2)}`);

        const filtered = userResponses.map(x => {
            return {
                Title        : x.Node.Title,
                ResponseType : x.ResponseType,
                Value        : x.IntegerValue,
            };
        });

        var answers = {};
        answers['1.1'] = this.getAnswerForQuestionTag(filtered, '1.1');
        answers['1.2'] = this.getAnswerForQuestionTag(filtered, '1.2');
        answers['1.3'] = this.getAnswerForQuestionTag(filtered, '1.3');
        answers['2'] = this.getAnswerForQuestionTag(filtered, 'Q 2/8');
        answers['3'] = this.getAnswerForQuestionTag(filtered, 'Q 3/8');
        answers['4'] = this.getAnswerForQuestionTag(filtered, 'Q 4/8');
        answers['5'] = this.getAnswerForQuestionTag(filtered, 'Q 5/8');
        answers['6'] = this.getAnswerForQuestionTag(filtered, 'Q 6/8');
        answers['7'] = this.getAnswerForQuestionTag(filtered, 'Q 7/8');
        answers['8.1'] = this.getAnswerForQuestionTag(filtered, '8.1');
        answers['8.2'] = this.getAnswerForQuestionTag(filtered, '8.2');
        answers['8.3'] = this.getAnswerForQuestionTag(filtered, '8.3');

        Logger.instance().log(`${JSON.stringify(filtered, null, 2)}`);

        //Let the scoring begin..........

        let missingValues = 0;

        //Q1-1,2,3

        var kccq_PL_score = 0;
        let q11 = true;
        let q12 = true;
        let q13 = true;
        if (answers['1.1'] === 6 || !answers['1.1']) {
            missingValues++;
            q11 = false;
        }
        if (answers['1.2'] === 6 || !answers['1.2']) {
            missingValues++;
            q12 = false;
        }
        if (answers['1.3'] === 6 || !answers['1.3']) {
            missingValues++;
            q13 = false;
        }
        if (missingValues <= 1) {
            const denominator = 3.0 - missingValues;
            const sum = (q11 ? answers['1.1'] : 0) + (q12 ? answers['1.2'] : 0) + (q13 ? answers['1.3'] : 0);
            const average = sum / denominator;
            kccq_PL_score = 100.0 * (average - 1) / 4.0;
        }

        //Q2 to Q5
        var q2_rescaled = 100.0 * (answers['2'] - 1.0) / 4.0;
        var q3_rescaled = 100.0 * (answers['3'] - 1.0) / 6.0;
        var q4_rescaled = 100.0 * (answers['4'] - 1.0) / 6.0;
        var q5_rescaled = 100.0 * (answers['5'] - 1.0) / 4.0;
        const kccq_SF_score = (q2_rescaled + q3_rescaled + q4_rescaled + q5_rescaled) / 4.0;

        //Q6 and Q7
        const average = (answers['6'] + answers['7']) / 2.0;
        const kccq_QL_score = 100.0 * (average - 1) / 4.0;

        //Q8-1,2,3

        var kccq_SL_score = 0;
        let q81 = true;
        let q82 = true;
        let q83 = true;

        missingValues = 0;

        if (answers['8.1'] === 6 || !answers['8.1']) {
            missingValues++;
            q81 = false;
        }
        if (answers['8.2'] === 6 || !answers['8.2']) {
            missingValues++;
            q82 = false;
        }
        if (answers['8.3'] === 6 || !answers['8.3']) {
            missingValues++;
            q83 = false;
        }
        if (missingValues <= 1) {
            const denominator = 3.0 - missingValues;
            const sum = (q81 ? answers['8.1'] : 0) + (q82 ? answers['8.2'] : 0) + (q83 ? answers['8.3'] : 0);
            const avg = sum / denominator;
            kccq_SL_score = 100.0 * (avg - 1) / 4.0;
        }

        //Clinical summary score
        const kccq_12_score = (kccq_PL_score + kccq_SF_score) / 2.0;

        //Overall summary score
        const overall_score = (kccq_PL_score + kccq_SF_score + kccq_QL_score + kccq_SL_score) / 4.0;

        return {
            PhysicalLimitation_KCCQ_PL_score : kccq_PL_score,
            SymptomFrequency_KCCQ_SF_score   : kccq_SF_score,
            QualityOfLife_KCCQ_QL_score      : kccq_QL_score,
            SocialLimitation_KCCQ_SL_score   : kccq_SL_score,
            ClinicalSummaryScore             : kccq_12_score,
            OverallSummaryScore              : overall_score
        };
    }

    private getAnswerForQuestionTag = (filtered, tag) => {
        const a = filtered.find(x => x.Title.startsWith(tag) );
        return a?.Value;
    }

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
            Logger.instance().log(`[KCCQTask] Creating custom task as no task found. PatientUserId:
                    ${JSON.stringify(patientUserId)}`);
            await this._commonActions.createAssessmentTask(patientUserId, assessmentTemplateName);
        }
        else {
            const taskCreationDate = userTask.Items[0].CreatedAt;
            const dayDiff = TimeHelper.dayDiff(new Date(), taskCreationDate);
            if (dayDiff > 1) {
                Logger.instance().log(`[KCCQTask] Creating custom task as 1 days have passed.
                        PatientUserId: ${JSON.stringify(patientUserId)}`);
                await this._commonActions.createAssessmentTask(patientUserId, assessmentTemplateName);
            } else {
                Logger.instance().log(`[KCCQTask] No custom task created for patient UserId:
                        ${JSON.stringify(patientUserId)}`);
            }
        }
    };

    //#endregion

}

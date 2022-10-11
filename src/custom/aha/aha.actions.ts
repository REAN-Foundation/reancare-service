import { PatientService } from '../../services/users/patient/patient.service';
import { Loader } from '../../startup/loader';
import { PatientDetailsDto } from '../../domain.types/users/patient/patient/patient.dto';
import { CustomTaskDomainModel } from '../../domain.types/users/custom.task/custom.task.domain.model';
import { UserTaskCategory } from '../../domain.types/users/user.task/user.task.types';
import { Logger } from '../../common/logger';
import { AssessmentTemplateService } from '../../services/clinical/assessment/assessment.template.service';
import { AssessmentService } from '../../services/clinical/assessment/assessment.service';
import { UserTaskService } from '../../services/users/user/user.task.service';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { CommonActions } from '../common/common.actions';
import { EnrollmentDomainModel } from '../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { CareplanService } from '../../services/clinical/careplan.service';
import { UserDeviceDetailsService } from '../../services/users/user/user.device.details.service';
import { KccqAssessmentUtils } from './kccq.assessment.utils';

///////////////////////////////////////////////////////////////////////////////////////

export class AHAActions {

    _commonActions: CommonActions = new CommonActions();

    _assessmentService: AssessmentService = null;

    _patientService: PatientService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _careplanService: CareplanService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    constructor() {
        this._patientService = Loader.container.resolve(PatientService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
        this._careplanService = Loader.container.resolve(CareplanService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
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
                var userDevices = await this._userDeviceDetailsService.getByUserId(patientUserId);
                var userAppRegistrations = [];
                userDevices.forEach(userDevice => {
                    userAppRegistrations.push(userDevice.AppName);
                });

                if (userAppRegistrations.length > 0 && KccqAssessmentUtils.eligibleForKCCQTask(userAppRegistrations)) {
                    Logger.instance().log(`Creating quality of life questionnaire task for patient:${patientUserId}`);
                    const assessmentTemplateName = 'Quality of Life Questionnaire';
                    await KccqAssessmentUtils.triggerAssessmentTask(
                        patientUserId, assessmentTemplateName);
                } else {
                    Logger.instance().log(`Skip creating task for patient:${patientUserId}`);
                }
            }
        }
        catch (error) {
            Logger.instance().log(`[KCCQTask] Error performing post registration custom actions.`);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                score = KccqAssessmentUtils.scoreKCCQAssessment(userResponses);
            }
            return score;
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public performActions_GenerateAssessmentReport =
        async (patientUserId: uuid, assessmentId: uuid, score: any): Promise<string> => {
            try {
                Logger.instance().log(`Performing post assessment report generation ...`);
                const patient = await this._patientService.getByUserId(patientUserId);
                const assessment = await this._assessmentService.getById(assessmentId);
                if (assessment.Title.includes("Quality of Life Questionnaire")) {
                    //This is KCCQ assessment,...
                    const reportUrl = await KccqAssessmentUtils.generateReport(
                        patient, assessment, score);
                    return reportUrl;
                }
                return '';
            }
            catch (error) {
                Logger.instance().log(`Error performing post registration custom actions.`);
            }
        }

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

    //#endregion

}

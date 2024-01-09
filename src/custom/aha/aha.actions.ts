import { PatientService } from '../../services/users/patient/patient.service';
import * as MessageTemplates from '../../modules/communication/message.template/message.templates.json';
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
import { KccqAssessmentUtils } from './quality.of.life/kccq.assessment.utils';
import { AssessmentDomainModel } from '../../domain.types/clinical/assessment/assessment.domain.model';
import { FileResourceService } from '../../services/general/file.resource.service';
import { PersonService } from '../../services/person/person.service';
import { UserService } from '../../services/users/user/user.service';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AHAActions {

    _commonActions: CommonActions = new CommonActions();

    _assessmentService: AssessmentService = null;

    _patientService: PatientService = null;

    _personService: PersonService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _careplanService: CareplanService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _fileResourceService: FileResourceService = null;

    _userService: UserService = null;

    constructor() {
        this._patientService = Loader.container.resolve(PatientService);
        this._personService = Loader.container.resolve(PersonService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
        this._careplanService = Loader.container.resolve(CareplanService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._userService = Loader.container.resolve(UserService);

    }

    //#region Public

    public performActions_PostRegistration = async (patient: PatientDetailsDto, clientCode: string) => {
        try {
            var skipClientList = ["HCHLSTRL"];
            if (skipClientList.indexOf(clientCode) === -1) {
                // await this.createAHAHealthSurveyTask(patient);
                await this._commonActions.createAssessmentTask(patient.UserId, 'Quality of Life Questionnaire');
            }

            if (this.eligibleForMedicalProfileTask(clientCode)) {
                await this._commonActions.createAssessmentTask(patient.UserId, 'Medical Profile Details');
            } else {
                Logger.instance().log(`Skipped creating medical profile task for patient : ${patient.UserId}.`);
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

    public scheduleCareplanRegistrationReminders = async () => {
        try {
            const patients = await this._patientService.getPatientsRegisteredLastMonth();

            Logger.instance().log(`Patients registered to the app in last month: ${JSON.stringify(patients.length)}`);
            for await (var patient of patients) {
                const enrollments = await this._careplanService.getPatientEnrollments(patient.UserId, true);
                if (enrollments.length <= 0) {
                    const today = new Date();
                    const patientRegistrationDate = patient.CreatedAt;
                    const dayDiff = Math.floor(TimeHelper.dayDiff(today, patientRegistrationDate));
                    if (dayDiff === 3 || dayDiff === 10 || dayDiff === 30) {
                        var userDevices = await this._userDeviceDetailsService.getByUserId(patient.UserId);
                        var userAppRegistrations = [];
                        var userDeviceTokens = [];
                        userDevices.forEach(userDevice => {
                            userAppRegistrations.push(userDevice.AppName);
                            userDeviceTokens.push(userDevice.Token);
                        });

                        if (userAppRegistrations.length > 0 && this.eligibleForCareplanRegistartionReminder(userAppRegistrations)) {
                            Logger.instance().log(`Sending careplan registration reminder to :${patient.UserId}`);
                            await this.sendCareplanRegistrationReminder(userDeviceTokens);        
                        } else {
                            Logger.instance().log(`Skip sending careplan registration reminder as device is not eligible:${patient.UserId}`);
                        }
                    } else {
                        Logger.instance().log(`Skip sending careplan registration reminder as ineligible day:${patient.UserId}`);
                    }
                } else {
                    Logger.instance().log(`Skip sending careplan registration reminder as patient is already enrolled:${patient.UserId}`);
                }
                
            }
        }
        catch (error) {
            Logger.instance().log(`Error sending careplan registration reminder.`);
        }
    };

    public scheduleCareplanRegistrationRemindersForOldUsers = async () => {
        try {
            const patients = await this._patientService.getAllRegisteredPatients();

            Logger.instance().log(`All the Patients registered to the app: ${JSON.stringify(patients.length)}`);
            for await (var patient of patients) {
                const enrollments = await this._careplanService.getPatientEnrollments(patient.UserId, true);
                if (enrollments.length <= 0) {
                    var referenceDate = new Date(process.env.CAREPLAN_REG_CRON_REFERENCE_DATE);
                    referenceDate = new Date(referenceDate.setHours(0, 0, 0, 0));

                    var today = new Date();
                    today = new Date(today.setHours(0, 0, 0, 0));

                    const dayDiff = Math.floor(TimeHelper.dayDiff(today, referenceDate));
                    
                    if (dayDiff === 3 || dayDiff === 10 || dayDiff === 30) {
                    var userDevices = await this._userDeviceDetailsService.getByUserId(patient.UserId);
                        var userAppRegistrations = [];
                        var userDeviceTokens = [];
                        userDevices.forEach(userDevice => {
                            userAppRegistrations.push(userDevice.AppName);
                            userDeviceTokens.push(userDevice.Token);
                        });

                    if (userAppRegistrations.length > 0 && this.eligibleForCareplanRegistartionReminder(userAppRegistrations)) {
                        Logger.instance().log(`Sending careplan registration reminder (old user) to :${patient.UserId}`);
                        await this.sendCareplanRegistrationReminder(userDeviceTokens);        
                    } else {
                        Logger.instance().log(`Skip sending careplan registration reminder (old user) as device is not eligible:${patient.UserId}`);
                    }               
                } else {
                    Logger.instance().log(`Skip sending careplan registration reminder (old user) as ineligible day:${patient.UserId}`);
                }
            } else {
                    Logger.instance().log(`Skip sending careplan registration reminder (old user) as patient is already enrolled:${patient.UserId}`);
                }          
            }
        }
        catch (error) {
            Logger.instance().log(`Error sending careplan registration reminder (old users).`);
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
                Logger.instance().log('Calculating the score...');
                score = KccqAssessmentUtils.scoreKCCQAssessment(userResponses);
            }
            Logger.instance().log(`Score: ${JSON.stringify(score, null, 2)}`);
            return score;
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
            Logger.instance().log(error.message);
        }
    };

    public performActions_GenerateAssessmentReport =
        async (patientUserId: uuid, assessmentId: uuid, score: any): Promise<string> => {
            try {
                Logger.instance().log(`Performing post assessment report generation ...`);

                const patient = await this._patientService.getByUserId(patientUserId);
                const assessment = await this._assessmentService.getById(assessmentId);

                if (assessment.Title.includes("Quality of Life Questionnaire")) {

                    Logger.instance().log('Generating the report ...');

                    //This is KCCQ assessment,...
                    if (assessment.ReportUrl != null && assessment.ReportUrl.length > 2) {
                        Logger.instance().log(`Report url exists - ${assessment.ReportUrl}`);
                        const checkIfExists = await this.checkIfFileResourceExists(assessment.ReportUrl);
                        if (checkIfExists) {
                            return assessment.ReportUrl;
                        }
                    }
                    Logger.instance().log(`Generating assessment report...`);
                    const reportUrl = await KccqAssessmentUtils.generateReport(
                        patient, assessment, score);

                    const updates: AssessmentDomainModel = {
                        ReportUrl : reportUrl
                    };

                    const updatedAssessment = await this._assessmentService.update(assessmentId, updates);
                    return updatedAssessment.ReportUrl;
                }
                return null;
            }
            catch (error) {
                Logger.instance().log(`Error performing post registration custom actions.`);
                Logger.instance().log(error.message);
            }
        };

    public scheduleHsSurvey = async () => {
        try {
            const daysPassed = 6;
            var careplanEnrollments = await this._careplanService.getCompletedEnrollments(daysPassed, ["Cholesterol"]);
            for await (var careplanEnrollment of careplanEnrollments) {
                Logger.instance().log(`[HsCron] Enrollment details:${JSON.stringify(careplanEnrollment)}`);
                var patientDetails = await this._patientService.getByUserId(careplanEnrollment.PatientUserId);
                if (patientDetails.HealthSystem === null) {
                    Logger.instance().log(`[HsCron] Skip sending survey for :${patientDetails.UserId}
                                as health system is ${patientDetails.HealthSystem}`);
                    continue;
                }

                const filters = {
                    Task   : 'Cholesterol Health Behaviors',
                    UserId : careplanEnrollment.PatientUserId,
                };
                var userTasks = await this._userTaskService.search(filters);
                var tasks = userTasks.Items;
                for await (var task of tasks) {
                    var action = await this._careplanService.getActivity(task.ActionId);
                    Logger.instance().log(`[HsCron] Task: ${JSON.stringify(task)}`);
                    Logger.instance().log(`[HsCron] Activity details (Action): ${JSON.stringify(action)}`);

                    if (
                        action.Frequency === 85 &&
                        action.Sequence === 5
                    ) {
                        Logger.instance().log(`[HsCron] Action Frequency & Sequence are valid.
                            Proceed to check task status for patient:${patientDetails.UserId}`);
                        if (
                            task.Finished === true &&
                            action.Status === 'Completed'
                        ) {
                            Logger.instance().log(`[HsCron] Start sending SMS and creating custom task for patient Survey.
                                for patient:${patientDetails.UserId}`);
                            const patient =
                                    await this._patientService.getByUserId(careplanEnrollment.PatientUserId);
                            const phoneNumber = patient.User.Person.Phone;
                            const person = await this._personService.getById(patient.User.PersonId);
                            var userFirstName = 'user';
                            if (person && person.FirstName) {
                                userFirstName = person.FirstName;
                            }
                            const message = `Dear ${userFirstName}, Tell us what you thought about the Heart & Stroke Helper app! You will receive a $10 Amazon gift card as a token of appreciation for completing the full survey. Follow the link to share your thoughts: https://tinyurl.com/HSHCholesterol`;
                            const sendStatus = await Loader.messagingService.sendSMS(phoneNumber, message);
                            if (sendStatus) {
                                Logger.instance().log(`Message sent successfully`);
                                await this.createHsPatientSurveyTask(patient);
                            } else {
                                Logger.instance().log(`[HsCron] Failed to send SMS for ${phoneNumber}, hence skip creating task.`);
                            }
                        } else {
                            Logger.instance().log(`[HsCron] Health behaviors assessment is not finished. Status:${action.Status} `);
                        }
                    }
                }
            }
            Logger.instance().log(`[HsCron] Cron completed successfully.`);
        }
        catch (error) {
            Logger.instance().log(`Error occured while sending HS survey message`);
        }
    };

    public scheduleStrokeSurvey = async () => {
        try {
            const daysPassed = 6;
            var careplanEnrollments = await this._careplanService.getCompletedEnrollments(daysPassed, ["Stroke"]);
            for await (var careplanEnrollment of careplanEnrollments) {
                Logger.instance().log(`[StrokeCron] Enrollment details:${JSON.stringify(careplanEnrollment)}`);
                var patient = await this._patientService.getByUserId(careplanEnrollment.PatientUserId);

                var userDevices = await this._userDeviceDetailsService.getByUserId(patient.UserId);
                var userAppRegistrations = [];
                var userDeviceTokens = [];
                userDevices.forEach(userDevice => {
                    userAppRegistrations.push(userDevice.AppName);
                    userDeviceTokens.push(userDevice.Token);
                });

                if (userAppRegistrations.length > 0 && this.eligibleForStrokeSurvey(userAppRegistrations)) {
                    Logger.instance().log(`[StrokeCron] Sending Stroke survey notification to user:${patient.UserId}`);
                    await this.sendStrokeSurveyNotification(userDeviceTokens);        
                } else {
                    Logger.instance().log(`[StrokeCron] Skip sending Stroke survey notification as device is not eligible:${patient.UserId}`);
                }  
            }
            Logger.instance().log(`[StrokeCron] Cron completed successfully.`);
        }
        catch (error) {
            Logger.instance().log(`[StrokeCron] Error occured while sending Stroke survey notification`);
        }
    };

    //#endregion

    //#region Privates

    private checkIfFileResourceExists = async (url) => {
        if (!url) {
            return false;
        }
        try {
            let tempTokens = url.split('file-resources/');
            const second = tempTokens.length > 0 ? tempTokens[1] : null;
            if (second == null) {
                return false;
            }
            tempTokens = second.split('/');
            const fileResourceId = tempTokens.length > 0 ? tempTokens[0] : null;
            if (!fileResourceId) {
                return false;
            }
            const fileResource = await this._fileResourceService.getById(fileResourceId);
            if (!fileResource) {
                return false;
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
            return false;
        }

        return true;
    };

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

    private createHsPatientSurveyTask = async (patient: PatientDetailsDto) => {

        const userId = patient.User.id;

        const domainModel: CustomTaskDomainModel = {
            UserId      : userId,
            Task        : "Patient Satisfaction Survey",
            Description : "Take a survey to help us understand you better!",
            Category    : UserTaskCategory.Custom,
            Details     : {
                Link : "https://tinyurl.com/HSHCholesterol",
            },
            ScheduledStartTime : new Date(),
            ScheduledEndTime   : new Date("2023-12-31 23:59:59")
        };

        const task = await this._commonActions.createCustomTask(domainModel);
        if (task == null) {
            Logger.instance().log('Unable to create patient satisfaction survey task!');
        }

    };

    private eligibleForMedicalProfileTask = (clientCode) => {

        const eligibleClientCodes = [
            'REANPTNT',
            'REANDCTR',
            'REANPTNTAHA'
        ];

        return eligibleClientCodes.indexOf(clientCode) >= 0;
    };

    private eligibleForCareplanRegistartionReminder = (userAppRegistrations) => {

        const eligibleForCareplanRegistartionReminder =
        userAppRegistrations.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
        userAppRegistrations.indexOf('REAN HealthGuru') >= 0 ||
        userAppRegistrations.indexOf('HF Helper') >= 0;

        return eligibleForCareplanRegistartionReminder;
    };

    private eligibleForStrokeSurvey = (userAppRegistrations) => {

        const eligibleForStrokeSurvey =
        userAppRegistrations.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
        (process.env.NODE_ENV === 'development' && userAppRegistrations.indexOf('REAN HealthGuru') >= 0 ) ||
        (process.env.NODE_ENV === 'uat' && userAppRegistrations.indexOf('REAN HealthGuru') >= 0 );
        return eligibleForStrokeSurvey;
    };

    private sendCareplanRegistrationReminder = async (userDeviceTokens) => {

        var title = MessageTemplates['CareplanRegistrationReminder'].Title;
        var body = MessageTemplates['CareplanRegistrationReminder'].Body;

        Logger.instance().log(`Notification Title: ${title}`);
        Logger.instance().log(`Notification Body: ${body}`);

        Logger.instance().log(`Notification template: ${JSON.stringify(MessageTemplates['CareplanRegistrationReminder'])}`);

        var message = Loader.notificationService.formatNotificationMessage(
            MessageTemplates['CareplanRegistrationReminder'].NotificationType, title, body
        );
        for await (var deviceToken of userDeviceTokens) {
            await Loader.notificationService.sendNotificationToDevice(deviceToken, message);
        }

    };

    private sendStrokeSurveyNotification = async (userDeviceTokens) => {

        var title = MessageTemplates['StrokeSurveyNotification'].Title;
        var body = MessageTemplates['StrokeSurveyNotification'].Body;
        var url = MessageTemplates['StrokeSurveyNotification'].Url;

        Logger.instance().log(`Notification Title: ${title}`);
        Logger.instance().log(`Notification Body: ${body}`);
        Logger.instance().log(`Notification URL: ${url}`);

        Logger.instance().log(`Notification template: ${JSON.stringify(MessageTemplates['StrokeSurveyNotification'])}`);

        var message = Loader.notificationService.formatNotificationMessage(
            MessageTemplates['StrokeSurveyNotification'].NotificationType, title, body, url
        );
        Logger.instance().log(`[StrokeCron] Notification Paylod: ${JSON.stringify(message)}`);
        for await (var deviceToken of userDeviceTokens) {
            await Loader.notificationService.sendNotificationToDevice(deviceToken, message);
        }

    };


    //#endregion

}


import { PatientDetailsDto } from '../domain.types/users/patient/patient/patient.dto';
import { ConfigurationManager } from '../config/configuration.manager';
import { Logger } from '../common/logger';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { AHAActions } from './aha/aha.actions';
import { EnrollmentDomainModel } from '../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { UserTaskSenderService } from '../services/users/user/user.task.sender.service';
import { Injector } from '../startup/injector';
import { GGHNActions } from './gghn/gghn.actions';
import { CommonActions } from './common/common.actions';
import { AssessmentService } from '../services/clinical/assessment/assessment.service';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomActionsHandler {

    _ahaActions: AHAActions = new AHAActions();

    _gghnActions: GGHNActions = new GGHNActions();

    _comonActions: CommonActions = new CommonActions();

    //#region Public

    public performActions_PostRegistration = async (patient: PatientDetailsDto, clientCode: string) => {
        try {
            if (this.isForAHA()) {
                await this._ahaActions.performActions_PostRegistration(patient, clientCode);
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public scheduledMonthlyRecurrentTasks = async () => {
        try {
            if (this.isForAHA()) {
                await this._ahaActions.scheduledMonthlyRecurrentTasks();
            }
        }
        catch (error) {
            Logger.instance().log(`[KCCQTask] Error performing post registration custom actions.`);
        }
    };

    public scheduleCareplanRegistrationReminders = async () => {
        try {
            await this._ahaActions.scheduleCareplanRegistrationReminders();
        }
        catch (error) {
            Logger.instance().log(`Error sending reminders for careplan registration.`);
        }
    };

    public scheduleCareplanRegistrationRemindersForOldUsers = async () => {
        try {
            await this._ahaActions.scheduleCareplanRegistrationRemindersForOldUsers();
        }
        catch (error) {
            Logger.instance().log(`Error sending reminders to old users for careplan registration.`);
        }
    };

    public performActions_PostCareplanEnrollment = async (enrollmentModel: EnrollmentDomainModel) => {
        try {
            if (this.isForAHA()) {
                await this._ahaActions.performActions_PostCareplanEnrollment(enrollmentModel);
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post careplan enrollment custom actions.`);
        }
    };

    public performActionsPostAssessmentScoring = async (patientUserId: uuid, assessmentId: uuid): Promise<any> => {
        try {
            if (this.isForAHA()) {
                return await this._ahaActions.performActionsAHAPostAssessmentScoring(patientUserId, assessmentId);
            } else {
                return await this._ahaActions.performActionsDefaultPostAssessmentScoring(patientUserId, assessmentId);
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post assessment scoring actions.`);
        }
    };

    public performActions_GenerateAssessmentReport = async (
        patientUserId: uuid, assessmentId: uuid, score: any): Promise<any> => {
        try {
            if (this.isForAHA()) {
                return await this._ahaActions.performActions_GenerateAssessmentReport(
                    patientUserId, assessmentId, score);
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    public scheduleHsSurvey = async () => {
        try {
            if (this.isForAHA()) {
                await this._ahaActions.scheduleHsSurvey();
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing custom HS survey tasks.`);
        }
    };

    public scheduleStrokeSurvey = async () => {
        try {
            await this._ahaActions.scheduleStrokeSurvey();
        }
        catch (error) {
            Logger.instance().log(`Error sending stroke survey notification.`);
        }
    };

    public scheduleStrokeSurveyTextMessage = async () => {
        try {
            await this._ahaActions.scheduleStrokeSurveyTextMessage();
        }
        catch (error) {
            Logger.instance().log(`Error sending stroke survey text message.`);
        }
    };

    public scheduleHFHelperTextMessage = async () => {
        try {
            await this._ahaActions.scheduleHFHelperTextMessage();
        }
        catch (error) {
            Logger.instance().log(`Error sending SMS to HF Helper users.`);
        }
    };

    public scheduleGGHNFollowUpReminder = async () => {
        try {
            await this._gghnActions.scheduleGGHNFollowUpReminder();
        }
        catch (error) {
            Logger.instance().log(`Error in schedule of GGHN FollowUp Reminder.`);
        }
    };

    public scheduleDailyCareplanPushTasks = async () => {
        try {
            if (this.isForBotChannel()) {
                Logger.instance().log('Running scheduled jobs: Schedule Maternity Careplan Task...');
                const nextMinutes = 15;
                const userTaskService = Injector.Container.resolve(UserTaskSenderService);
                await userTaskService.enqueueSendUserTasks(nextMinutes);
            }
        }
        catch (error) {
            Logger.instance().log(`Error sending careplan activity to bot users.`);
        }
    };

    public scheduleCreateMedicationConsumptionTask = async (cronExpression: string) => {
        try {
            Logger.instance().log('Inside scheduleCreateMedicationConsumptionTask');
            await this._comonActions.scheduleCreateMedicationConsumptionTask(cronExpression);
        }
        catch (error) {
            Logger.instance().log(`Error in schedule of medication consumption task.`);
        }
    };
    //#endregion

    //#region Privates

    private isForAHA = () => {

        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        const isForAHA =
        systemIdentifier.includes('AHA') ||
        systemIdentifier.includes('AHA Helper') ||
        systemIdentifier.includes('HF Helper')

        return isForAHA;
    };

    private isForBotChannel = () => {

        const systemIdentifier = ConfigurationManager.SystemIdentifier();
        const isForBotChannel = systemIdentifier.includes('REAN HealthGuru');
        return isForBotChannel;
    };

    public scheduleNotificationToInactiveUsers = async () => {
        try {
            await this._ahaActions.scheduleNotificationToInactiveUsers();
        }
        catch (error) {
            Logger.instance().log(`Error sending notification to inactive users.`);
        }
    };
    //#endregion

}

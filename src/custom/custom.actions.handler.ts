
import { PatientDetailsDto } from '../domain.types/patient/patient/patient.dto';
import { ConfigurationManager } from '../config/configuration.manager';
import { Logger } from '../common/logger';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { AHAActions } from './aha.actions';
import { EnrollmentDomainModel } from '../domain.types/clinical/careplan/enrollment/enrollment.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomActionsHandler {

    _ahaActions: AHAActions = new AHAActions();

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

    public performActions_PostAssessmentScoring = async (patientUserId: uuid, assessmentId: uuid): Promise<any> => {
        try {
            if (this.isForAHA()) {
                return await this._ahaActions.performActions_PostAssessmentScoring(patientUserId, assessmentId);
            }
        }
        catch (error) {
            Logger.instance().log(`Error performing post registration custom actions.`);
        }
    };

    //#endregion

    //#region Privates

    private isForAHA = () => {

        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        const isForAHA =
        systemIdentifier.includes('AHA') ||
        systemIdentifier.includes('AHA Helper') ||
        systemIdentifier.includes('HF Helper') ||
        systemIdentifier.includes('Lipid Helper') ||
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'uat';

        return isForAHA;
    }

    //#endregion

}

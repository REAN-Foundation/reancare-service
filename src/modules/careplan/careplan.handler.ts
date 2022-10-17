import { ICareplanService } from "./interfaces/careplan.service.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import Dictionary from "../../common/dictionary";
import { CareplanActivity } from "../../domain.types/clinical/careplan/activity/careplan.activity";
import { ParticipantDomainModel } from "../../domain.types/clinical/careplan/participant/participant.domain.model";
import { ProviderResolver } from "./provider.resolver";
import { ConfigurationManager } from "../../config/configuration.manager";
import { CareplanConfig } from "../../config/configuration.types";
import { CAssessmentTemplate } from "../../domain.types/clinical/assessment/assessment.types";
import { GoalDto } from "../../domain.types/users/patient/goal/goal.dto";
import { ActionPlanDto } from "../../domain.types/users/patient/action.plan/action.plan.dto";
import { HealthPriorityDto } from "../../domain.types/users/patient/health.priority/health.priority.dto";

////////////////////////////////////////////////////////////////////////

export class CareplanHandler {

    static _services: Dictionary<ICareplanService> = new Dictionary<ICareplanService>();

    public static init = async (): Promise<boolean> => {

        CareplanHandler._services = ProviderResolver.resolve();

        for await (var s of CareplanHandler._services.getKeys()) {
            var service = CareplanHandler._services.getItem(s);
            await service.init();
        }
        return true;
    };

    public getPatientEligibility = async (patient: any, provider: string, careplanCode: string) => {
        if (this.isEnabledProvider(provider)) {
            var service = CareplanHandler._services.getItem(provider);
            return await service.getPatientEligibility(patient, careplanCode);
        }
        return {
            Eligible : false,
            Reason   : `The careplan by the provider is not available currently!`
        };
    };

    public getAvailableCarePlans = (provider?: string): CareplanConfig[] => {
        var careplans = ConfigurationManager.careplans();
        var plans: CareplanConfig[] = [];
        if (provider) {
            for (var careplan of careplans) {
                if (careplan.Provider === provider && careplan.Enabled) {
                    return careplan.Plans;
                }
            }
        }
        else {
            for (var c of careplans) {
                if (c.Enabled) {
                    var tmp = c.Plans;
                    plans.push(...tmp);
                }
            }
        }
        return plans;
    };

    public isPlanAvailable = (provider: string, planCode: string): boolean => {
        var enabledProvider = this.isEnabledProvider(provider);
        if (enabledProvider) {
            var providerPlans = enabledProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.Code === planCode;
            });
            if (foundPlan) {
                return true;
            }
        }
        return false;
    };

    public getPlanDetails(provider: string, planCode: string): CareplanConfig {
        var enabledProvider = this.isEnabledProvider(provider);
        if (enabledProvider) {
            var providerPlans = enabledProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.Code === planCode;
            });
            if (foundPlan) {
                return foundPlan;
            }
        }
        return null;
    }

    public registerPatientWithProvider = async (patientDetails: ParticipantDomainModel, provider: string) => {
        if (this.isEnabledProvider(provider)) {
            var service = CareplanHandler._services.getItem(provider);
            return await service.registerPatient(patientDetails);
        }
        return null;
    };

    public enrollPatientToCarePlan = async (enrollmentDetails: EnrollmentDomainModel): Promise<string> => {
        const provider = enrollmentDetails.Provider;
        if (this.isEnabledProvider(provider)) {
            var service = CareplanHandler._services.getItem(provider);
            return await service.enrollPatientToCarePlan(enrollmentDetails);
        }
        return null;
    };

    public fetchActivities = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        participantId: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date
    ): Promise<CareplanActivity[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.fetchActivities(careplanCode, enrollmentId, participantId, fromDate, toDate);
    };

    public getActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string | number,
        activityId: string,
        scheduledAt?: string
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.getActivity(patientUserId, careplanCode, enrollmentId, activityId, scheduledAt);
    };

    public updateActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string | number,
        activityId: string,
        updates: any
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.completeActivity(patientUserId, careplanCode, enrollmentId, activityId, updates);
    };

    public convertToAssessmentTemplate = async (assessmentActivity: CareplanActivity)
        : Promise<CAssessmentTemplate> => {
        var service = CareplanHandler._services.getItem(assessmentActivity.Provider);
        return await service.convertToAssessmentTemplate(assessmentActivity);
    };

    public getGoals = async (
        patientUserId: uuid,
        enrollmentId: string,
        provider: string,
        category: string
    ): Promise<GoalDto[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.getGoals(patientUserId, enrollmentId, category);
    };

    public getActionPlans = async (
        patientUserId: uuid,
        enrollmentId: string,
        provider: string,
        category: string
    ): Promise<ActionPlanDto[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.getActionPlans(patientUserId, enrollmentId, category);
    };

    public updateActionPlan = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        actionName: string,
    ): Promise<ActionPlanDto> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateActionPlan(enrollmentId, actionName);
    };

    public updateGoal = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        goalName: string,
    ): Promise<GoalDto> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateGoal(enrollmentId, goalName);
    };

    public updateHealthPriority = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        healthPriorityType: string,
    ): Promise<HealthPriorityDto> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateHealthPriority(patientUserId, enrollmentId, healthPriorityType);
    };

    public scheduleDailyHighRiskCareplan = async (
        provider: string,
    ): Promise<boolean> => {
        var service = CareplanHandler._services.getItem(provider);
        await service.scheduleDailyHighRiskCareplan();
        return true;
    };

    private isEnabledProvider(provider: string) {
        var careplans = ConfigurationManager.careplans();
        return careplans.find(x => {
            return x.Provider === provider && x.Enabled;
        });
    }

}

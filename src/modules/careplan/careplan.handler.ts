import { ICareplanService } from "./interfaces/careplan.service.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import Dictionary from "../../common/dictionary";
import { CareplanActivity } from "../../domain.types/clinical/careplan/activity/careplan.activity";
import { ParticipantDomainModel } from "../../domain.types/clinical/careplan/participant/participant.domain.model";
import { ProviderResolver } from "./provider.resolver";
import { ConfigurationManager } from "../../config/configuration.manager";
import { CareplanConfig } from "../../config/configuration.types";
import { SAssessment, SAssessmentTemplate } from "../../domain.types/clinical/assessment/assessment.types";
import { GoalDto } from "../../domain.types/patient/goal/goal.dto";
import { ActionPlanDto } from "../../domain.types/goal.action.plan/goal.action.plan.dto";

////////////////////////////////////////////////////////////////////////

export class CareplanHandler {

    static _services: Dictionary<ICareplanService> = new Dictionary<ICareplanService>()

    public static init = async (): Promise<boolean> => {

        CareplanHandler._services = ProviderResolver.resolve();

        for await (var s of CareplanHandler._services.getKeys()) {
            var service = CareplanHandler._services.getItem(s);
            await service.init();
        }
        return true;
    };

    public getAvailableCarePlans = (provider?: string): CareplanConfig[] => {
        var careplans = ConfigurationManager.careplans();
        var plans: CareplanConfig[] = [];
        if (provider) {
            for (var c of careplans) {
                if (c.Provider === provider) {
                    return c.Plans;
                }
            }
        }
        else {
            for (var c of careplans) {
                var tmp = c.Plans;
                plans.push(...tmp);
            }
        }
        return plans;
    };

    public isPlanAvailable = (provider: string, planCode: string): boolean => {
        var careplans = ConfigurationManager.careplans();
        var foundProvider = careplans.find(x => {
            return x.Provider === provider;
        });
        if (foundProvider) {
            var providerPlans = foundProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.ProviderCode === planCode;
            });
            if (foundPlan) {
                return true;
            }
        }
        return false;
    };

    public getPlanDetails(provider: string, planCode: string): CareplanConfig {
        var careplans = ConfigurationManager.careplans();
        var foundProvider = careplans.find(x => {
            return x.Provider === provider;
        });
        if (foundProvider) {
            var providerPlans = foundProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.ProviderCode === planCode;
            });
            if (foundPlan) {
                return foundPlan;
            }
        }
        return null;
    }

    public registerPatientWithProvider = async (patientDetails: ParticipantDomainModel, provider: string) => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.registerPatient(patientDetails);
    };

    public enrollPatientToCarePlan = async (
        enrollmentDetails: EnrollmentDomainModel
    ): Promise<string> => {
        const provider = enrollmentDetails.Provider;
        var service = CareplanHandler._services.getItem(provider);
        return await service.enrollPatientToCarePlan(enrollmentDetails);
    };

    public fetchActivities = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date
    ): Promise<CareplanActivity[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.fetchActivities(careplanCode, enrollmentId, fromDate, toDate);
    };

    public getActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
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
        enrollmentId: string,
        activityId: string,
        updates: any
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateActivity(patientUserId, careplanCode, enrollmentId, activityId, updates);
    };

    public convertToAssessmentTemplate = async (assessmentActivity: CareplanActivity)
        : Promise<SAssessmentTemplate> => {
        var service = CareplanHandler._services.getItem(assessmentActivity.Provider);
        return await service.convertToAssessmentTemplate(assessmentActivity);
    };

    public updateAssessment = async (assessment: SAssessment): Promise<boolean> => {
        var service = CareplanHandler._services.getItem(assessment.Provider);
        return await service.updateAssessment(assessment);
    };

    public updateAssessmentActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string,
        scheduledAt: Date,
        sequence: number,
        updates: any
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateAssessmentActivity(patientUserId, careplanCode, enrollmentId,
            activityId, scheduledAt, sequence, updates);
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

}

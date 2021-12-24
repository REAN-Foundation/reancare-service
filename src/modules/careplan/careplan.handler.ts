import { ICareplanService } from "./interfaces/careplan.service.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "./domain.types/enrollment/enrollment.domain.model";
import Dictionary from "../../common/dictionary";
import { CareplanActivity } from "./domain.types/activity/careplan.activity.dto";
import { ParticipantDomainModel } from "./domain.types/participant/participant.domain.model";
import { ProviderResolver } from "./provider.resolver";

////////////////////////////////////////////////////////////////////////

export class CareplanHandler {

    static _services:Dictionary<ICareplanService> = new Dictionary<ICareplanService>()

    public static init = async (): Promise<boolean> => {

        CareplanHandler._services = ProviderResolver.resolve();

        for await (var s of CareplanHandler._services.getKeys()) {
            var service = CareplanHandler._services.getItem(s);
            await service.init();
        }
        return true;
    };

    public registerPatientWithProvider = async(patientDetails: ParticipantDomainModel, provider: string) => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.registerPatient(patientDetails);
    }

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
        return await service.fetchActivities(patientUserId, careplanCode, enrollmentId, fromDate, toDate);
    };

    public getActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.getActivity(patientUserId, careplanCode, enrollmentId, activityId);
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

}

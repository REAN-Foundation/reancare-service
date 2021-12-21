import { ICarePlanService } from "./interfaces/careplan.service.interface";
import { PatientDomainModel } from "../../domain.types/patient/patient/patient.domain.model";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "./domain.types/enrollment/enrollment.domain.model";
import { ConfigurationManager } from "../../config/configuration.manager";
import { Loader } from "../../startup/loader";
import Dictionary from "../../common/dictionary";
import { CareplanActivityDto } from "./domain.types/activity/careplan.activity.dto";
import { EnrollmentDto } from "./domain.types/enrollment/enrollment.dto";
import { Gender } from "aws-sdk/clients/polly";
import { ParticipantDomainModel } from "./domain.types/participant/participant.domain.model";

////////////////////////////////////////////////////////////////////////

export class CareplanHandler {

    static _services = new Dictionary<ICarePlanService>();

    public static registerProviders() {
        var careplans = ConfigurationManager.careplans();
        for (var cp of careplans) {
            var service = Loader.container.resolve(cp.Service) as ICarePlanService;
            CareplanHandler._services.add(cp.Provider, service);
        }
    }

    public static init = async (): Promise<boolean> => {
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
        patient: PatientDomainModel,
        enrollmentDetails: EnrollmentDomainModel
    ): Promise<any> => {
        const provider = enrollmentDetails.Provider;
        var service = CareplanHandler._services.getItem(provider);
        return await service.enrollPatientToCarePlan(patient, enrollmentDetails);
    };

    public fetchActivitiesForDay = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        day: Date
    ): Promise<CareplanActivityDto[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.fetchActivitiesForDay(patientUserId, careplanCode, enrollmentId, day);
    };

    public fetchActivities = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string
    ): Promise<CareplanActivityDto[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.fetchActivities(patientUserId, careplanCode, enrollmentId);
    };

    public getActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string
    ): Promise<CareplanActivityDto> => {
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
    ): Promise<CareplanActivityDto> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateActivity(patientUserId, careplanCode, enrollmentId, activityId, updates);
    };

}

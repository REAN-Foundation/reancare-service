import { injectable } from "tsyringe";
import { ICarePlanService } from "./interfaces/careplan.service.interface";
// import { AhaCarePlanService } from "../providers/aha/aha.careplan.service";
import { PatientDomainModel } from "../../domain.types/patient/patient/patient.domain.model";
import { CarePlanTaskDto as CarePlanActivity } from "./domain.types/careplan.task.dto";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "./domain.types/enrollment/enrollment.domain.model";
import { ConfigurationManager } from "../../config/configuration.manager";
import { Loader } from "../../startup/loader";
import Dictionary from "../../common/dictionary";
import { CareplanActivityDto } from "./domain.types/activity/careplan.activity.dto";
import { EnrollmentDto } from "./domain.types/enrollment/enrollment.dto";

////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanService {

    static _services = new Dictionary<ICarePlanService>();

    public static registerProviders() {
        var careplans = ConfigurationManager.careplans();
        for (var cp of careplans) {
            var service = Loader.container.resolve(cp.Service) as ICarePlanService;
            CareplanService._services.add(cp.Provider, service);
        }
    }

    public static init = async (): Promise<boolean> => {
        for await (var s of CareplanService._services.getKeys()) {
            var service = CareplanService._services.getItem(s);
            await service.init();
        }
        return true;
    };

    public enrollPatientToCarePlan = async (
        patient: PatientDomainModel,
        enrollmentDetails: EnrollmentDomainModel
    ): Promise<any> => {
        const provider = enrollmentDetails.Provider;
        var service = CareplanService._services.getItem(provider);
        return await service.enrollPatientToCarePlan(patient, enrollmentDetails);
    };

    public fetchActivitiesForDay = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        day: Date
    ): Promise<CareplanActivityDto[]> => {
        var service = CareplanService._services.getItem(provider);
        return await service.fetchActivitiesForDay(patientUserId, careplanCode, enrollmentId, day);
    };

    public fetchActivities = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string
    ): Promise<CareplanActivityDto[]> => {
        var service = CareplanService._services.getItem(provider);
        return await service.fetchActivities(patientUserId, careplanCode, enrollmentId);
    };

    public getActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string
    ): Promise<CareplanActivityDto> => {
        var service = CareplanService._services.getItem(provider);
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
        var service = CareplanService._services.getItem(provider);
        return await service.updateActivity(patientUserId, careplanCode, enrollmentId, activityId, updates);
    };

}

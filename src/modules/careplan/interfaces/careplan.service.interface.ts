
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { PatientDomainModel } from "../../../domain.types/patient/patient/patient.domain.model";
import { CareplanActivityDto } from "../domain.types/activity/careplan.activity.dto";
import { EnrollmentDomainModel } from "../domain.types/enrollment/enrollment.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICarePlanService {

    init(): Promise<boolean>;

    providerName(): string;

    registerPatient(patientDomainModel: PatientDomainModel): Promise<any>;

    enrollPatientToCarePlan (patient: PatientDomainModel,
        enrollmentDetails: EnrollmentDomainModel): Promise<any>;

    fetchActivitiesForDay(patientUserId: uuid,
        careplanCode: string,
        enrollmentId: string,
        day: Date): Promise<CareplanActivityDto[]>;

    fetchActivities(patientUserId: uuid,
        careplanCode: string,
        enrollmentId: string): Promise<CareplanActivityDto[]>;
    
    getActivity(
            patientUserId: uuid,
            careplanCode: string,
            enrollmentId: string,
            activityId: string
        ): Promise<CareplanActivityDto>;

    updateActivity(
            patientUserId: uuid,
            careplanCode: string,
            enrollmentId: string,
            activityId: string,
            updates: any
        ): Promise<CareplanActivityDto>;

}

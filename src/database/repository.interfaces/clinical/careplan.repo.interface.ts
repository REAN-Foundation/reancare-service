import { ParticipantDto } from '../../../domain.types/clinical/careplan/participant/participant.dto';
import { CarePlanEnrollmentDomainModel } from '../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.domain.model';
import { CarePlanEnrollmentDto } from "../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.dto";
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CareplanActivityDto } from '../../../domain.types/clinical/careplan/activity/careplan.activity.dto';
import { CareplanActivityDomainModel } from '../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICareplanRepo {

    addPatientWithProvider(
        patientUserId: uuid, provider: string, participantId: string): Promise<ParticipantDto>;

    getPatientRegistrationDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    enrollPatient(model: CarePlanEnrollmentDomainModel): Promise<CarePlanEnrollmentDto>;

    getCareplanEnrollment(careplanId: uuid): Promise<CarePlanEnrollmentDto>;

    getPatientEnrollments(patientUserId: uuid): Promise<CarePlanEnrollmentDto[]>;

    getPatientEnrollment(patientUserId: uuid, provider: string, enrollmentId): Promise<CarePlanEnrollmentDto>;

    addActivities(
        provider: string,
        planName: string,
        planCode: string,
        patientUserId: uuid,
        enrollmentId: string,
        activities: CareplanActivityDomainModel[]): Promise<CareplanActivityDto[]>;

    addActivity(provider: string,
        planName: string,
        planCode: string,
        patientUserId: uuid,
        enrollmentId: string,
        activity: CareplanActivityDomainModel): Promise<CareplanActivityDto>;

    getActivities(patientUserId: string, startTime: Date, endTime: Date): Promise<CareplanActivityDto[]>;

    getActivity(activityId: uuid): Promise<CareplanActivityDto>;

    startActivity(activityId: uuid): Promise<CareplanActivityDto>;

    completeActivity(activityId: uuid): Promise<CareplanActivityDto>;

    updateActivity(activityId: uuid, status: string, finishedAt: Date): Promise<CareplanActivityDto>;

    setUserTaskToActivity(activityId: any, userTaskId: string): Promise<boolean>;

    updateActivityDetails(activityId: uuid, activityDetails: any): Promise<CareplanActivityDto>;

    activityExists(Provider: string, EnrollmentId: string,
        ProviderActionId: string, Sequence: number, ScheduledAt: Date): Promise<boolean>;

    updateActivityUserResponse(activityId: uuid, userResponse:string): Promise<CareplanActivityDto>;

}

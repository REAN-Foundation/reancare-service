import { ParticipantDto } from '../../../domain.types/clinical/careplan/participant/participant.dto';
import { EnrollmentDomainModel } from '../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { EnrollmentDto } from "../../../domain.types/clinical/careplan/enrollment/enrollment.dto";
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CareplanActivityDto } from '../../../domain.types/clinical/careplan/activity/careplan.activity.dto';
import { CareplanActivityDomainModel } from '../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';
import { CareplanCode } from '../../../domain.types/statistics/aha/aha.type';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICareplanRepo {

    addPatientWithProvider(
        patientUserId: uuid, provider: string, participantId: string, tenantId: string): Promise<ParticipantDto>;

    getPatientRegistrationDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    enrollPatient(model: EnrollmentDomainModel): Promise<EnrollmentDto>;

    updateRisk(model: EnrollmentDomainModel): Promise<EnrollmentDto>;

    getCareplanEnrollment(enrollmentId: uuid): Promise<EnrollmentDto>;

    getPatientEnrollments(patientUserId: uuid, isActive: boolean): Promise<EnrollmentDto[]>;

    getCompletedEnrollments(daysPassed: number, planNames: string[]): Promise<EnrollmentDto[]>;

    getAllCareplanEnrollment(): Promise<EnrollmentDto[]>;

    getPatientEnrollment(patientUserId: uuid, provider: string, enrollmentId): Promise<EnrollmentDto>;

    getEnrollmentByEnrollmentId(enrollmentId : string): Promise<EnrollmentDto>;

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

    activityExists(Provider: string, EnrollmentId: string | number,
        ProviderActionId: string, Sequence: number, ScheduledAt: Date): Promise<boolean>;

    updateActivityUserResponse(activityId: uuid, userResponse:string): Promise<CareplanActivityDto>;

    getAllReanActivities(): Promise<CareplanActivityDto[]>;

    deleteFutureCareplanTask(enrollment): Promise<number>;

    getPatientActiveEnrollments(patientUserId: uuid): Promise<EnrollmentDto[]>;

    stop(enrollmentId: uuid): Promise<EnrollmentDto>;

    getAllCareplanEnrollmentByPlanCode(planCode: CareplanCode): Promise<EnrollmentDto[]>;

    deleteEnrollmentByUserId(patientUserId: string, hardDelete: boolean): Promise<boolean>;

    deleteActivitiesByUserId(patientUserId: string, hardDelete: boolean): Promise<boolean>;
}

import { ParticipantDto } from '../../../modules/careplan/domain.types/participant/participant.dto';
import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from "../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CareplanActivityDto } from '../../../modules/careplan/domain.types/activity/careplan.activity.dto';
import { CareplanActivityDomainModel } from '../../../modules/careplan/domain.types/activity/careplan.activity.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICareplanRepo {

    addPatientWithProvider(
        patientUserId: uuid, provider: string, participantId: string): Promise<ParticipantDto>;

    getPatientRegistrationDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    enrollPatient(model: EnrollmentDomainModel): Promise<EnrollmentDto>;

    getPatientEnrollments(patientUserId: uuid): Promise<EnrollmentDto[]>;

    getPatientEnrollment(patientUserId: uuid, provider: string, enrollmentId): Promise<EnrollmentDto>;

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
        activities: CareplanActivityDomainModel): Promise<CareplanActivityDto>;

    getActivities(patientUserId: string, startTime: Date, endTime: Date): Promise<CareplanActivityDto[]>;

    getActivity(activityId: uuid): Promise<CareplanActivityDto>;

    updateActivity(activityId: uuid, status: string, finishedAt: Date): Promise<CareplanActivityDto>;
}

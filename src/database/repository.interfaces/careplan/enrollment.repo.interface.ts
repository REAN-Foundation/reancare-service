import { ParticipantDto } from '../../../modules/careplan/domain.types/participant/participant.dto';
import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from "../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CareplanActivity } from '../../../modules/careplan/domain.types/activity/careplan.activity.dto';
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
        activities: CareplanActivityDomainModel[]): Promise<CareplanActivity[]>;

    addActivity(provider: string,
        planName: string,
        planCode: string,
        patientUserId: uuid,
        enrollmentId: string,
        activities: CareplanActivityDomainModel): Promise<CareplanActivity>;

    getActivities(patientUserId: string, startTime: Date, endTime: Date): Promise<CareplanActivity[]>;

    getActivity(activityId: uuid): Promise<CareplanActivity>;

    updateActivity(activityId: uuid, status: string, finishedAt: Date): Promise<CareplanActivity>;
}

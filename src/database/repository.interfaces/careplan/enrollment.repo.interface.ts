import { ParticipantDto } from '../../../modules/careplan/domain.types/participant/participant.dto';
import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from "../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CareplanActivityDto } from '../../../modules/careplan/domain.types/activity/careplan.activity.dto';
import { CareplanActivityDomainModel } from '../../../modules/careplan/domain.types/activity/careplan.activity.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICareplanRepo {

    addParticipantWithProvider(
        patientUserId: uuid, provider: string, participantId: string): Promise<ParticipantDto>;

    getParticipantDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    getParticipantDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    enrollParticipant(model: EnrollmentDomainModel): Promise<EnrollmentDto>;

    getParticipantEnrollments(patientUserId: uuid): Promise<EnrollmentDto[]>;

    getParticipantEnrollment(patientUserId: uuid, provider: string, enrollmentId): Promise<EnrollmentDto>;

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
}

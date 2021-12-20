import { ParticipantDto } from '../../../modules/careplan/domain.types/participant/participant.dto';
import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from "../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CareplanActivityDto } from '../../../modules/careplan/domain.types/activity/careplan.activity.dto';
import { CareplanActivityDomainModel } from '../../../modules/careplan/domain.types/activity/careplan.activity.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICareplanRepo {

    registerParticipantToProvider(
        patientUserId: uuid, provider: string, participantId: string): Promise<ParticipantDto>;

    getParticipantDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    getParticipantDetails(patientUserId: uuid, provider?: string): Promise<ParticipantDto>;

    enrollParticipant(model: EnrollmentDomainModel): Promise<EnrollmentDto>;

    getParticipantEnrollments(patientUserId: uuid): Promise<EnrollmentDto>;

    getParticipantEnrollment(patientUserId: uuid, provider: string, enrollmentId): Promise<EnrollmentDto>;

    addActivities(activities: CareplanActivityDomainModel[]): Promise<CareplanActivityDto>;

    addActivity(activity: CareplanActivityDomainModel): Promise<CareplanActivityDto>;

    getActivities(patientUserId: uuid, day: Date): Promise<CareplanActivityDto[]>;

    getActivity(activityId: uuid): Promise<CareplanActivityDto>;
}

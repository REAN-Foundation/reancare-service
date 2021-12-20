import { CareplanActivityDomainModel } from '../../../../../modules/careplan/domain.types/activity/careplan.activity.domain.model';
import { CareplanActivityDto } from '../../../../../modules/careplan/domain.types/activity/careplan.activity.dto';
import { ParticipantDto } from '../../../../../modules/careplan/domain.types/participant/participant.dto';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { EnrollmentDomainModel } from "../../../../../modules/careplan/domain.types/enrollment/enrollment.domain.model";
import { EnrollmentDto } from "../../../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import { ICareplanRepo } from "../../../../repository.interfaces/careplan/enrollment.repo.interface";
import { EnrollmentMapper } from "../../mappers/careplan/enrollment.mapper";
import Enrollment from "../../models/careplan/enrollment.model";
import Participant from "../../../../../database/sql/sequelize/models/careplan/participant.model";
import CareplanArtifact from "../../../../../database/sql/sequelize/models/careplan/careplan.artifact.model";

///////////////////////////////////////////////////////////////////////

export class CareplanRepo implements ICareplanRepo {

    registerParticipantToProvider(
        patientUserId: string, provider: string, participantId: string): Promise<ParticipantDto> {
        throw new Error('Method not implemented.');
    }

    getParticipantDetails(patientUserId: string, provider?: string): Promise<ParticipantDto>;

    getParticipantDetails(patientUserId: string, provider?: string): Promise<ParticipantDto>;

    getParticipantDetails(patientUserId: any, provider?: any): Promise<ParticipantDto> {
        throw new Error('Method not implemented.');
    }

    enrollParticipant = async (model: EnrollmentDomainModel): Promise<EnrollmentDto> => {
        try {
            const entity = {
                UserId        : model.UserId,
                Provider      : model.Provider,
                ParticipantId : model.ParticipantId,
                EnrollmentId  : model.EnrollmentId,
                PlanCode      : model.PlanCode,
                PlanName      : model.PlanName,
                StartDate     : model.StartDate,
                EndDate       : model.EndDate,
                Gender        : model.Gender,
            };

            const enrollment = await Enrollment.create(entity);
            return await EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
    getParticipantEnrollments(patientUserId: string): Promise<EnrollmentDto> {
        throw new Error('Method not implemented.');
    }

    getParticipantEnrollment(patientUserId: string, provider: string, enrollmentId: any): Promise<EnrollmentDto> {
        throw new Error('Method not implemented.');
    }

    addActivities(activities: CareplanActivityDomainModel[]): Promise<CareplanActivityDto> {
        throw new Error('Method not implemented.');
    }

    addActivity(activity: CareplanActivityDomainModel): Promise<CareplanActivityDto> {
        throw new Error('Method not implemented.');
    }
    
    getActivities(patientUserId: string, day: Date): Promise<CareplanActivityDto[]> {
        throw new Error('Method not implemented.');
    }

    getActivity(activityId: string): Promise<CareplanActivityDto> {
        throw new Error('Method not implemented.');
    }

}

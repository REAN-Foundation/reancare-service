import { CareplanActivityDomainModel } from '../../../../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';
import { CareplanActivityDto } from '../../../../../../domain.types/clinical/careplan/activity/careplan.activity.dto';
import { ParticipantDto } from '../../../../../../domain.types/clinical/careplan/participant/participant.dto';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { EnrollmentDomainModel } from "../../../../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { EnrollmentDto } from "../../../../../../domain.types/clinical/careplan/enrollment/enrollment.dto";
import { ICareplanRepo } from "../../../../../repository.interfaces/careplan/careplan.repo.interface";
import { EnrollmentMapper } from "../../../mappers/careplan/enrollment.mapper";
import CareplanEnrollment from "../../../models/careplan/enrollment.model";
import CareplanParticipant from "../../../models/careplan/participant.model";
import CareplanActivity from "../../../models/careplan/careplan.activity.model";
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { CareplanArtifactMapper } from '../../../mappers/careplan/artifact.mapper';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class CareplanRepo implements ICareplanRepo {

    addPatientWithProvider = async (
        patientUserId: string,
        provider: string,
        participantId: string
    ): Promise<ParticipantDto> => {
        try {
            const entity = {
                PatientUserId : patientUserId,
                Provider      : provider,
                ParticipantId : participantId,
            };
            const participant = await CareplanParticipant.create(entity);
            return participant;
        } catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    getPatientRegistrationDetails = async (patientUserId: string, provider: string): Promise<ParticipantDto> => {
        try {
            var participant = await CareplanParticipant.findOne({
                where : {
                    PatientUserId : patientUserId,
                    Provider      : provider,
                },
            });
            return participant;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    enrollPatient = async (model: EnrollmentDomainModel): Promise<EnrollmentDto> => {
        try {
            const entity = {
                PatientUserId : model.PatientUserId,
                Provider      : model.Provider,
                ParticipantId : model.ParticipantId,
                EnrollmentId  : model.EnrollmentId,
                PlanCode      : model.PlanCode,
                PlanName      : model.PlanName,
                StartDate     : model.StartDate,
                EndDate       : model.EndDate,
                Gender        : model.Gender,
            };
            const enrollment = await CareplanEnrollment.create(entity);
            return EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPatientEnrollments = async (patientUserId: string): Promise<EnrollmentDto[]> => {
        try {
            const enrollments = await CareplanEnrollment.findAll({
                where : {
                    PatientUserId : patientUserId
                }
            });
            const enrollmentDtos = enrollments.map(x => {
                return EnrollmentMapper.toDto(x);
            });
            return enrollmentDtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getPatientEnrollment = async (
        patientUserId: string, provider: string, enrollmentId: any): Promise<EnrollmentDto> => {
        try {
            var enrollment = await CareplanEnrollment.findOne({
                where : {
                    PatientUserId : patientUserId,
                    Provider      : provider,
                    EnrollmentId  : enrollmentId
                },
            });
            return EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    addActivities = async (
        provider: string,
        planName: string,
        planCode: string,
        patientUserId: uuid,
        enrollmentId: string,
        activities: CareplanActivityDomainModel[]): Promise<CareplanActivityDto[]> => {
        try {

            var activityEntities = [];

            activities.forEach(activity => {
                var entity = {
                    Provider         : provider,
                    PlanName         : planName,
                    PlanCode         : planCode,
                    EnrollmentId     : enrollmentId,
                    PatientUserId    : patientUserId,
                    Type             : activity.Type,
                    ProviderActionId : activity.ProviderActionId,
                    Title            : activity.Title,
                    ScheduledAt      : activity.ScheduledAt,
                    Sequence         : activity.Sequence,
                    Frequency        : activity.Frequency,
                    Status           : activity.Status
                };
                activityEntities.push(entity);
            });
            
            const records = await CareplanActivity.bulkCreate(activityEntities);

            var dtos = [];
            records.forEach(async (task) => {
                var dto = CareplanArtifactMapper.toDto(task);
                dtos.push(dto);
            });
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    addActivity = async (
        provider: string,
        planName: string,
        planCode: string,
        patientUserId: uuid,
        enrollmentId: string,
        activity: CareplanActivityDomainModel): Promise<CareplanActivityDto> => {
        try {
            var entity = {
                Provider         : provider,
                PlanName         : planName,
                PlanCode         : planCode,
                EnrollmentId     : enrollmentId,
                PatientUserId    : patientUserId,
                Type             : activity.Type,
                ProviderActionId : activity.ProviderActionId,
                Title            : activity.Title,
                ScheduledAt      : activity.ScheduledAt,
                Sequence         : activity.Sequence,
                Frequency        : activity.Frequency,
                Status           : activity.Status
            };
            const record = await CareplanActivity.create(entity);
            var dto = await CareplanArtifactMapper.toDto(record);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    getActivities = async (patientUserId: string, startTime: Date, endTime: Date): Promise<CareplanActivityDto[]> => {
        try {
            const orderByColum = 'ScheduledAt';
            const order = 'ASC';

            const foundResults = await CareplanActivity.findAndCountAll({
                where : {
                    PatientUserId : patientUserId,
                    ScheduledAt   : {
                        [Op.gte] : startTime,
                        [Op.lte] : endTime,
                    }
                },
                order : [[orderByColum, order]]
            });
            const dtos: CareplanActivityDto[] = [];
            for (const activity of foundResults.rows) {
                const dto = CareplanArtifactMapper.toDto(activity);
                dtos.push(dto);
            }

            // const searchResults = {
            //     TotalCount     : foundResults.count,
            //     RetrievedCount : dtos.length,
            //     Order          : order === 'ASC' ? 'ascending' : 'descending',
            //     OrderedBy      : orderByColum,
            //     Items          : dtos,
            // };

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    getActivity = async (activityId: uuid): Promise<CareplanActivityDto> => {
        try {
            const record = await CareplanActivity.findByPk(activityId);
            return CareplanArtifactMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    updateActivity = async (activityId: uuid, status: string, finishedAt: Date ): Promise<CareplanActivityDto> => {
        try {
            const record = await CareplanActivity.findByPk(activityId);

            if (status != null) {
                record.Status = status;
            }

            if (finishedAt != null) {
                record.CompletedAt = finishedAt;
            }

            return CareplanArtifactMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

}

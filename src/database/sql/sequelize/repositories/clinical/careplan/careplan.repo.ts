import { CareplanActivityDomainModel } from '../../../../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';
import { CareplanActivityDto } from '../../../../../../domain.types/clinical/careplan/activity/careplan.activity.dto';
import { ParticipantDto } from '../../../../../../domain.types/clinical/careplan/participant/participant.dto';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { EnrollmentDomainModel } from "../../../../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { EnrollmentDto } from "../../../../../../domain.types/clinical/careplan/enrollment/enrollment.dto";
import { ICareplanRepo } from "../../../../../repository.interfaces/clinical/careplan.repo.interface";
import { EnrollmentMapper } from "../../../mappers/clinical/careplan/enrollment.mapper";
import CareplanEnrollment from "../../../models/clinical/careplan/enrollment.model";
import CareplanParticipant from "../../../models/clinical/careplan/participant.model";
import CareplanActivity from "../../../models/clinical/careplan/careplan.activity.model";
import { ProgressStatus, uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { CareplanActivityMapper } from '../../../mappers/clinical/careplan/activity.mapper';
import { Op } from 'sequelize';
import { HealthPriorityDto } from '../../../../../../domain.types/users/patient/health.priority/health.priority.dto';
import HealthPriority from '../../../models/users/patient/health.priority.model';
import { HealthPriorityMapper } from '../../../mappers/users/patient/health.priority.mapper';
import { Helper } from '../../../../../../common/helper';
import UserTask from '../../../models/users/user/user.task.model';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';

///////////////////////////////////////////////////////////////////////

export class CareplanRepo implements ICareplanRepo {

    public addPatientWithProvider = async (
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
            return await CareplanParticipant.create(entity);
        } catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    public getPatientRegistrationDetails = async (patientUserId: string, provider: string): Promise<ParticipantDto> => {
        try {
            return await CareplanParticipant.findOne({
                where : {
                    PatientUserId : patientUserId,
                    Provider      : provider,
                },
            });
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public enrollPatient = async (model: EnrollmentDomainModel): Promise<EnrollmentDto> => {
        try {
            const entity = {
                PatientUserId       : model.PatientUserId,
                Provider            : model.Provider,
                ParticipantStringId : model.ParticipantId,
                EnrollmentStringId  : model.EnrollmentId,
                PlanCode            : model.PlanCode,
                PlanName            : model.PlanName,
                StartDate           : model.StartDate,
                EndDate             : model.EndDate,
                Gender              : model.Gender,
            };
            const enrollment = await CareplanEnrollment.create(entity);
            return EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getCareplanEnrollment = async (careplanId: uuid): Promise<EnrollmentDto> => {
        try {
            const enrollment = await CareplanEnrollment.findOne({
                where : {
                    id : careplanId
                }
            });
            return EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getAllCareplanEnrollment = async (): Promise<EnrollmentDto[]> => {
        try {
            const enrollment = await CareplanEnrollment.findAll({
                where : {}
            });
            return enrollment.map(x => {
                return EnrollmentMapper.toDto(x);
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getPatientEnrollments = async (patientUserId: string, isActive: boolean): Promise<EnrollmentDto[]> => {
        try {
            var where_clause = { PatientUserId: patientUserId };
            if (isActive) {
                where_clause['EndDate'] = { [Op.gte]: new Date() };
            } else {
                where_clause['EndDate'] = { [Op.lte]: new Date() };
            }

            const enrollments = await CareplanEnrollment.findAll({
                where : where_clause
            });

            return enrollments.map(x => {
                return EnrollmentMapper.toDto(x);
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getPatientEnrollment = async (
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
    };

    public getEnrollmentByEnrollmentId = async (enrollmentId: string): Promise<EnrollmentDto> => {
        try {
            var enrollment = await CareplanEnrollment.findOne({
                where : {
                    [Op.or] : [
                        {
                            EnrollmentStringId : enrollmentId,
                        },
                        {
                            EnrollmentId : enrollmentId,
                        },
                    ]
                },
            });
            return EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public getCompletedEnrollments = async (daysPassed: number, planNames: string[]): Promise<EnrollmentDto[]> => {
        try {
            var today = new Date();
            var endDate = TimeHelper.subtractDuration(today, daysPassed, DurationType.Day);
            Logger.instance().log(`[HsCron] Enrollment End date:${endDate}`);
            var endOfDay = TimeHelper.endOf(endDate, DurationType.Day);
            var startOfDay = TimeHelper.startOf(endDate, DurationType.Day);
            Logger.instance().log(`[HsCron] start and end of the day:${startOfDay} and ${endOfDay}`);
            var enrollments = await CareplanEnrollment.findAll({
                where : {
                    EndDate : {
                        [Op.and] : [ { [Op.gte]: startOfDay }, { [Op.lte]: endOfDay } ],
                    },
                    PlanName : {
                        [Op.or] : planNames,
                    },
                },
            });
            return enrollments.map(x => {
                return EnrollmentMapper.toDto(x);
            });
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public addActivities = async (
        provider: string,
        planName: string,
        planCode: string,
        patientUserId: uuid,
        enrollmentId: string,
        activities: CareplanActivityDomainModel[]): Promise<CareplanActivityDto[]> => {
        try {

            var activityEntities = [];

            let count = 1;

            activities.forEach(activity => {
                var entity = {
                    Provider         : provider,
                    PlanName         : planName,
                    PlanCode         : planCode,
                    EnrollmentId     : enrollmentId,
                    PatientUserId    : patientUserId,
                    Type             : activity.Type,
                    Category         : activity.Category,
                    ProviderActionId : activity.ProviderActionId,
                    Title            : activity.Title,
                    Description      : activity.Description,
                    Url              : activity.Url,
                    Language         : activity.Language,
                    ScheduledAt      : activity.ScheduledAt,
                    Sequence         : activity.Sequence ?? count,
                    Frequency        : activity.Frequency ?? 1,
                    Status           : activity.Status
                };
                count++;
                activityEntities.push(entity);
            });

            const records = await CareplanActivity.bulkCreate(activityEntities);

            var dtos = [];
            records.forEach(async (task) => {
                var dto = CareplanActivityMapper.toDto(task);
                dtos.push(dto);
            });
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public addActivity = async (
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
            return CareplanActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public getActivities = async (patientUserId: string, startTime: Date, endTime: Date)
        : Promise<CareplanActivityDto[]> => {
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
                const dto = CareplanActivityMapper.toDto(activity);
                dtos.push(dto);
            }
            return dtos;

        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public getActivity = async (activityId: uuid): Promise<CareplanActivityDto> => {
        try {
            const record = await CareplanActivity.findByPk(activityId);
            return CareplanActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public startActivity = async (activityId: string): Promise<CareplanActivityDto> => {
        try {
            var record = await CareplanActivity.findByPk(activityId);
            if (record !== null) {
                record.Status = ProgressStatus.InProgress;
                record.StartedAt = new Date();
                await record.save();
            }
            return CareplanActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public completeActivity = async (activityId: string): Promise<CareplanActivityDto> => {
        try {
            var record = await CareplanActivity.findByPk(activityId);
            if (record !== null) {
                record.Status = ProgressStatus.Completed;
                record.CompletedAt = new Date();
                await record.save();
            }
            return CareplanActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public updateActivity = async (activityId: uuid, status: string, finishedAt: Date )
        : Promise<CareplanActivityDto> => {
        try {
            var record = await CareplanActivity.findByPk(activityId);

            if (status != null) {
                record.Status = status;
            }

            if (finishedAt != null) {
                record.CompletedAt = finishedAt;
            }
            await record.save();

            return CareplanActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public updateActivityDetails = async (activityId: uuid, activityDetails: any)
        : Promise<CareplanActivityDto> => {
        try {
            var record = await CareplanActivity.findByPk(activityId);

            record.RawContent = JSON.stringify(activityDetails.RawContent);
            if (!record.Title) {
                record.Title = activityDetails.Title;
            }
            if (!record.Type) {
                record.Type = activityDetails.Type;
            }
            if (!record.Category || record.Category !== activityDetails.Category) {
                record.Category = activityDetails.Category;
            }
            if (!record.Title) {
                record.Title = activityDetails.Title;
            }
            if (!record.Description) {
                record.Description = activityDetails.Description;
            }
            if (!record.Transcription) {
                record.Transcription = activityDetails.Transcription;
            }
            if (!Helper.isUrl(record.Url)) {
                if (record.Url !== activityDetails.Url && Helper.isUrl(activityDetails.Url)) {
                    record.Url = activityDetails.Url;
                }
                else {
                    record.Url = null;
                }
            }

            var updatedRecord = await record.save();
            return CareplanActivityMapper.toDto(updatedRecord);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public setUserTaskToActivity = async (activityId: any, userTaskId: string): Promise<boolean> => {
        try {
            var record = await CareplanActivity.findByPk(activityId);
            record.UserTaskId = userTaskId;
            await record.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public activityExists = async (
        provider: string,
        enrollmentId: string,
        providerActionId: string,
        sequence: number,
        scheduledAt: Date): Promise<boolean> => {
        try {
            const record = await CareplanActivity.findOne({
                where : {
                    Provider         : provider,
                    EnrollmentId     : enrollmentId,
                    ProviderActionId : providerActionId,
                    Sequence         : sequence,
                    ScheduledAt      : scheduledAt,
                }
            });
            return record !== null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public getPriority = async (id: uuid): Promise<HealthPriorityDto> => {
        try {
            const record = await HealthPriority.findByPk(id);
            return HealthPriorityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public updateActivityUserResponse = async (activityId: uuid, userResponse: string )
        : Promise<CareplanActivityDto> => {
        try {
            var record = await CareplanActivity.findByPk(activityId);

            if (userResponse != null) {
                record.UserResponse = userResponse;
            }

            await record.save();

            return CareplanActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public getAllReanActivities = async ()
        : Promise<CareplanActivityDto[]> => {
        try {
            const orderByColum = 'Sequence';
            const order = 'ASC';

            const foundResults = await CareplanActivity.findAndCountAll({
                where : {
                    Provider : {
                        [Op.or] : ["REAN", "REAN_BW"]
                    },
                },
                order : [[orderByColum, order]]
            });
            const dtos: CareplanActivityDto[] = [];
            for (const activity of foundResults.rows) {
                const dto = CareplanActivityMapper.toDto(activity);
                dtos.push(dto);
            }
            return dtos;

        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public updateRisk = async (model: EnrollmentDomainModel): Promise<EnrollmentDto> => {
        try {
            const updateRisk = await CareplanEnrollment.findOne({
                where : {
                    PatientUserId : model.PatientUserId,
                    Provider      : model.Provider,
                    PlanCode      : model.PlanCode,
                },
            });

            if (model.Complication != null) {
                updateRisk.Complication = model.Complication;
            }
            if (model.HasHighRisk != null) {
                updateRisk.HasHighRisk = model.HasHighRisk;
            }

            await updateRisk.save();

            return EnrollmentMapper.toDto(updateRisk);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public deleteFutureCareplanTask = async (enrollment ): Promise<number> => {
        try {
            var selector = {
                where : {
                    PatientUserId : enrollment.PatientUserId,
                    ScheduledAt   : { [Op.gte]: new Date() }
                }
            };

            const ids = (await CareplanActivity.findAll(selector)).map(x => x.id);
            const deletedCount = await CareplanActivity.destroy(selector);
            Logger.instance().log(`Deleted ${deletedCount} careplan task.`);

            if (deletedCount > 0) {
                var deletedTaskCount = await UserTask.destroy({
                    where : {
                        ActionId : ids, //ActionType : UserTaskActionType.Medication
                    }
                });
                Logger.instance().log(`Deleted ${deletedTaskCount} careplan associated user tasks.`);

            }
            return deletedCount;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

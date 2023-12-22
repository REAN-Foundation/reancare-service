import { Op } from 'sequelize';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { PhysicalActivityDomainModel } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivityDto } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto';
import { PhysicalActivitySearchFilters, PhysicalActivitySearchResults } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types';
import { IPhysicalActivityRepo } from '../../../../../repository.interfaces/wellness/exercise/physical.activity.repo.interface';
import { PhysicalActivityMapper } from '../../../mappers/wellness/exercise/physical.activity.mapper';
import PhysicalActivity from '../../../models/wellness/exercise/physical.activity.model';
import Patient from '../../../models/users/patient/patient.model';
import User from '../../../models/users/user/user.model';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class PhysicalActivityRepo implements IPhysicalActivityRepo {

    public create = async (createModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        try {
            const entity = {
                id                          : createModel.id,
                PatientUserId               : createModel.PatientUserId,
                Exercise                    : createModel.Exercise ?? null,
                Description                 : createModel.Description ?? null,
                Category                    : createModel.Category,
                Intensity                   : createModel.Intensity ?? null,
                CaloriesBurned              : createModel.CaloriesBurned ?? null,
                StartTime                   : createModel.StartTime ?? null,
                EndTime                     : createModel.EndTime ?? null,
                DurationInMin               : createModel.DurationInMin ?? null,
                TerraSummaryId              : createModel.TerraSummaryId ?? null,
                Provider                    : createModel.Provider ?? null,
                PhysicalActivityQuestion    : "Did you add movement to your day today?",
                PhysicalActivityQuestionAns : createModel.PhysicalActivityQuestionAns ?? null,
            };
            const physicalActivity = await PhysicalActivity.create(entity);
            return await PhysicalActivityMapper.toDto(physicalActivity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getById = async (id: uuid): Promise<PhysicalActivityDto> => {
        try {
            const physicalActivity = await PhysicalActivity.findByPk(id);
            return await PhysicalActivityMapper.toDto(physicalActivity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public search = async (filters: PhysicalActivitySearchFilters): Promise<PhysicalActivitySearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Exercise != null) {
                search.where['Exercise'] = { [Op.like]: '%' + filters.Exercise + '%' };
            }
            if (filters.Category != null) {
                search.where['Category'] = { [Op.like]: '%' + filters.Category + '%' };
            }

            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await PhysicalActivity.findAndCountAll(search);

            const dtos: PhysicalActivityDto[] = [];
            for (const physicalActivity of foundResults.rows) {
                const dto = await PhysicalActivityMapper.toDto(physicalActivity);
                dtos.push(dto);
            }

            const searchResults: PhysicalActivitySearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };
            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line max-len
    public update = async (id: uuid, updateModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        try {
            const physicalActivity = await PhysicalActivity.findOne({ where: { id: id } });

            if (updateModel.PatientUserId != null) {
                physicalActivity.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Exercise != null) {
                physicalActivity.Exercise = updateModel.Exercise;
            }
            if (updateModel.Description != null) {
                physicalActivity.Description = updateModel.Description;
            }
            if (updateModel.Category != null) {
                physicalActivity.Category = updateModel.Category;
            }
            if (updateModel.Intensity != null) {
                physicalActivity.Intensity = updateModel.Intensity;
            }
            if (updateModel.CaloriesBurned != null) {
                physicalActivity.CaloriesBurned = updateModel.CaloriesBurned;
            }
            if (updateModel.StartTime != null) {
                physicalActivity.StartTime = updateModel.StartTime;
            }
            if (updateModel.EndTime != null) {
                physicalActivity.EndTime = updateModel.EndTime;
            }
            if (updateModel.DurationInMin != null) {
                physicalActivity.DurationInMin = updateModel.DurationInMin;
            }
            await physicalActivity.save();

            return await PhysicalActivityMapper.toDto(physicalActivity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public delete = async (id: uuid): Promise<boolean> => {
        try {
            await PhysicalActivity.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const numDays = 30 * numMonths;
            const questionnaireStats = await this.getQuestionnaireStats(patientUserId, numDays);
            const calorieStats = await this.getDayByDayCalorieStats(patientUserId, numDays);
            return {
                QuestionnaireStats : questionnaireStats,
                CalorieStats       : calorieStats,
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#region Privates

    private async getQuestionnaireStats(patientUserId: string, numDays: number) {
        const timezone = await this.getPatientTimezone(patientUserId);
        var offsetMinutes = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        const reference = TimeHelper.getStartOfDay(new Date(), offsetMinutes);
        const records = await this.getQuestionnaireRecords(patientUserId, numDays, DurationType.Day);
        const quesrionnaireStats = records.map(x => {
            const tempDate = TimeHelper.addDuration(x.CreatedAt, offsetMinutes, DurationType.Minute);
            const dayStr = tempDate.toISOString()
                .split('T')[0];
            return {
                Response : x.PhysicalActivityQuestionAns === true ? 1 : 0,
                DayStr   : dayStr,
            };
        });
        const stats = [];
        for (var day of dayList) {
            var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            const dayStr = dayStart.toISOString().split('T')[0];
            const x = quesrionnaireStats.find(r => r.DayStr === dayStr);
            if (x) {
                stats.push({
                    Response : x.Response,
                    DayStr   : x.DayStr,
                });
            }
            else {
                stats.push({
                    Response : 0,
                    DayStr   : dayStr,
                });
            }
        }
        return {
            Question : `Did you add movement to your day today?`,
            Stats    : stats,
        };
    }

    private async getQuestionnaireRecords(patientUserId: string, count: number, unit: DurationType) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), count, unit);
        let records = await PhysicalActivity.findAll({
            where : {
                PatientUserId            : patientUserId,
                PhysicalActivityQuestion : {
                    [Op.not] : null,
                },
                CreatedAt : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
        return records;
    }

    private async getDayByDayCalorieStats(patientUserId: string, numDays: number) {

        const timezone = await this.getPatientTimezone(patientUserId);
        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        var offsetMinutes = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
        const reference = TimeHelper.getStartOfDay(new Date(), offsetMinutes);
        const stats = [];

        //Check whether the records exist or not
        const from = TimeHelper.subtractDuration(reference, numDays, DurationType.Day);
        const records = await PhysicalActivity.findAll({
            where : {
                PatientUserId            : patientUserId,
                PhysicalActivityQuestion : null,
                CreatedAt                : {
                    [Op.gte] : from,
                    [Op.lte] : new Date(),
                }
            }
        });
        if (records.length === 0) {
            return [];
        }

        for await (var day of dayList) {

            var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            var dayEnd = TimeHelper.subtractDuration(reference, (day - 1) * 24, DurationType.Hour);

            const dayStr = dayStart.toISOString().split('T')[0];

            const consumptions = await PhysicalActivity.findAll({
                where : {
                    PatientUserId            : patientUserId,
                    PhysicalActivityQuestion : null,
                    CreatedAt                : {
                        [Op.gte] : dayStart,
                        [Op.lte] : dayEnd,
                    }
                }
            });
            let totalCaloriesForDay = 0;
            consumptions.forEach((e) => {
                totalCaloriesForDay += e.CaloriesBurned;
            });

            let totalMoveMinutesForDay = 0;
            consumptions.forEach((e) => {
                totalMoveMinutesForDay += e.DurationInMin;
            });

            stats.push({
                DayStr      : dayStr,
                Calories    : totalCaloriesForDay,
                MoveMinutes : totalMoveMinutesForDay
            });
        }
        const stats_ = stats.sort((a, b) => new Date(a.DayStr).getTime() - new Date(b.DayStr).getTime());
        return stats_;
    }

    private async getPatientTimezone(patientUserId: string) {
        let timezone = '+05:30';
        const patient = await Patient.findOne({
            where : {
                UserId : patientUserId
            },
            include : [
                {
                    model    : User,
                    as       : 'User',
                    required : true,
                }
            ]
        });
        if (patient) {
            timezone = patient.User.CurrentTimeZone;
        }
        return timezone;
    }

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await PhysicalActivity.findAll({
                where : {
                    PatientUserId               : patientUserId,
                    PhysicalActivityQuestionAns : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.gte] : dateFrom,
                        [Op.lte] : dateTo,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                var recordDate = x.StartTime ?? x.EndTime;
                if (!recordDate) {
                    recordDate = x.CreatedAt;
                }
                const tempDate = TimeHelper.addDuration(recordDate, offsetMinutes, DurationType.Minute);
                const recordDateStr = await TimeHelper.formatDateToLocal_YYYY_MM_DD(recordDate);
                Logger.instance().log(`RecordDate: ${tempDate} RecordDateStr: ${recordDateStr}`);
                return {
                    RecordId                    : x.id,
                    PatientUserId               : x.PatientUserId,
                    PhysicalActivityQuestionAns : x.PhysicalActivityQuestionAns,
                    RecordDate                  : tempDate,
                    RecordDateStr               : recordDateStr,
                    RecordTimeZone              : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date): Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await PhysicalActivity.findAll({
                where : {
                    PatientUserId               : patientUserId,
                    PhysicalActivityQuestionAns : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.lte] : date,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                var recordDate = x.StartTime ?? x.EndTime;
                if (!recordDate) {
                    recordDate = x.CreatedAt;
                }
                const tempDate = TimeHelper.addDuration(recordDate, offsetMinutes, DurationType.Minute);
                return {
                    RecordId                    : x.id,
                    PatientUserId               : x.PatientUserId,
                    PhysicalActivityQuestionAns : x.PhysicalActivityQuestionAns,
                    RecordDate                  : tempDate,
                    RecordDateStr               : await TimeHelper.formatDateToLocal_YYYY_MM_DD(recordDate),
                    RecordTimeZone              : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRecent = async (patientUserId: string): Promise<PhysicalActivityDto> => {
        try {
            const record = await PhysicalActivity.findOne({
                where : {
                    PatientUserId : patientUserId,
                },
                order : [['CreatedAt', 'DESC']]
            });
            return await PhysicalActivityMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#endregion

}

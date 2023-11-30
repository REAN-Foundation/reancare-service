import { Op } from 'sequelize';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { TimeHelper } from '../../../../../../common/time.helper';
import { MedicationConsumptionDomainModel } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { IMedicationConsumptionRepo } from '../../../../../repository.interfaces/clinical/medication/medication.consumption.repo.interface';
import { MedicationConsumptionMapper } from '../../../mappers/clinical/medication/medication.consumption.mapper';
import MedicationConsumption from '../../../models/clinical/medication/medication.consumption.model';
import Medication from '../../../models/clinical/medication/medication.model';
import UserTask from '../../../models/users/user/user.task.model';
import Patient from '../../../models/users/patient/patient.model';
import User from '../../../models/users/user/user.model';
import { HelperRepo } from '../../common/helper.repo';
import { id_ID } from '@faker-js/faker';

///////////////////////////////////////////////////////////////////////

export class MedicationConsumptionRepo implements IMedicationConsumptionRepo {

    create = async (model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto> => {
        try {
            var entity = {
                PatientUserId     : model.PatientUserId,
                MedicationId      : model.MedicationId,
                DrugName          : model.DrugName,
                DrugId            : model.DrugId,
                Dose              : model.Dose,
                Details           : model.Details,
                TimeScheduleStart : model.TimeScheduleStart,
                TimeScheduleEnd   : model.TimeScheduleEnd,
            };
            const consumption = await MedicationConsumption.create(entity);
            return MedicationConsumptionMapper.toDto(consumption);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsTaken = async(id: uuid, takenAt: Date): Promise<MedicationConsumptionDetailsDto> => {
        try {
            const consumption = await MedicationConsumption.findByPk(id);

            if (consumption === null) {
                return null;
            }
            consumption.IsMissed = false;
            consumption.IsTaken = true;
            consumption.TakenAt = takenAt;
            consumption.IsCancelled = false;
            consumption.CancelledOn = null;

            await consumption.save();

            var dto = MedicationConsumptionMapper.toDetailsDto(consumption);
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsMissed = async(id: uuid): Promise<MedicationConsumptionDetailsDto> => {
        try {
            const consumption = await MedicationConsumption.findByPk(id);

            if (consumption === null) {
                return null;
            }
            consumption.IsMissed = true;
            consumption.IsTaken = false;
            consumption.TakenAt = null;
            consumption.IsCancelled = false;
            consumption.CancelledOn = null;

            await consumption.save();

            var dto = MedicationConsumptionMapper.toDetailsDto(consumption);
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteFutureMedicationSchedules = async(medicationId: uuid): Promise<number> => {
        try {

            var selector = {
                where : {
                    MedicationId      : medicationId,
                    TimeScheduleStart : { [Op.gte] : new Date(new Date().toISOString()
                        .split('T')[0]) }
                }
            };

            const ids = (await MedicationConsumption.findAll(selector)).map(x => x.id);
            const deletedCount = await MedicationConsumption.destroy(selector);
            Logger.instance().log(`Deleted ${deletedCount} medication consumptions.`);

            if (deletedCount > 0) {
                var deletedTaskCount = await UserTask.destroy({
                    where : {
                        ActionId : ids, //ActionType : UserTaskActionType.Medication
                    }
                });
                Logger.instance().log(`Deleted ${deletedTaskCount} medication associated user tasks.`);

            }
            return deletedCount;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getSchedulesForMedication = async(medicationId: uuid): Promise<MedicationConsumptionDto[]> => {
        try {
            var selector = {
                where : {
                    MedicationId : medicationId,
                }
            };
            var dtos: MedicationConsumptionDto[] = [];
            const consumptions = await MedicationConsumption.findAll(selector);
            for (const consumption of consumptions) {
                const dto = await MedicationConsumptionMapper.toDetailsDto(consumption);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // updateTimeZoneForFutureMedicationSchedules = async(
    //     medicationId: string,
    //     currentTimeZone: string,
    //     newTimeZone: string): Promise<number> => {
    // }

    getById = async (id: uuid): Promise<MedicationConsumptionDetailsDto> => {
        try {
            const consumption = await MedicationConsumption.findByPk(id);
            return await MedicationConsumptionMapper.toDetailsDto(consumption);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByMedicationId = async (id: string): Promise<MedicationConsumptionDetailsDto[]> => {
        try {
            const consumptions = await MedicationConsumption.findAll({
                where : {
                    MedicationId   : id,
                }
            });
            var dtos = consumptions.map(x => MedicationConsumptionMapper.toDetailsDto(x));
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllTakenBefore = async (patientUserId: uuid, date: Date): Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await MedicationConsumption.findAll({
                where : {
                    PatientUserId   : patientUserId,
                    TimeScheduleEnd : {
                        [Op.lte] : date,
                    }
                }
            });
            Logger.instance().log(`All records taken before - repo :: ${JSON.stringify(records)}`);
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                const tempDate = TimeHelper.addDuration(x.TimeScheduleEnd, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    Taken          : x.IsTaken,
                    DrugName       : x.DrugName,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.TimeScheduleEnd),
                    RecordDate     : tempDate,
                    RecordTimeZone : currentTimeZone,
                };
            });
            Logger.instance().log(`All records_ taken before - repo :: ${JSON.stringify(records_)}`);

            return records_;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllTakenBetween = async (patientUserId: uuid, from: Date, to: Date)
        : Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await MedicationConsumption.findAll({
                where : {
                    PatientUserId   : patientUserId,
                    TimeScheduleEnd : {
                        [Op.gte] : from,
                        [Op.lte] : to,
                    }
                }
            });
            Logger.instance().log(`All records taken between - repo :: ${JSON.stringify(records)}`);
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                const tempDate = TimeHelper.addDuration(x.TimeScheduleEnd, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    Taken          : x.IsTaken,
                    DrugName       : x.DrugName,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.TimeScheduleEnd),
                    RecordDate     : tempDate,
                    RecordTimeZone : currentTimeZone,
                };
            });
            Logger.instance().log(`All records_ taken between - repo :: ${JSON.stringify(records_)}`);

            return records_;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: MedicationConsumptionSearchFilters): Promise<MedicationConsumptionSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MedicationId != null) {
                search.where['MedicationId'] = filters.MedicationId;
            }
            if (filters.OrderId != null) {
                search.where['OrderId'] = filters.OrderId;
            }

            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['TimeScheduleStart'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom != null && filters.DateTo == null) {
                search.where['TimeScheduleStart'] = {
                    [Op.gte] : filters.DateFrom,
                };
            } else if (filters.DateFrom == null && filters.DateTo != null) {
                search.where['TimeScheduleStart'] = {
                    [Op.lte] : filters.DateTo,
                };
            }

            let orderByColum = 'TimeScheduleStart';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage > 0) {
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

            const foundResults = await MedicationConsumption.findAndCountAll(search);

            const dtos: MedicationConsumptionDto[] = [];
            for (const consumption of foundResults.rows) {
                const dto = await MedicationConsumptionMapper.toDetailsDto(consumption);
                dtos.push(dto);
            }

            const searchResults: MedicationConsumptionSearchResults = {
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

    getSchedulesForDay = async(patientUserId: uuid, date: Date)
        : Promise<MedicationConsumptionDto[]> => {
        try {

            var dayStart = date;
            var dayEnd = TimeHelper.addDuration(dayStart, 24, DurationType.Hour);

            var search = {
                PatientUserId     : patientUserId,
                TimeScheduleStart : {
                    [Op.gte] : dayStart,
                    [Op.lte] : dayEnd
                },
                IsCancelled : false
            };

            const entities = await MedicationConsumption.findAll({
                where : search
            });

            var dtos = entities.map(x => MedicationConsumptionMapper.toDto(x));
            var fn = (a, b) => {
                return a.TimeScheduleStart.getTime() - b.TimeScheduleStart.getTime();
            };
            dtos.sort(fn);
            return dtos;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getSchedulesForPatientForDuration = async (patientUserId: string, from: Date, to: Date)
    : Promise<MedicationConsumptionDto[]> => {
        try {

            const entities = await MedicationConsumption.findAll({
                where : {
                    PatientUserId     : patientUserId,
                    TimeScheduleStart : {
                        [Op.lte] : to,
                        [Op.gte] : from
                    },
                    IsCancelled : false
                }
            });

            return entities.map(x => MedicationConsumptionMapper.toDto(x));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getSchedulesForDuration = async (from: Date, to: Date, filterTaken: boolean)
    : Promise<MedicationConsumptionDto[]> => {
        try {

            var filter =  {
                TimeScheduleStart : {
                    [Op.lte] : to,
                    [Op.gte] : from
                },
                IsCancelled : false
            };

            if (filterTaken) {
                filter['IsTaken'] = false;
            }

            const entities = await MedicationConsumption.findAll({
                where : filter
            });

            return entities.map(x => MedicationConsumptionMapper.toDto(x));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: uuid): Promise<boolean> => {
        try {
            await Medication.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPendingConsumptionCountForMedication = async (medicationId: uuid): Promise<number> => {

        try {

            const count = await MedicationConsumption.count({
                where : {
                    MedicationId      : medicationId,
                    IsCancelled       : false,
                    TimeScheduleStart : {
                        [Op.gte] : new Date()
                    },
                }
            });

            return count;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

    };

    getTotalConsumptionCountForMedication = async (medicationId: uuid): Promise<number> => {

        try {

            const count = await MedicationConsumption.count({
                where : {
                    MedicationId : medicationId,
                    IsCancelled  : false
                }
            });

            return count;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

    };

    cancelSchedule = async (id: uuid): Promise<boolean> => {

        try {

            var schedule = await MedicationConsumption.findByPk(id);
            if (schedule === null) {
                return false;
            }
            schedule.IsCancelled = true;
            schedule.CancelledOn = new Date();
            await schedule.save();

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

    };

    assignEhrId = async(id: string, ehrId: string): Promise<MedicationConsumptionDetailsDto> => {
        try {
            const consumption = await MedicationConsumption.findByPk(id);

            if (consumption === null) {
                return null;
            }
            consumption.EhrId = ehrId;

            await consumption.save();

            var dto = MedicationConsumptionMapper.toDetailsDto(consumption);
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const numDays = 30 * numMonths;
            return await this.getDayByDayStats(patientUserId, numDays);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getDayByDayStats(patientUserId: string, numDays: number) {

        const timezone = await this.getPatientTimezone(patientUserId);
        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        var offsetMinutes = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
        const reference = TimeHelper.getStartOfDay(new Date(), offsetMinutes);

        const stats = [];

        //Check whether the records exist or not
        const from = TimeHelper.subtractDuration(reference, numDays, DurationType.Day);
        const records = await MedicationConsumption.findAll({
            where : {
                PatientUserId     : patientUserId,
                TimeScheduleStart : {
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

            const takenCount = await MedicationConsumption.count({
                where : {
                    PatientUserId     : patientUserId,
                    TimeScheduleStart : {
                        [Op.gte] : dayStart,
                        [Op.lte] : dayEnd
                    },
                    IsCancelled : false,
                    IsTaken     : true,
                    IsMissed    : false,
                }
            });
            const missedCount = await MedicationConsumption.count({
                where : {
                    PatientUserId     : patientUserId,
                    TimeScheduleStart : {
                        [Op.gte] : dayStart,
                        [Op.lte] : dayEnd
                    },
                    IsCancelled : false,
                    IsTaken     : false,
                    IsMissed    : true,
                }
            });
            stats.push({
                DayStr      : dayStr,
                TakenCount  : takenCount,
                MissedCount : missedCount,
            });
        }
        const stats_ = stats.sort((a, b) => new Date(a.DayStr).getTime() - new Date(b.DayStr).getTime());

        const totalMissed = stats.map(x => x.MissedCount).reduce((a, b) => a + b, 0);
        const totalTaken = stats.map(x => x.TakenCount).reduce((a, b) => a + b, 0);

        return {
            TotalMissedCount : totalMissed,
            TotalTakenCount  : totalTaken,
            Daily            : stats_
        };
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

}

import { Op } from 'sequelize';
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
import UserTask from '../../../models/user/user.task.model';

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

    markAsTaken = async(id: string, takenAt: Date): Promise<MedicationConsumptionDetailsDto> => {
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

    markAsMissed = async(id: string): Promise<MedicationConsumptionDetailsDto> => {
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

    deleteFutureMedicationSchedules = async(medicationId: string): Promise<number> => {
        try {

            var selector = {
                where : {
                    MedicationId      : medicationId,
                    TimeScheduleStart : { [Op.gte]: new Date() }
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

    getSchedulesForMedication = async(medicationId: string): Promise<MedicationConsumptionDto[]> => {
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
    
    getById = async (id: string): Promise<MedicationConsumptionDetailsDto> => {
        try {
            const consumption = await MedicationConsumption.findByPk(id);
            return await MedicationConsumptionMapper.toDetailsDto(consumption);
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
            } else {
                search.where['TimeScheduleEnd'] = {
                    [Op.gte] : new Date(),
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

    getSchedulesForDay = async(patientUserId: string, date: Date)
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

    getSchedulesForDuration = async (from: Date, to: Date)
    : Promise<MedicationConsumptionDto[]> => {
        try {
   
            const entities = await MedicationConsumption.findAll({
                where : {
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

    delete = async (id: string): Promise<boolean> => {
        try {
            await Medication.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPendingConsumptionCountForMedication = async (medicationId: string): Promise<number> => {
        
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

    getTotalConsumptionCountForMedication = async (medicationId: string): Promise<number> => {

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

    cancelSchedule = async (id: string): Promise<boolean> => {
        
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

}

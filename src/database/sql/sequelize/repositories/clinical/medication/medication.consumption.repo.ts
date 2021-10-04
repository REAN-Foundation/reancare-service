import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { TimeHelper } from '../../../../../../common/time.helper';
import { MedicationConsumptionDomainModel } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { ConsumptionSummaryDto, MedicationConsumptionDetailsDto, MedicationConsumptionDto } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { IMedicationConsumptionRepo } from '../../../../../repository.interfaces/clinical/medication/medication.consumption.repo.interface';
import { MedicationConsumptionMapper } from '../../../mappers/clinical/medication/medication.consumption.mapper';
import MedicationConsumption from '../../../models/clinical/medication/medication.consumption.model';
import Medication from '../../../models/clinical/medication/medication.model';

///////////////////////////////////////////////////////////////////////

export class MedicationConsumptionRepo implements IMedicationConsumptionRepo {

    create = async (model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto> => {
        try {
            var entity = {
                PatientUserId     : model.PatientUserId,
                MedicationId      : model.id,
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
    }

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
    }

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
    }

    cancelFutureMedicationSchedules = async(medicationId: string): Promise<number> => {
        try {

            var selector = {
                where : {
                    IsCancelled       : false,
                    MedicationId      : medicationId,
                    TimeScheduleStart : { [Op.gte]: Date.now() }
                }
            };

            var value = {
                IsMissed    : false,
                IsTaken     : false,
                TakenAt     : null,
                IsCancelled : true,
                CancelledOn : Date.now()
            };
            
            const result = await MedicationConsumption.update(value, selector);

            var updatedCount = result[0];

            var updatedConsumptions = result[1];
            var ids = updatedConsumptions.length > 0 ? updatedConsumptions.map(x => x.id) : [];
            var idsStr = JSON.stringify(ids, null, 2);
            Logger.instance().log('Cancelled consumption Ids are - \n ' + idsStr);

            return updatedCount;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    deleteFutureMedicationSchedules = async(medicationId: string): Promise<number> => {
        try {

            var selector = {
                where : {
                    MedicationId      : medicationId,
                    TimeScheduleStart : { [Op.gte]: Date.now() }
                }
            };
            
            const deletedCount = await MedicationConsumption.destroy(selector);
            Logger.instance().log(`Deleted ${deletedCount} medication consumptions`);

            return deletedCount;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

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
                search.where['TimeScheduleStart'] = {
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

    getScheduleForDay = async(patientUserId: string, date: Date, groupByDrug: boolean)
        : Promise<MedicationConsumptionDto[]> => {
        try {
            
            var consumptions = await this.forDay(patientUserId, date);
            if (groupByDrug) {
                var listByDrugName = {};
                for (i = 0; i < meds.length; i++) {
                    var drug = meds[i].DrugName;
                    if (!listByDrugName[drug]) {
                        listByDrugName[drug] = [];
                    }
                    listByDrugName[drug].push(meds[i]);
                }
                return listByDrugName;
            }

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getSummaryForDay = async (patientUserId: string, date: Date): Promise<ConsumptionSummaryDto> => {
        try {
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getSummaryByCalendarMonths = (patientUserId: string, pastMonthsCount: number,
        futureMonthsCount: number): Promise<ConsumptionSummaryForMonthDto[]> => {
        try {
        
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getScheduleForDuration = async (patientUserId: string, durationInHours: number, when: string)
    : Promise<MedicationConsumptionDto[]> => {
        try {
   
            var search = {};
    
            if (when === 'past') {
                var from = TimeHelper.subtractDuration(new Date(), durationInHours, DurationType.Hours);
                search = {
                    PatientUserId     : patientUserId,
                    TimeScheduleStart : {
                        [Op.lte] : Date.now(),
                        [Op.gte] : from
                    },
                    IsCancelled : false
                };
            }
            if (when === 'future') {
                var to = TimeHelper.addDuration(new Date(), durationInHours, DurationType.Hours);
                search = {
                    PatientUserId     : patientUserId,
                    TimeScheduleStart : {
                        [Op.gte] : Date.now(),
                        [Op.lte] : to
                    },
                    IsCancelled : false
                };
            }
            if (when === 'current') {

                var currentDurationSlotHrs = 2;
                var from = TimeHelper.subtractDuration(new Date(), currentDurationSlotHrs, DurationType.Hours);
                var to = TimeHelper.addDuration(new Date(), currentDurationSlotHrs, DurationType.Hours);

                search = {
                    PatientUserId     : patientUserId,
                    TimeScheduleStart : {
                        [Op.gte] : from,
                        [Op.lte] : to
                    },
                    IsCancelled : false
                };
            }
    
            const entities = await MedicationConsumption.findAll({
                where : search
            });
    
            var dtos = entities.map(x => MedicationConsumptionMapper.toDto(x));

            var fn = (a: MedicationConsumptionDto, b: MedicationConsumptionDto): any => {
                return a.TimeScheduleStart - b.TimeScheduleStart;
            };
            if (when === 'past') {
                fn = (a, b) => {
                    return b.TimeScheduleStart - a.TimeScheduleStart;
                };
            }
            dtos.sort(fn);
    
            return dtos;
    
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

    //#region Privates

    private forDay = async(patientUserId: string, date: Date): Promise<MedicationConsumptionDto[]> => {
        try {

            var dayStart = date;
            var dayEnd = TimeHelper.addDuration(dayStart, 24, DurationType.Hours);
    
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
    
            var fn = (a, b) => { return new Date(a.TimeScheduleStart) - new Date(b.TimeScheduleStart); };
            dtos.sort(fn);
    
            return dtos;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
    //#endregion

}

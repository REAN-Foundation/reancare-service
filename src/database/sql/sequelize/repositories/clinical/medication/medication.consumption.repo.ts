import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { MedicationConsumptionDomainModel } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
import { IMedicationConsumptionRepo } from '../../../../../repository.interfaces/clinical/medication/medication.consumption.repo.interface';
import { MedicationConsumptionMapper } from '../../../mappers/clinical/medication/medication.consumption.mapper';
import { MedicationMapper } from '../../../mappers/clinical/medication/medication.mapper';
import MedicationConsumption from '../../../models/clinical/medication/medication.consumption.model';
import Medication from '../../../models/clinical/medication/medication.model';

///////////////////////////////////////////////////////////////////////

export class MedicationConsumptionRepo implements IMedicationConsumptionRepo {

    update(id: string, model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto> {
        throw new Error('Method not implemented.');
    }

    create(model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto> {
        throw new Error('Method not implemented.');
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

    getScheduleForDay(patientUserId: string, date: Date, groupByDrug: boolean): Promise<MedicationConsumptionDto[]>;

    getSummaryForDay(patientUserId: string, date: Date): Promise<ConsumptionSummaryDto>;

    getSummaryByCalendarMonths(patientUserId: string, pastMonthsCount: number,
        futureMonthsCount: number): Promise<ConsumptionSummaryForMonthDto[]>;

    getScheduleForDuration = async (patientUserId: string, duration: string, when: string): Promise<MedicationConsumptionDto[]> => {
        try {
            const medication = await Medication.findByPk(id);

            if (model.EhrId != null) {
                medication.EhrId = model.EhrId;
            }
            if (model.MedicalPractitionerUserId != null) {
                medication.MedicalPractitionerUserId = model.MedicalPractitionerUserId;
            }
            if (model.VisitId != null) {
                medication.VisitId = model.VisitId;
            }
            if (model.OrderId != null) {
                medication.OrderId = model.OrderId;
            }

            // if (model.DrugName != null) {
            //     medication.DrugName = model.DrugName;
            // }
            
            if (model.DrugId != null) {
                medication.DrugId = model.DrugId;
            }
            if (model.Dose != null) {
                medication.Dose = model.Dose;
            }
            if (model.DosageUnit != null) {
                medication.DosageUnit = model.DosageUnit;
            }
            if (model.TimeSchedules != null) {
                var schedules = JSON.stringify(model.TimeSchedules);
                medication.TimeSchedules = schedules;
            }
            if (model.Frequency != null) {
                medication.Frequency = model.Frequency;
            }
            if (model.FrequencyUnit != null) {
                medication.FrequencyUnit = model.FrequencyUnit;
            }
            if (model.Route != null) {
                medication.Route = model.Route;
            }
            if (model.Duration != null) {
                medication.Duration = model.Duration;
            }
            if (model.DurationUnit != null) {
                medication.DurationUnit = model.DurationUnit;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }

            await medication.save();

            const dto = await MedicationMapper.toDto(medication);
            return dto;
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

}

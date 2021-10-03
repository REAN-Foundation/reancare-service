import { inject, injectable } from "tsyringe";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationStockImageRepo } from "../../../database/repository.interfaces/clinical/medication/medication.stock.image.repo.interface";
import { MedicationStockImageDto } from "../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto";
import { MedicationDomainModel } from '../../../domain.types/clinical/medication/medication/medication.domain.model';
import { MedicationDto } from '../../../domain.types/clinical/medication/medication/medication.dto';
import { MedicationSearchFilters, MedicationSearchResults } from '../../../domain.types/clinical/medication/medication/medication.search.types';
import { ConsumptionSummaryByDrugDto, ConsumptionSummaryDto, ConsumptionSummaryForMonthDto, MedicationConsumptionDetailsDto, MedicationConsumptionDto } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { Logger } from "../../../common/logger";
import { MedicationConsumptionScheduleDomainModel } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicationConsumptionService {

    constructor(
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IMedicationStockImageRepo') private _medicationStockImageRepo: IMedicationStockImageRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
    ) {}

    markListAsTaken = async (consumptionIds: string[]): Promise<MedicationConsumptionDto[]> => {

        try {

            var takenMeds = [];
    
            for await (var id of consumptionIds) {
                
                var medConsumption = await this._medicationConsumptionRepo.getById(id);
                if (medConsumption === null) {
                    Logger.instance().log('Medication consumption instance with given id cannot be found.');
                    continue;
                }
    
                if (medConsumption.Status == 'missed') {
                    Logger.Log('Medication consumption instance with given id already marked as missed.');
                    continue;
                }
    
                if (medConsumption.Status == 'taken') {
                    Logger.Log('Medication consumption instance with given id already marked as taken.');
                    continue;
                }
    
                var takenAt = Date.now();
                if (moment(Date.now()).isAfter(moment(medConsumption.TimeScheduleEnd))) {
                    takenAt = medConsumption.TimeScheduleEnd;
                }
                var value = {
                    IsMissed    : false,
                    IsTaken     : true,
                    TakenAt     : takenAt,
                    IsCancelled : false,
                    CancelledOn : null
                };
    
                var res = await MedicationConsumption.update(value, {
                    where : { id: id }
                });
                if (res.length != 1) {
                    Logger.Log('Unable to mark medication as taken!');
                    continue;
                }
    
                try {
                    await PatientTaskHandler.UpdatePatientTask(medConsumption.id, true, takenAt, true, takenAt, true);
                }
                catch (updateError) {
                    Logger.Log("Medication consumption missing corresponding parent task!");
                }
    
                var entity = await this.GetMedicationConsumption(id);
                var obj = GetMedicationConsumptionObject(entity);
                takenMeds.push(obj);
            }
            return takenMeds;
        }
        catch (error) {
            var msg = 'Unable to mark medication as taken!';
            ErrorHandler.ThrowServiceError(error, msg);
        }

        //return await this._medicationRepo.create(medicationDomainModel);
    };

    markListAsMissed = async (consumptionIds: string[]): Promise<MedicationConsumptionDto[]> => {

        try {

            var takenMeds = [];
    
            for await (var id of consumptionIds) {
                
                var medConsumption = await this._medicationConsumptionRepo.getById(id);
                if (medConsumption === null) {
                    Logger.instance().log('Medication consumption instance with given id cannot be found.');
                    continue;
                }
    
                if (medConsumption.Status == 'missed') {
                    Logger.Log('Medication consumption instance with given id already marked as missed.');
                    continue;
                }
    
                if (medConsumption.Status == 'taken') {
                    Logger.Log('Medication consumption instance with given id already marked as taken.');
                    continue;
                }
    
                var takenAt = Date.now();
                if (moment(Date.now()).isAfter(moment(medConsumption.TimeScheduleEnd))) {
                    takenAt = medConsumption.TimeScheduleEnd;
                }
                var value = {
                    IsMissed    : false,
                    IsTaken     : true,
                    TakenAt     : takenAt,
                    IsCancelled : false,
                    CancelledOn : null
                };
    
                var res = await MedicationConsumption.update(value, {
                    where : { id: id }
                });
                if (res.length != 1) {
                    Logger.Log('Unable to mark medication as taken!');
                    continue;
                }
    
                try {
                    await PatientTaskHandler.UpdatePatientTask(medConsumption.id, true, takenAt, true, takenAt, true);
                }
                catch (updateError) {
                    Logger.Log("Medication consumption missing corresponding parent task!");
                }
    
                var entity = await this.GetMedicationConsumption(id);
                var obj = GetMedicationConsumptionObject(entity);
                takenMeds.push(obj);
            }
            return takenMeds;
        }
        catch (error) {
            var msg = 'Unable to mark medication as taken!';
            ErrorHandler.ThrowServiceError(error, msg);
        }

        //return await this._medicationRepo.create(medicationDomainModel);
    };

    markAsTaken = async (id: string): Promise<MedicationConsumptionDto> => {
        return await this._medicationConsumptionRepo.getById(id);
    };

    markAsMissed = async (id: string): Promise<MedicationConsumptionDto> => {
        return await this._medicationConsumptionRepo.getById(id);
    };

    cancelFutureMedicationSchedules = async (medicationId: string): Promise<MedicationConsumptionDto> => {
        return await this._medicationConsumptionRepo.cancelFutureMedicationSchedules(medicationId);
    };

    deleteFutureMedicationSchedules = async (medicationId: string): Promise<MedicationConsumptionDto> => {
        return await this._medicationConsumptionRepo.deleteFutureMedicationSchedules(medicationId);
    };

    updateTimeZoneForFutureMedicationSchedules = async (medicationId: string, newTimeZone: string): Promise<MedicationConsumptionDto> => {
        return await this._medicationConsumptionRepo.updateTimeZoneForFutureMedicationSchedules(medicationId);
    };

    getById = async (id: string): Promise<MedicationConsumptionDetailsDto> => {
        return await this._medicationConsumptionRepo.getById(id);
    };

    search = async (filters: MedicationSearchFilters): Promise<MedicationSearchResults> => {
        return await this._medicationConsumptionRepo.search(filters);
    };

    getScheduleForDuration = async (patientUserId: string, duration: string, when: string): Promise<MedicationConsumptionDto[]> => {
        return await this._medicationConsumptionRepo.getScheduleForDuration(medicationId);
    };

    getScheduleForDay = async (patientUserId: string, date: Date, groupByDrug: boolean): Promise<MedicationConsumptionDto[]> => {
        return await this._medicationConsumptionRepo.getSummaryForDay(medicationId);
    };

    getSummaryForDay = async (patientUserId: string, date: Date): Promise<ConsumptionSummaryDto> => {
        return await this._medicationConsumptionRepo.getScheduleForDuration(medicationId);
    };

    getSummaryByCalendarMonths = async (
        patientUserId: string,
        pastMonthsCount: number,
        futureMonthsCount: number): Promise<ConsumptionSummaryForMonthDto[]> => {
            
        return await this._medicationConsumptionRepo.getById(id);
    };

}

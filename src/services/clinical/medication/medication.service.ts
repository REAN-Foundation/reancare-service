import { inject, injectable } from "tsyringe";
import { ApiError } from "../../../common/api.error";
import { TimeHelper } from "../../../common/time.helper";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IMedicationStockImageRepo } from "../../../database/repository.interfaces/clinical/medication/medication.stock.image.repo.interface";
import { MedicationStockImageDto } from "../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto";
import { MedicationDomainModel } from '../../../domain.types/clinical/medication/medication/medication.domain.model';
import { MedicationDto } from '../../../domain.types/clinical/medication/medication/medication.dto';
import { MedicationSearchFilters, MedicationSearchResults } from '../../../domain.types/clinical/medication/medication/medication.search.types';
import { MedicationDosageUnits, MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from "../../../domain.types/clinical/medication/medication/medication.types";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicationService {

    constructor(
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IMedicationStockImageRepo') private _medicationStockImageRepo: IMedicationStockImageRepo,
    ) {}

    create = async (model: MedicationDomainModel): Promise<MedicationDto> => {

        this.checkInputParams(model);

        model.IsExistingMedication = model.IsExistingMedication ?? false;
        model.TakenForLastNDays = model.TakenForLastNDays ?? null;
        model.ToBeTakenForNextNDays = model.ToBeTakenForNextNDays ?? null;
        var repImageResourceId = await this.getRepresentativeStockImage(model.DosageUnit);
        model.ImageResourceId = model.ImageResourceId ?? repImageResourceId;

        var startDate = this.calculateStartDate(model.StartDate, model.IsExistingMedication, model.TakenForLastNDays);
        var endDate = this.calculateEndDate(
            model.Duration,
            model.DurationUnit,
            startDate,
            model.IsExistingMedication,
            model.ToBeTakenForNextNDays);
        
        model.StartDate = startDate;
        model.EndDate = endDate;
            
        var medicationDto = await this._medicationRepo.create(model);

        return medicationDto;
    };

    getById = async (id: string): Promise<MedicationDto> => {
        return await this._medicationRepo.getById(id);
    };

    getCurrentMedications = async (patientUserId: string): Promise<MedicationDto[]> => {
        return await this._medicationRepo.getCurrentMedications(patientUserId);
    };

    search = async (filters: MedicationSearchFilters): Promise<MedicationSearchResults> => {
        return await this._medicationRepo.search(filters);
    };

    update = async (id: string, medicationDomainModel: MedicationDomainModel): Promise<MedicationDto> => {
        return await this._medicationRepo.update(id, medicationDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._medicationRepo.delete(id);
    };

    getStockMedicationImages = async(): Promise<MedicationStockImageDto[]> => {
        return await this._medicationStockImageRepo.getAll();
    }

    getStockMedicationImageById = async(imageId: string): Promise<MedicationStockImageDto> => {
        return await this._medicationStockImageRepo.getById(imageId);
    }

    getStockMedicationImageByCode = async(code: string): Promise<MedicationStockImageDto> => {
        return await this._medicationStockImageRepo.getByCode(code);
    }

    //#region Privates
    
    getRepresentativeStockImage = async (dosageUnit: MedicationDosageUnits) => {

        var medicationDoseType = dosageUnit;

        if (medicationDoseType === MedicationDosageUnits.Capsule) {
            var stockImage = await this.getStockMedicationImageByCode('01_Generic_capsule');
            return stockImage.ResourceId;
        }
        if (medicationDoseType === MedicationDosageUnits.Syringe) {
            var stockImage = await this.getStockMedicationImageByCode('04_Generic_injection');
            return stockImage.ResourceId;
        }
        var stockImage = await this.getStockMedicationImageByCode('02_Generic_tablet');
        return stockImage.ResourceId;
    }
    
    calculateStartDate = (startDate: Date, isExistingMedication: boolean, takenForLastNDays: number): Date => {

        if (startDate != null){
            return startDate;
        }
        
        if (isExistingMedication) {
            if (takenForLastNDays != null) {
                return TimeHelper.subtractDuration(new Date(), takenForLastNDays, DurationType.Day);
            }
            else {
                return TimeHelper.subtractDuration(new Date(), 7, DurationType.Day);
            }
        }
        return new Date();
    }

    calculateEndDate = (
        duration: number,
        durationUnit: MedicationDurationUnits,
        startDate: Date,
        isExistingMedication = false,
        toBeTakenForNextNDays = null) => {

        if (isExistingMedication){
            if (toBeTakenForNextNDays != null) {
                return TimeHelper.addDuration(new Date(), toBeTakenForNextNDays, DurationType.Day);
            }
            else {
                return new Date(); //return end date as today
            }
        }
        else {
            if (durationUnit === MedicationDurationUnits.Days) {
                return TimeHelper.addDuration(startDate, duration, DurationType.Day);
            }
            if (durationUnit === MedicationDurationUnits.Weeks) {
                return TimeHelper.addDuration(startDate, duration, DurationType.Week);
            }
            if (durationUnit === MedicationDurationUnits.Months) {
                return TimeHelper.addDuration(startDate, duration, DurationType.Month);
            }
            return startDate;
        }
    }

    private checkInputParams(model: MedicationDomainModel) {

        var frequencyUnit = model.FrequencyUnit;
        var durationUnit = model.DurationUnit;
        
        if (frequencyUnit === MedicationFrequencyUnits.Weekly && model.Frequency > 3) {
            throw new ApiError(400, 'Weekly medication  frequency should be less than 4.');
        }
        if (frequencyUnit === MedicationFrequencyUnits.Monthly && model.Frequency > 15) {
            throw new ApiError(400, 'Weekly medication  frequency should be less than 16.');
        }
        if ((frequencyUnit === MedicationFrequencyUnits.Weekly && durationUnit === MedicationDurationUnits.Days) ||
            (frequencyUnit === MedicationFrequencyUnits.Monthly && durationUnit === MedicationDurationUnits.Days) ||
            (frequencyUnit === MedicationFrequencyUnits.Monthly && durationUnit === MedicationDurationUnits.Weeks)) {
            throw new ApiError(400, 'Duration unit should match or be higher than frequency unit.');
        }

        var timeSchedules = model.TimeSchedules;
        if (frequencyUnit === MedicationFrequencyUnits.Daily) {
            model.Frequency = timeSchedules.length === 0 ? 1 : timeSchedules.length;
            if (timeSchedules.length === 0) {
                model.TimeSchedules = [MedicationTimeSchedules.Afternoon];
            }
        }
        if (frequencyUnit === MedicationFrequencyUnits.Weekly || frequencyUnit === MedicationFrequencyUnits.Monthly) {
            if (timeSchedules.length !== 1) {
                model.TimeSchedules = [MedicationTimeSchedules.Afternoon];
            }
        }
    }

    //#endregion

}

import { inject, injectable } from "tsyringe";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IMedicationStockImageRepo } from "../../../database/repository.interfaces/clinical/medication/medication.stock.image.repo.interface";
import { MedicationStockImageDto } from "../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto";
import { MedicationDomainModel } from '../../../domain.types/clinical/medication/medication/medication.domain.model';
import { MedicationDto } from '../../../domain.types/clinical/medication/medication/medication.dto';
import { MedicationSearchFilters, MedicationSearchResults } from '../../../domain.types/clinical/medication/medication/medication.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicationService {

    constructor(
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IMedicationStockImageRepo') private _medicationStockImageRepo: IMedicationStockImageRepo,
    ) {}

    create = async (medicationDomainModel: MedicationDomainModel): Promise<MedicationDto> => {
        return await this._medicationRepo.create(medicationDomainModel);
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

}

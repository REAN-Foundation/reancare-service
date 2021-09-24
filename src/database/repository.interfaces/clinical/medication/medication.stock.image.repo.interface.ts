import { MedicationStockImageDomainModel } from "../../../domain.types/medication/medication.stock.image/medication.stock.image.domain.model";
import { MedicationStockImageDto } from "../../../domain.types/medication/medication.stock.image/medication.stock.image.dto";

export interface IMedicationStockImageRepo {

    create(addressDomainModel: MedicationStockImageDomainModel): Promise<MedicationStockImageDto>;

    getById(id: string): Promise<MedicationStockImageDto>;

    getByCode(id: string): Promise<MedicationStockImageDto>;

    getAll(): Promise<MedicationStockImageDto[]>;

}

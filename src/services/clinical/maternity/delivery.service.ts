import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IDeliveryRepo } from "../../../database/repository.interfaces/clinical/maternity/delivery.repo.interface";
import { DeliveryDomainModel } from "../../../domain.types/clinical/maternity/delivery/delivery.domain.model";
import { DeliveryDto } from "../../../domain.types/clinical/maternity/delivery/delivery.dto";
import { DeliverySearchFilters, DeliverySearchResults } from "../../../domain.types/clinical/maternity/delivery/delivery.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DeliveryService {

    constructor(
        @inject('IDeliveryRepo') private _deliveryRepo: IDeliveryRepo,
    ) { }

    create = async (deliveryDomainModel: DeliveryDomainModel): Promise<DeliveryDto> => {
        return await this._deliveryRepo.create(deliveryDomainModel);
    };

    getById = async (id: uuid): Promise<DeliveryDto> => {
        return await this._deliveryRepo.getById(id);
    };

    search = async (filters: DeliverySearchFilters): Promise<DeliverySearchResults> => {
        return await this._deliveryRepo.search(filters);
    };

    update = async (id: uuid, deliveryDomainModel: DeliveryDomainModel): Promise<DeliveryDto> => {
        return await this._deliveryRepo.update(id, deliveryDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._deliveryRepo.delete(id);
    };

}

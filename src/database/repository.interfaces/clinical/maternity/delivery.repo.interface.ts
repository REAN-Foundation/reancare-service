import { DeliveryDomainModel } from "../../../../domain.types/clinical/maternity/delivery/delivery.domain.model";
import { DeliveryDto } from "../../../../domain.types/clinical/maternity/delivery/delivery.dto";
import { DeliverySearchFilters, DeliverySearchResults } from "../../../../domain.types/clinical/maternity/delivery/delivery.search.type";

export interface IDeliveryRepo {

    create(deliveryDomainModel: DeliveryDomainModel): Promise<DeliveryDto>;

    getById(id: string): Promise<DeliveryDto>;

    search(filters: DeliverySearchFilters): Promise<DeliverySearchResults>;

    update(id: string, deliveryDomainModel: DeliveryDomainModel): Promise<DeliveryDto>;

    delete(id: string): Promise<boolean>;

}

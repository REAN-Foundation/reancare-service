import { inject, injectable } from "tsyringe";
import { IOrderRepo } from "../../database/repository.interfaces/clinical/order.repo.interface";
import { OrderDomainModel } from '../../domain.types/clinical/order/order.domain.model';
import { OrderDto } from '../../domain.types/clinical/order/order.dto';
import { OrderSearchFilters, OrderSearchResults } from '../../domain.types/clinical/order/order.search.types';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class OrderService extends BaseResourceService {

    constructor(
        @inject('IOrderRepo') private _orderRepo: IOrderRepo,
    ) {
        super();
    }

    create = async (orderDomainModel: OrderDomainModel):
    Promise<OrderDto> => {
        return await this._orderRepo.create(orderDomainModel);
    };

    getById = async (id: uuid): Promise<OrderDto> => {
        return await this._orderRepo.getById(id);
    };

    search = async (filters: OrderSearchFilters): Promise<OrderSearchResults> => {
        return await this._orderRepo.search(filters);
    };

    update = async (id: uuid, orderDomainModel: OrderDomainModel):
    Promise<OrderDto> => {
        return await this._orderRepo.update(id, orderDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._orderRepo.delete(id);
    };

}

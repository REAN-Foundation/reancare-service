import { inject, injectable } from "tsyringe";
import { IOrderRepo } from "../../database/repository.interfaces/order/order.repo.interface";
import { OrderDomainModel } from '../../domain.types/order/order.domain.model';
import { OrderDto } from '../../domain.types/order/order.dto';
import { OrderSearchResults, OrderSearchFilters } from '../../domain.types/order/order.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class OrderService {

    constructor(
        @inject('IOrderRepo') private _orderRepo: IOrderRepo,
    ) { }

    create = async (orderDomainModel: OrderDomainModel):
    Promise<OrderDto> => {
        return await this._orderRepo.create(orderDomainModel);
    };

    getById = async (id: string): Promise<OrderDto> => {
        return await this._orderRepo.getById(id);
    };

    search = async (filters: OrderSearchFilters): Promise<OrderSearchResults> => {
        return await this._orderRepo.search(filters);
    };

    update = async (id: string, orderDomainModel: OrderDomainModel):
    Promise<OrderDto> => {
        return await this._orderRepo.update(id, orderDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._orderRepo.delete(id);
    };

}


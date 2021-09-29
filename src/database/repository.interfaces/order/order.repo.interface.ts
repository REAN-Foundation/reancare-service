import { OrderDomainModel } from "../../../domain.types/order/order.domain.model";
import { OrderDto } from "../../../domain.types/order/order.dto";
import { OrderSearchFilters, OrderSearchResults } from "../../../domain.types/order/order.search.types";

export interface IOrderRepo {

    create(orderDomainModel: OrderDomainModel): Promise<OrderDto>;

    getById(id: string): Promise<OrderDto>;
    
    search(filters: OrderSearchFilters): Promise<OrderSearchResults>;

    update(id: string, orderDomainModel: OrderDomainModel):
    Promise<OrderDto>;

    delete(id: string): Promise<boolean>;

}

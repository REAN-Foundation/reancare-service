import OrderModel from '../../models/order.model';
import { OrderDto } from '../../../../../domain.types/order/order.dto';
import { OrderStates, OrderTypes } from '../../../../../domain.types/order/order.types';

///////////////////////////////////////////////////////////////////////////////////

export class OrderMapper {

    static toDto = (
        order: OrderModel): OrderDto => {
        if (order == null) {
            return null;
        }

        const dto: OrderDto = {
            id                        : order.id,
            Type                      : OrderTypes[order.Type],
            EhrId                     : order.EhrId,
            DisplayId                 : order.DisplayId,
            PatientUserId             : order.PatientUserId,
            Patient                   : null,
            MedicalPractitionerUserId : order.MedicalPractitionerUserId,
            MedicalPractitioner       : null,
            VisitId                   : order.VisitId,
            ResourceId                : order.ResourceId,
            ReferenceOrderId          : order.ReferenceOrderId,
            CurrentState              : OrderStates[order.CurrentState],
            OrderDate                 : order.OrderDate,
            FulfilledByUserId         : order.FulfilledByUserId,
            FulfilledByOrganizationId : order.FulfilledByOrganizationId,
            AdditionalInformation     : order.AdditionalInformation
        };
        return dto;
    }

}

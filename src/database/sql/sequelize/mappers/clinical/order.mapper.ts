import { OrderDto } from '../../../../../domain.types/clinical/order/order.dto';
import { OrderStates, OrderTypes } from '../../../../../domain.types/clinical/order/order.types';
import OrderModel from '../../models/clinical/order.model';

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
    };

}

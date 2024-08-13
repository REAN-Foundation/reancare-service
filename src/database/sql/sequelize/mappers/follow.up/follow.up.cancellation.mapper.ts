import { FollowUpCancellationDto } from '../../../../../domain.types/follow.up/follow.up.cancellation.dto';
import FollowUpCancellation from '../../models/follow.up/follow.up.cancellation.model';
///////////////////////////////////////////////////////////////////////////////////

export class FollowUpCancellationMapper {

    static toDto = (model: FollowUpCancellation): FollowUpCancellationDto => {
        if (model == null) {
            return null;
        }
        const dto: FollowUpCancellationDto = {
            id         : model.id,
            TenantId   : model.TenantId,
            TenantName : model.TenantName,
            CancelDate : model.CancelDate,
            CreatedAt  : model.CreatedAt,
            UpdatedAt  : model.UpdatedAt,
        };
        return dto;
    };

}

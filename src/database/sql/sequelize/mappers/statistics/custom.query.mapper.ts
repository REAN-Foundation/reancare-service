
import StatisticsCustomQueries from '../../models/statistics/custom.query.model';
import { CustomQueryDto } from '../../../../../domain.types/statistics/custom.query/custom.query.dto';

///////////////////////////////////////////////////////////////////////////////////

export class CustomQueryMapper {

    static toDto = (customQuery: StatisticsCustomQueries): CustomQueryDto => {
        if (customQuery == null){
            return null;
        }
        const dto: CustomQueryDto = {
            id          : customQuery.id,
            Name        : customQuery.Name,
            Description : customQuery.Description,
            UserId      : customQuery.UserId,
            TenantId    : customQuery.TenantId,
        };
        return dto;
    };

}

import StatisticsCustomQueries from '../../models/statistics/custom.query.model';
import { CustomQueryDto } from '../../../../../domain.types/statistics/custom.query/custom.query.dto';

///////////////////////////////////////////////////////////////////////////////////

export class CustomQueryMapper {

    static toDto = (customQuery: StatisticsCustomQueries): CustomQueryDto => {
        if (customQuery == null){
            return null;
        }
        var tags = [];
        if (customQuery.Tags !== null && customQuery.Tags !== undefined) {
            tags = JSON.parse(customQuery.Tags);
        }
        const dto: CustomQueryDto = {
            id          : customQuery.id,
            Name        : customQuery.Name,
            Description : customQuery.Description,
            UserId      : customQuery.UserId,
            TenantId    : customQuery.TenantId,
            Query       : customQuery.Query,
            Tags        : tags
        };
        return dto;
    };

}

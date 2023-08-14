import { CohortDto } from '../../../../../domain.types/community/cohorts/cohort.domain.model';
import Cohort from '../../models/community/cohorts/cohort.model';

///////////////////////////////////////////////////////////////////////

export class CohortMapper {

    static toDto = (cohort: Cohort): CohortDto => {
        if (cohort == null){
            return null;
        }
        const dto: any = {
            id          : cohort.id,
            TenantId    : cohort.TenantId,
            Name        : cohort.Name,
            Description : cohort.Description,
            ImageUrl    : cohort.ImageUrl,
            OwnerUserId : cohort.OwnerUserId,
            CreatedAt   : cohort.CreatedAt,
            UpdatedAt   : cohort.UpdatedAt,
        };
        return dto;
    };

}

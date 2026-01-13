import { BreastfeedingStatus } from '../../../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.status.type';
import { BreastfeedingDto } from '../../../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.dto';
import BreastfeedingModel from '../../../models/clinical/maternity/breast.feeding.model';

///////////////////////////////////////////////////////////////////////////////////

export class BreastfeedingMapper {

    static toDto = (breastfeeding: BreastfeedingModel): BreastfeedingDto => {
        if (!breastfeeding) {
            return null;
        }
        
        const dto: BreastfeedingDto = {
            id                    : breastfeeding.id,
            VisitId               : breastfeeding.VisitId,
            PostNatalVisitId      : breastfeeding.PostNatalVisitId,
            BreastFeedingStatus   : breastfeeding.BreastFeedingStatus as BreastfeedingStatus,
            BreastfeedingFrequency: breastfeeding.BreastfeedingFrequency,
            AdditionalNotes       : breastfeeding.AdditionalNotes,
        };
        return dto;
    };

}
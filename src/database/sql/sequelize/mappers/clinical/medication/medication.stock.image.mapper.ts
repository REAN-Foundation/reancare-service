import MedicationStockImage from '../../../models/clinical/medication/medication.stock.image.model';
import { MedicationStockImageDto } from '../../../../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationStockImageMapper {

    static toDto = (stockImage: MedicationStockImage): MedicationStockImageDto => {
        
        if (stockImage == null){
            return null;
        }

        const dto: MedicationStockImageDto = {
            id         : stockImage.id,
            Code       : stockImage.Code,
            FileName   : stockImage.FileName,
            ResourceId : stockImage.ResourceId,
            PublicUrl  : stockImage.PublicUrl,
        };

        return dto;
    };

}

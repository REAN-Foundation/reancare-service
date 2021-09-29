import DrugModel from '../../models/medication/drug.model';
import { DrugDto } from '../../../../../domain.types/medication/drug/drug.dto';

///////////////////////////////////////////////////////////////////////////////////

export class DrugMapper {

    static toDto = (
        drug: DrugModel): DrugDto => {
        if (drug == null) {
            return null;
        }
        const dto: DrugDto = {
            id                   : drug.id,
            EhrId                : drug.EhrId,
            DrugName             : drug.DrugName,
            GenericName          : drug.GenericName,
            Ingredients          : drug.Ingredients,
            Strength             : drug.Strength,
            OtherCommercialNames : drug.OtherCommercialNames,
            Manufacturer         : drug.Manufacturer,
            OtherInformation     : drug.OtherInformation
        };
        return dto;
    }

}

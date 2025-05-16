import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BabyDomainModel } from '../../../../../../domain.types/clinical/maternity/baby/baby.domain.model';
import { BabyDto } from '../../../../../../domain.types/clinical/maternity/baby/baby.dto';
import { IBabyRepo } from '../../../../../repository.interfaces/clinical/maternity/baby.repo.interface';
import { BabyMapper } from '../../../mappers/clinical/maternity/baby.mapper';
import Baby from '../../../models/clinical/maternity/baby.model';

///////////////////////////////////////////////////////////////////////

export class BabyRepo implements IBabyRepo {

    create = async (createModel: BabyDomainModel): Promise<BabyDto> => {
        try {
            const entity = {
                DeliveryId         : createModel.DeliveryId,
                PatientUserId      : createModel.PatientUserId,
                WeightAtBirthGrams : createModel.WeightAtBirthGrams,
                Gender             : createModel.Gender,
                Status             : createModel.Status,
                ComplicationId     : createModel.ComplicationId,
            };

            const baby = await Baby.create(entity);
            return BabyMapper.toDto(baby);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BabyDto> => {
        try {
            const baby = await Baby.findByPk(id);
            return BabyMapper.toDto(baby);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

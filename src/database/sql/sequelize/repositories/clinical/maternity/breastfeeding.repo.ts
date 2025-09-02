import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BreastfeedingDomainModel } from '../../../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.domain.model';
import { BreastfeedingDto } from '../../../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.dto';
import { IBreastfeedingRepo } from '../../../../../repository.interfaces/clinical/maternity/breastfeeding.repo.interface';
import { BreastfeedingMapper } from '../../../mappers/clinical/maternity/breastfeeding.mapper';
import Breastfeeding from '../../../models/clinical/maternity/breast.feeding.model';

///////////////////////////////////////////////////////////////////////

export class BreastfeedingRepo implements IBreastfeedingRepo {

    create = async (createModel: BreastfeedingDomainModel): Promise<BreastfeedingDto> => {
        try {
            const entity = {
                VisitId                : createModel.VisitId,
                PostNatalVisitId       : createModel.PostNatalVisitId,
                BreastFeedingStatus    : createModel.BreastFeedingStatus,
                BreastfeedingFrequency : createModel.BreastfeedingFrequency,
                AdditionalNotes        : createModel.AdditionalNotes,
            };

            const breastfeeding = await Breastfeeding.create(entity);
            return BreastfeedingMapper.toDto(breastfeeding);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BreastfeedingDto> => {
        try {
            const breastfeeding = await Breastfeeding.findByPk(id);
            return BreastfeedingMapper.toDto(breastfeeding);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: BreastfeedingDomainModel): Promise<BreastfeedingDto> => {
        try {
            const breastfeeding = await Breastfeeding.findByPk(id);

            if (updateModel.VisitId != null) {
                breastfeeding.VisitId = updateModel.VisitId;
            }
            if (updateModel.PostNatalVisitId != null) {
                breastfeeding.PostNatalVisitId = updateModel.PostNatalVisitId;
            }
            if (updateModel.BreastFeedingStatus != null) {
                breastfeeding.BreastFeedingStatus = updateModel.BreastFeedingStatus;
            }
            if (updateModel.BreastfeedingFrequency != null) {
                breastfeeding.BreastfeedingFrequency = updateModel.BreastfeedingFrequency;
            }
            if (updateModel.AdditionalNotes != null) {
                breastfeeding.AdditionalNotes = updateModel.AdditionalNotes;
            }

            await breastfeeding.save();

            return BreastfeedingMapper.toDto(breastfeeding);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

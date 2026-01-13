import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { PostnatalMedicationDomainModel } from '../../../../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.domain.model';
import { PostnatalMedicationDto } from '../../../../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.dto';
import { IPostnatalMedicationRepo } from '../../../../../repository.interfaces/clinical/maternity/postnatal.medication.repo.interface';
import { PostnatalMedicationMapper } from '../../../mappers/clinical/maternity/postnatal.medication.mapper';
import PostnatalMedication from '../../../models/clinical/maternity/postnatal.medication.model';

///////////////////////////////////////////////////////////////////////

export class PostnatalMedicationRepo implements IPostnatalMedicationRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await PostnatalMedication.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: PostnatalMedicationDomainModel): Promise<PostnatalMedicationDto> => {
        try {
            const entity = {
                PostNatalVisitId : createModel.PostNatalVisitId,
                DeliveryId       : createModel.DeliveryId,
                VisitId          : createModel.VisitId,
                Name             : createModel.Name,
                Given            : createModel.Given,
                MedicationId     : createModel.MedicationId
            };

            const postnatalMedication = await PostnatalMedication.create(entity);
            return PostnatalMedicationMapper.toDto(postnatalMedication);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PostnatalMedicationDto> => {
        try {
            const postnatalMedication = await PostnatalMedication.findByPk(id);
            return PostnatalMedicationMapper.toDto(postnatalMedication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: PostnatalMedicationDomainModel): Promise<PostnatalMedicationDto> => {
        try {
            const postnatalMedication = await PostnatalMedication.findByPk(id);

            if (updateModel.PostNatalVisitId != null) {
                postnatalMedication.PostNatalVisitId = updateModel.PostNatalVisitId;
            }
            if (updateModel.DeliveryId != null) {
                postnatalMedication.DeliveryId = updateModel.DeliveryId;
            }
            if (updateModel.VisitId != null) {
                postnatalMedication.VisitId = updateModel.VisitId;
            }
            if (updateModel.Name != null) {
                postnatalMedication.Name = updateModel.Name;
            }
            if (updateModel.Given != null) {
                postnatalMedication.Given = updateModel.Given;
            }
            if (updateModel.MedicationId != null) {
                postnatalMedication.MedicationId = updateModel.MedicationId;
            }

            await postnatalMedication.save();

            return PostnatalMedicationMapper.toDto(postnatalMedication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await PostnatalMedication.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

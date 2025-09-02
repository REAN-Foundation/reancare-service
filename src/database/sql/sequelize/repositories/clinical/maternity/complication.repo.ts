import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { ComplicationDomainModel } from '../../../../../../domain.types/clinical/maternity/complication/complication.domain.model';
import { ComplicationDto } from '../../../../../../domain.types/clinical/maternity/complication/complication.dto';
import { ComplicationSearchFilter, ComplicationSearchResults } from '../../../../../../domain.types/clinical/maternity/complication/complication.search.type';
import { IComplicationRepo } from '../../../../../repository.interfaces/clinical/maternity/complication.repo.interface';
import { ComplicationMapper } from '../../../mappers/clinical/maternity/complication.mapper';
import Complication from '../../../models/clinical/maternity/complication.model';

///////////////////////////////////////////////////////////////////////

export class ComplicationRepo implements IComplicationRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await Complication.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: ComplicationDomainModel): Promise<ComplicationDto> => {
        try {
            const entity = {
                DeliveryId         : createModel.DeliveryId,
                BabyId1            : createModel.BabyId1,
                BabyId2            : createModel.BabyId2,
                BabyId3            : createModel.BabyId3,
                Name               : createModel.Name,
                Status             : createModel.Status,
                Severity           : createModel.Severity,
                MedicalConditionId : createModel.MedicalConditionId,
            };

            const complication = await Complication.create(entity);
            return ComplicationMapper.toDto(complication);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ComplicationDto> => {
        try {
            const complication = await Complication.findByPk(id);
            return ComplicationMapper.toDto(complication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ComplicationSearchFilter): Promise<ComplicationSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.DeliveryId != null) {
                search.where['DeliveryId'] = { [Op.eq]: filters.DeliveryId };
            }
            if (filters.BabyId1 != null) {
                search.where['BabyId1'] = filters.BabyId1;
            }
            if (filters.BabyId2 != null) {
                search.where['BabyId2'] = filters.BabyId2;
            }
            if (filters.BabyId3 != null) {
                search.where['BabyId3'] = filters.BabyId3;
            }
            if (filters.Name != null) {
                search.where['Name'] = filters.Name;
            }
            if (filters.Status != null) {
                search.where['Status'] = filters.Status;
            }
            if (filters.Severity != null) {
                search.where['Severity'] = filters.Severity;
            }
            if (filters.MedicalConditionId != null) {
                search.where['MedicalConditionId'] = filters.MedicalConditionId;
            }

            const foundResults = await Complication.findAndCountAll(search);

            const dtos: ComplicationDto[] = [];
            for (const complication of foundResults.rows) {
                const dto = ComplicationMapper.toDto(complication);
                dtos.push(dto);
            }

            const searchResults: ComplicationSearchResults = {
                Items : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: ComplicationDomainModel): Promise<ComplicationDto> => {
        try {
            const complication = await Complication.findByPk(id);

            if (updateModel.DeliveryId != null) {
                complication.DeliveryId = updateModel.DeliveryId;
            }
            if (updateModel.BabyId1 != null) {
                complication.BabyId1 = updateModel.BabyId1;
            }
            if (updateModel.BabyId2 != null) {
                complication.BabyId2 = updateModel.BabyId2;
            }
            if (updateModel.BabyId3 != null) {
                complication.BabyId3 = updateModel.BabyId3;
            }
            if (updateModel.Name != null) {
                complication.Name = updateModel.Name;
            }
            if (updateModel.Status != null) {
                complication.Status = updateModel.Status;
            }
            if (updateModel.Severity != null) {
                complication.Severity = updateModel.Severity;
            }
            if (updateModel.MedicalConditionId != null) {
                complication.MedicalConditionId = updateModel.MedicalConditionId;
            }

            await complication.save();

            return ComplicationMapper.toDto(complication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Complication.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

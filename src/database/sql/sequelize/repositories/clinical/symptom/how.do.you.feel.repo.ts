import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { HowDoYouFeelDomainModel } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelDto } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { HowDoYouFeelSearchFilters, HowDoYouFeelSearchResults } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';
import { IHowDoYouFeelRepo } from '../../../../../repository.interfaces/clinical/symptom/how.do.you.feel.repo.interface';
import { HowDoYouFeelMapper } from '../../../mappers/clinical/symptom/how.do.you.feel.mapper';
import HowDoYouFeel from '../../../models/clinical/symptom/how.do.you.feel.model';

///////////////////////////////////////////////////////////////////////

export class HowDoYouFeelRepo implements IHowDoYouFeelRepo {

    create = async (createModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId,
                Feeling       : createModel.Feeling,
                Comments      : createModel.Comments,
                RecordDate    : createModel.RecordDate,
            };
            const howDoYouFeel = await HowDoYouFeel.create(entity);
            return await HowDoYouFeelMapper.toDto(howDoYouFeel);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<HowDoYouFeelDto> => {
        try {
            const howDoYouFeel = await HowDoYouFeel.findByPk(id);
            return await HowDoYouFeelMapper.toDto(howDoYouFeel);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchResults> => {
        try {
            const search = { where: {} };
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Feeling != null) {
                search.where['Feeling'] = filters.Feeling;
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
                };
            }
            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await HowDoYouFeel.findAndCountAll(search);

            const dtos: HowDoYouFeelDto[] = [];
            for (const foodConsumption of foundResults.rows) {
                const dto = await HowDoYouFeelMapper.toDto(foodConsumption);
                dtos.push(dto);
            }

            const searchResults: HowDoYouFeelSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        try {
            const howDoYouFeel = await HowDoYouFeel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                howDoYouFeel.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Feeling != null) {
                howDoYouFeel.Feeling = updateModel.Feeling;
            }
            if (updateModel.Comments != null) {
                howDoYouFeel.Comments = updateModel.Comments;
            }
            if (updateModel.RecordDate != null) {
                howDoYouFeel.RecordDate = updateModel.RecordDate;
            }
            await howDoYouFeel.save();

            const dto = await HowDoYouFeelMapper.toDto(howDoYouFeel);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await HowDoYouFeel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

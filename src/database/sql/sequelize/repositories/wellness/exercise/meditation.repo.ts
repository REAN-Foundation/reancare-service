import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { MeditationDomainModel } from "../../../../../../domain.types/wellness/exercise/meditation/meditation.domain.model";
import { MeditationDto } from "../../../../../../domain.types/wellness/exercise/meditation/meditation.dto";
import { MeditationSearchFilters, MeditationSearchResults } from "../../../../../../domain.types/wellness/exercise/meditation/meditation.search.types";
import { IMeditationRepo } from '../../../../../repository.interfaces/wellness/exercise/meditation.repo.interface';
import { MeditationMapper } from '../../../mappers/wellness/exercise/meditation.mapper';
import MeditationModel from '../../../models/wellness/exercise/meditation.model';

///////////////////////////////////////////////////////////////////////

export class MeditationRepo implements IMeditationRepo {

    create = async (meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        try {
            const entity = {
                PatientUserId : meditationDomainModel.PatientUserId,
                Meditation    : meditationDomainModel.Meditation,
                Description   : meditationDomainModel.Description,
                Category      : meditationDomainModel.Category,
                StartTime     : meditationDomainModel.StartTime,
                EndTime       : meditationDomainModel.EndTime
            };

            const meditation = await MeditationModel.create(entity);
            const dto = await MeditationMapper.toDto(meditation);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<MeditationDto> => {
        try {
            const meditation = await MeditationModel.findByPk(id);
            const dto = await MeditationMapper.toDto(meditation);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: MeditationSearchFilters): Promise<MeditationSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Meditation !== null) {
                search.where['Meditation'] = filters.Meditation;
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

            const foundResults = await MeditationModel.findAndCountAll(search);

            const dtos: MeditationDto[] = [];
            for (const meditation of foundResults.rows) {
                const dto = await MeditationMapper.toDto(meditation);
                dtos.push(dto);
            }

            const searchResults: MeditationSearchResults = {
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

    update = async (id: string, meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        try {
            const meditation = await MeditationModel.findByPk(id);

            if (meditationDomainModel.PatientUserId != null) {
                meditation.PatientUserId = meditationDomainModel.PatientUserId;
            }
            if (meditationDomainModel.Meditation != null) {
                meditation.Meditation = meditationDomainModel.Meditation;
            }
            if (meditationDomainModel.Description != null) {
                meditation.Description = meditationDomainModel.Description;
            }
            if (meditationDomainModel.Category != null) {
                meditation.Category = meditationDomainModel.Category;
            }
            if (meditationDomainModel.StartTime != null) {
                meditation.StartTime = meditationDomainModel.StartTime;
            }
            if (meditationDomainModel.EndTime != null) {
                meditation.EndTime = meditationDomainModel.EndTime;
            }
    
            await meditation.save();

            const dto = await MeditationMapper.toDto(meditation);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await MeditationModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

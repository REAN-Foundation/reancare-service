import { Op } from 'sequelize';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { MeditationDomainModel } from "../../../../../../domain.types/wellness/exercise/meditation/meditation.domain.model";
import { MeditationDto } from "../../../../../../domain.types/wellness/exercise/meditation/meditation.dto";
import { MeditationSearchFilters, MeditationSearchResults } from "../../../../../../domain.types/wellness/exercise/meditation/meditation.search.types";
import { IMeditationRepo } from '../../../../../repository.interfaces/wellness/exercise/meditation.repo.interface';
import { MeditationMapper } from '../../../mappers/wellness/exercise/meditation.mapper';
import MeditationModel from '../../../models/wellness/exercise/meditation.model';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class MeditationRepo implements IMeditationRepo {

    create = async (createModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        try {
            const entity = {
                PatientUserId  : createModel.PatientUserId,
                Meditation     : createModel.Meditation,
                Description    : createModel.Description,
                Category       : createModel.Category,
                DurationInMins : createModel.DurationInMins,
                StartTime      : createModel.StartTime,
                EndTime        : createModel.EndTime
            };

            const meditation = await MeditationModel.create(entity);
            return await MeditationMapper.toDto(meditation);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<MeditationDto> => {
        try {
            const meditation = await MeditationModel.findByPk(id);
            return await MeditationMapper.toDto(meditation);

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
            if (filters.Meditation != null) {
                search.where['Meditation'] = filters.Meditation;
            }
            if (filters.DurationInMins != null) {
                search.where['DurationInMins'] = filters.DurationInMins;
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

    update = async (id: string, updateModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        try {
            const meditation = await MeditationModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                meditation.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Meditation != null) {
                meditation.Meditation = updateModel.Meditation;
            }
            if (updateModel.Description != null) {
                meditation.Description = updateModel.Description;
            }
            if (updateModel.Category != null) {
                meditation.Category = updateModel.Category;
            }
            if (updateModel.DurationInMins != null) {
                meditation.DurationInMins = updateModel.DurationInMins;
            }
            if (updateModel.StartTime != null) {
                meditation.StartTime = updateModel.StartTime;
            }
            if (updateModel.EndTime != null) {
                meditation.EndTime = updateModel.EndTime;
            }
    
            await meditation.save();

            return await MeditationMapper.toDto(meditation);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await MeditationModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await MeditationModel.findAll({
                where : {
                    PatientUserId  : patientUserId,
                    DurationInMins : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.gte] : dateFrom,
                        [Op.lte] : dateTo,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                const recordDate = x.EndTime ?? x.StartTime;
                const tempDate = TimeHelper.addDuration(recordDate, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    Name           : 'Meditation',
                    Duration       : x.DurationInMins,
                    Unit           : 'mins',
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(recordDate),
                    RecordTimeZone : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date): Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await MeditationModel.findAll({
                where : {
                    PatientUserId  : patientUserId,
                    DurationInMins : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.lte] : date,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                const recordDate = x.EndTime ?? x.StartTime;
                const tempDate = TimeHelper.addDuration(recordDate, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    Name           : 'Meditaion',
                    Duration       : x.DurationInMins,
                    Unit           : 'mins',
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(recordDate),
                    RecordTimeZone : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

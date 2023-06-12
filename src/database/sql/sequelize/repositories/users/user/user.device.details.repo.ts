import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { UserDeviceDetailsDomainModel } from "../../../../../../domain.types/users/user.device.details/user.device.domain.model";
import { UserDeviceDetailsDto } from "../../../../../../domain.types/users/user.device.details/user.device.dto";
import { UserDeviceDetailsSearchFilters, UserDeviceDetailsSearchResults } from "../../../../../../domain.types/users/user.device.details/user.device.search.types";
import { IUserDeviceDetailsRepo } from '../../../../../repository.interfaces/users/user/user.device.details.repo.interface ';
import { UserDeviceDetailsMapper } from '../../../mappers/users/user/user.device.details.mapper';
import UserDeviceDetailsModel from '../../../models/users/user/user.device.details.model';

///////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsRepo implements IUserDeviceDetailsRepo {

    create = async (userDeviceDetailsDomainModel: UserDeviceDetailsDomainModel):
    Promise<UserDeviceDetailsDto> => {
        try {
            const entity = {
                UserId      : userDeviceDetailsDomainModel.UserId,
                Token       : userDeviceDetailsDomainModel.Token,
                DeviceName  : userDeviceDetailsDomainModel.DeviceName,
                OSType      : userDeviceDetailsDomainModel.OSType,
                OSVersion   : userDeviceDetailsDomainModel.OSVersion,
                AppName     : userDeviceDetailsDomainModel.AppName,
                AppVersion  : userDeviceDetailsDomainModel.AppVersion,
                ChangeCount : userDeviceDetailsDomainModel.ChangeCount
            };

            const userDeviceDetails = await UserDeviceDetailsModel.create(entity);
            const dto = UserDeviceDetailsMapper.toDto(userDeviceDetails);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<UserDeviceDetailsDto> => {
        try {
            const userDeviceDetails = await UserDeviceDetailsModel.findByPk(id);
            const dto = UserDeviceDetailsMapper.toDto(userDeviceDetails);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<UserDeviceDetailsDto[]> => {
        try {
            const userDeviceDetailsList = await UserDeviceDetailsModel.findAll({
                where : {
                    UserId : userId
                }
            });
            return userDeviceDetailsList.map(x => UserDeviceDetailsMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getExistingRecord = async (deviceDetails: any): Promise<UserDeviceDetailsDto> => {
        try {

            const existingRecord =  await UserDeviceDetailsModel.findOne({
                where : {
                    UserId  : deviceDetails.UserId,
                    AppName : deviceDetails.AppName,
                    Token   : deviceDetails.Token,

                }
            });
            return await UserDeviceDetailsMapper.toDto(existingRecord);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: UserDeviceDetailsSearchFilters): Promise<UserDeviceDetailsSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.UserId != null) {
                search.where['UserId'] = filters.UserId;
            }
            if (filters.Token != null) {
                search.where['Token'] = filters.Token;
            }
            if (filters.DeviceName != null) {
                search.where['DeviceName'] = filters.DeviceName;
            }
            if (filters.OSType != null) {
                search.where['OSType'] = filters.OSType;
            }
            if (filters.OSVersion != null) {
                search.where['OSVersion'] = filters.OSVersion;
            }
            if (filters.AppName != null) {
                search.where['AppName'] = filters.AppName;
            }
            if (filters.AppVersion != null) {
                search.where['AppVersion'] = filters.AppVersion;
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

            const foundResults = await UserDeviceDetailsModel.findAndCountAll(search);

            const dtos: UserDeviceDetailsDto[] = [];
            for (const userDeviceDetails of foundResults.rows) {
                const dto = UserDeviceDetailsMapper.toDto(userDeviceDetails);
                dtos.push(dto);
            }

            const searchResults: UserDeviceDetailsSearchResults = {
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

    update = async (id: string, userDeviceDetailsDomainModel: UserDeviceDetailsDomainModel):
    Promise<UserDeviceDetailsDto> => {
        try {
            const userDeviceDetails = await UserDeviceDetailsModel.findByPk(id);

            if (userDeviceDetailsDomainModel.UserId != null) {
                userDeviceDetails.UserId = userDeviceDetailsDomainModel.UserId;
            }
            if (userDeviceDetailsDomainModel.Token != null) {
                userDeviceDetails.Token = userDeviceDetailsDomainModel.Token;
            }
            if (userDeviceDetailsDomainModel.DeviceName != null) {
                userDeviceDetails.DeviceName = userDeviceDetailsDomainModel.DeviceName;
            }
            if (userDeviceDetailsDomainModel.OSType != null) {
                userDeviceDetails.OSType = userDeviceDetailsDomainModel.OSType;
            }
            if (userDeviceDetailsDomainModel.OSVersion != null) {
                userDeviceDetails.OSVersion = userDeviceDetailsDomainModel.OSVersion;
            }
            if (userDeviceDetailsDomainModel.AppName != null) {
                userDeviceDetails.AppName = userDeviceDetailsDomainModel.AppName;
            }
            if (userDeviceDetailsDomainModel.AppVersion != null) {
                userDeviceDetails.AppVersion = userDeviceDetailsDomainModel.AppVersion;
            }
            if (userDeviceDetailsDomainModel.ChangeCount != null) {
                userDeviceDetails.ChangeCount = userDeviceDetailsDomainModel.ChangeCount;
            }
            
            await userDeviceDetails.save();

            const dto = UserDeviceDetailsMapper.toDto(userDeviceDetails);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await UserDeviceDetailsModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

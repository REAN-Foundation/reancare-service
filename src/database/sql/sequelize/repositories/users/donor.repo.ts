import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";
import { Op } from 'sequelize';
import Person from "../../models/person/person.model";
import { IDonorRepo } from "../../../../repository.interfaces/users/donor.repo.interface";
import { DonorDomainModel } from "../../../../../domain.types/users/donor/donor.domain.model";
import { DonorDetailsDto, DonorDto } from "../../../../../domain.types/users/donor/donor.dto";
import Donor from "../../models/users/donor.model";
import { DonorMapper } from "../../mappers/users/donor.mapper";
import { DonorSearchFilters, DonorSearchResults } from "../../../../../domain.types/users/donor/donor.search.types";

///////////////////////////////////////////////////////////////////////////////////

export class DonorRepo implements IDonorRepo {

    create = async (donorDomainModel: DonorDomainModel): Promise<DonorDetailsDto> => {

        var medIssues = donorDomainModel.MedIssues && donorDomainModel.MedIssues.length > 0 ?
            JSON.stringify(donorDomainModel.MedIssues) : '[]';

        try {
            const entity = {
                UserId            : donorDomainModel.UserId,
                PersonId          : donorDomainModel.PersonId,
                DisplayId         : donorDomainModel.DisplayId,
                EhrId             : donorDomainModel.EhrId,
                BloodGroup        : donorDomainModel.BloodGroup,
                AcceptorUserId    : donorDomainModel.AcceptorUserId,
                LastDonationDate  : donorDomainModel.LastDonationDate,
                DonorType         : donorDomainModel.DonorType,
                IsAvailable       : donorDomainModel.IsAvailable,
                HasDonatedEarlier : donorDomainModel.HasDonatedEarlier,
                MedIssues         : medIssues
            };

            const donor = await Donor.create(entity);
            const dto = await DonorMapper.toDetailsDto(donor);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<DonorDetailsDto> => {
        try {
            const donor = await Donor.findOne({ where: { UserId: userId } });
            const dto = await DonorMapper.toDetailsDto(donor);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateByUserId = async (userId: string, model: DonorDomainModel): Promise<DonorDetailsDto> => {
        try {
            const donor = await Donor.findOne({ where: { UserId: userId } });

            if (model.EhrId != null) {
                donor.EhrId = model.EhrId;
            }
            if (model.BloodGroup != null) {
                donor.BloodGroup = model.BloodGroup;
            }
            if (model.AcceptorUserId != null) {
                donor.AcceptorUserId = model.AcceptorUserId;
            }
            if (model.LastDonationDate != null) {
                donor.LastDonationDate = model.LastDonationDate;
            }
            if (model.DonorType != null) {
                donor.DonorType = model.DonorType;
            }
            if (model.IsAvailable != null) {
                donor.IsAvailable = model.IsAvailable;
            }
            if (model.HasDonatedEarlier != null) {
                donor.HasDonatedEarlier = model.HasDonatedEarlier;
            }

            if (donor.MedIssues != null && donor.MedIssues.length > 0) {

                var medIssues = model.MedIssues.length > 0 ?
                    JSON.stringify(model.MedIssues) : '[]';

                donor.MedIssues = medIssues;
            }

            await donor.save();

            const dto = await DonorMapper.toDetailsDto(donor);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DonorSearchFilters): Promise<DonorSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {
                },
            };

            if (filters.Phone != null) {
                includesObj.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if (filters.Email != null) {
                includesObj.where['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            }
            if (filters.Gender != null) {
                includesObj.where['Gender'] = filters.Gender; //This should be exact. Either Male / Female / Other / Unknown.
            }
            if (filters.Name != null) {
                includesObj.where[Op.or] = [
                    {
                        FirstName : { [Op.like]: '%' + filters.Name + '%' },
                    },
                    {
                        LastName : { [Op.like]: '%' + filters.Name + '%' },
                    },
                ];
            }
            if (filters.BloodGroup != null) {
                search.where['BloodGroup'] = { [Op.substring]: '%' + filters.BloodGroup + '%' };
            }
            if (filters.MedIssues != null) {
                search.where['MedIssues'] = { [Op.like]: '%' + filters.MedIssues + '%' };
            }
            if (filters.IsAvailable != null) {
                search.where['IsAvailable'] = filters.IsAvailable;
            }
            if (filters.HasDonatedEarlier != null) {
                search.where['HasDonatedEarlier'] = filters.HasDonatedEarlier;
            }
            if (filters.AcceptorUserId != null) {
                search.where['AcceptorUserId'] = filters.AcceptorUserId;
            }
            if (filters.DonorType != null) {
                search.where['DonorType'] = filters.DonorType;
            }

            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            }
            else if (filters.CreatedDateFrom == null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            }
            else if (filters.CreatedDateFrom != null && filters.CreatedDateTo == null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            search.include.push(includesObj);

            //Reference: https://sequelize.org/v5/manual/querying.html#ordering
            const orderByColum = 'CreatedAt';
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];
            if (filters.OrderBy) {
                const personAttributes = ['FirstName', 'LastName', 'BirthDate', 'Gender', 'Phone', 'Email'];
                const isPersonColumn = personAttributes.includes(filters.OrderBy);
                if (isPersonColumn) {
                    search['order'] = [[ 'Person', filters.OrderBy, order]];
                }
            }

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

            const foundResults = await Donor.findAndCountAll(search);

            const dtos: DonorDto[] = [];
            for (const donor of foundResults.rows) {
                const dto = await DonorMapper.toDto(donor);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: DonorSearchResults = {
                TotalCount     : totalCount,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };

            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteByUserId = async (userId: string): Promise<boolean> => {
        try {
            const count = await Donor.destroy({
                where : {
                    UserId : userId
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";
import { Op } from 'sequelize';
import Person from "../../models/person/person.model";
import { IVolunteerRepo } from "../../../../../database/repository.interfaces/users/Volunteer.repo.interface";
import { VolunteerSearchResults, VolunteerSearchFilters } from "../../../../../domain.types/users/Volunteer/volunteer.search.types";
import { VolunteerDto, VolunteerDetailsDto } from "../../../../../domain.types/users/Volunteer/volunteer.dto";
import { VolunteerMapper } from "../../mappers/users/volunteer.mapper";
import Volunteer from "../../models/users/volunteer.model";
import { VolunteerDomainModel } from "../../../../../domain.types/users/Volunteer/volunteer.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class VolunteerRepo implements IVolunteerRepo {

    create = async (volunteerDomainModel: VolunteerDomainModel): Promise<VolunteerDetailsDto> => {

        var medIssues = volunteerDomainModel.MedIssues && volunteerDomainModel.MedIssues.length > 0 ?
            JSON.stringify(volunteerDomainModel.MedIssues) : '[]';

        try {
            const entity = {
                UserId           : volunteerDomainModel.UserId,
                PersonId         : volunteerDomainModel.PersonId,
                DisplayId        : volunteerDomainModel.DisplayId,
                EhrId            : volunteerDomainModel.EhrId,
                BloodGroup       : volunteerDomainModel.BloodGroup,
                LastDonationDate : volunteerDomainModel.LastDonationDate,
                IsAvailable      : volunteerDomainModel.IsAvailable,
                MedIssues        : medIssues
            };

            const donor = await Volunteer.create(entity);
            const dto = await VolunteerMapper.toDetailsDto(donor);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<VolunteerDetailsDto> => {
        try {
            const donor = await Volunteer.findOne({ where: { UserId: userId } });
            const dto = await VolunteerMapper.toDetailsDto(donor);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateByUserId = async (userId: string, model: VolunteerDomainModel): Promise<VolunteerDetailsDto> => {
        try {
            const volunteer = await Volunteer.findOne({ where: { UserId: userId } });

            if (model.EhrId != null) {
                volunteer.EhrId = model.EhrId;
            }
            if (model.BloodGroup != null) {
                volunteer.BloodGroup = model.BloodGroup;
            }
            if (model.LastDonationDate != null) {
                volunteer.LastDonationDate = model.LastDonationDate;
            }
            if (model.SelectedBloodGroup != null) {
                volunteer.SelectedBloodGroup = model.SelectedBloodGroup;
            }
            if (model.SelectedBridgeId != null) {
                volunteer.SelectedBridgeId = model.SelectedBridgeId;
            }
            if (model.SelectedPhoneNumber != null) {
                volunteer.SelectedPhoneNumber = model.SelectedPhoneNumber;
            }
            if (model.LastDonationRecordId != null) {
                volunteer.LastDonationRecordId = model.LastDonationRecordId;
            }
            if (model.IsAvailable != null) {
                volunteer.IsAvailable = model.IsAvailable;
            }

            if (model.MedIssues != null && model.MedIssues.length > 0) {

                var medIssues = model.MedIssues.length > 0 ?
                    JSON.stringify(model.MedIssues) : '[]';

                volunteer.MedIssues = medIssues;
            }

            await volunteer.save();

            const dto = await VolunteerMapper.toDetailsDto(volunteer);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: VolunteerSearchFilters): Promise<VolunteerSearchResults> => {
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
            if (filters.SelectedBloodGroup != null) {
                search.where['SelectedBloodGroup'] = { [Op.substring]: '%' + filters.SelectedBloodGroup + '%' };
            }
            if (filters.MedIssues != null) {
                search.where['MedIssues'] = { [Op.like]: '%' + filters.MedIssues + '%' };
            }
            if (filters.IsAvailable != null) {
                search.where['IsAvailable'] = filters.IsAvailable;
            }
            if (filters.SelectedBridgeId != null) {
                search.where['SelectedBridgeId'] = filters.SelectedBridgeId;
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

            const foundResults = await Volunteer.findAndCountAll(search);

            const dtos: VolunteerDto[] = [];
            for (const donor of foundResults.rows) {
                const dto = await VolunteerMapper.toDto(donor);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: VolunteerSearchResults = {
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
            const count = await Volunteer.destroy({
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

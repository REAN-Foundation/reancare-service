import { Logger } from "../../../../../../common/logger";
import { ApiError } from "../../../../../../common/api.error";
import { Op } from 'sequelize';
import { BridgeDomainModel } from "../../../../../../domain.types/assorted/blood.donation/bridge/bridge.domain.model";
import { BridgeDto } from "../../../../../../domain.types/assorted/blood.donation/bridge/bridge.dto";
import { BridgeSearchFilters, BridgeSearchResults } from "../../../../../../domain.types/assorted/blood.donation/bridge/bridge.search.types";
import PatientDonors from "../../../models/clinical/donation/patient.donors.model";
import { BridgeMapper } from "../../../mappers/assorted/blood.donation/bridge.mapper";
import { IBridgeRepo } from "../../../../../repository.interfaces/assorted/blood.donation/bridge.repo.interface";

///////////////////////////////////////////////////////////////////////////////////

export class BridgeRepo implements IBridgeRepo {

    create = async (model: BridgeDomainModel): Promise<BridgeDto> => {

        try {
            const entity = {
                Name             : model.Name,
                PatientUserId    : model.PatientUserId,
                DonorUserId      : model.DonorUserId,
                DonorType        : model.DonorType,
                VolunteerUserId  : model.VolunteerUserId,
                BloodGroup       : model.BloodGroup,
                NextDonationDate : model.NextDonationDate,
                LastDonationDate : model.LastDonationDate,
                QuantityRequired : model.QuantityRequired,
                Status           : model.Status,
            };

            const patientDonors = await PatientDonors.create(entity);
            const dto = await BridgeMapper.toDetailsDto(patientDonors);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BridgeDto> => {
        try {
            const patientDonors = await PatientDonors.findOne({ where: { id: id } });
            const dto = await BridgeMapper.toDetailsDto(patientDonors);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = async (id: string, model: BridgeDomainModel): Promise<BridgeDto> => {
        try {
            const patientDonors = await PatientDonors.findOne({ where: { id: id } });

            if (model.PatientUserId != null) {
                patientDonors.PatientUserId = model.PatientUserId;
            }
            if (model.DonorUserId != null) {
                patientDonors.DonorUserId = model.DonorUserId;
            }
            if (model.VolunteerUserId != null) {
                patientDonors.VolunteerUserId = model.VolunteerUserId;
            }
            if (model.BloodGroup != null) {
                patientDonors.BloodGroup = model.BloodGroup;
            }
            if (model.Name != null) {
                patientDonors.Name = model.Name;
            }
            if (model.DonorType != null) {
                patientDonors.DonorType = model.DonorType;
            }
            if (model.LastDonationDate != null) {
                patientDonors.LastDonationDate = model.LastDonationDate;
            }
            if (model.NextDonationDate != null) {
                patientDonors.NextDonationDate = model.NextDonationDate;
            }
            if (model.QuantityRequired != null) {
                patientDonors.QuantityRequired = model.QuantityRequired;
            }
            if (model.Status != null) {
                patientDonors.Status = model.Status;
            }

            await patientDonors.save();

            const dto = await BridgeMapper.toDetailsDto(patientDonors);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BridgeSearchFilters): Promise<BridgeSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            // const includesObj =
            // {
            //     model    : Donor,
            //     required : true,
            //     where    : {
            //     },
            // };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.DonorUserId != null) {
                search.where['DonorUserId'] = { [Op.like]: '%' + filters.DonorUserId + '%' };
            }
            if (filters.VolunteerUserId != null) {
                search.where['VolunteerUserId'] = { [Op.like]: '%' + filters.VolunteerUserId + '%' };
            }
            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.BloodGroup != null) {
                search.where['BloodGroup'] = { [Op.substring]: '%' + filters.BloodGroup + '%' };
            }
            if (filters.Status != null) {
                search.where['Status'] = filters.Status;
            }

            if (filters.NextDonationDateFrom != null && filters.NextDonationDateTo != null) {
                search.where['NextDonationDate'] = {
                    [Op.gte] : filters.NextDonationDateFrom,
                    [Op.lte] : filters.NextDonationDateTo,
                };
            }
            else if (filters.NextDonationDateFrom == null && filters.NextDonationDateTo != null) {
                search.where['NextDonationDate'] = {
                    [Op.lte] : filters.NextDonationDateTo,
                };
            }
            else if (filters.NextDonationDateFrom != null && filters.NextDonationDateTo == null) {
                search.where['NextDonationDate'] = {
                    [Op.gte] : filters.NextDonationDateFrom,
                };
            }

            // search.include.push(includesObj);

            //Reference: https://sequelize.org/v5/manual/querying.html#ordering
            const orderByColum = 'CreatedAt';
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];
            // if (filters.OrderBy) {
            //     const personAttributes = ['Name', 'BloodGroup',
            //     'Status', 'PatientUserId', 'NextDonationDate', 'LastDonationDate'];
            //     const isPersonColumn = personAttributes.includes(filters.OrderBy);
            //     if (isPersonColumn) {
            //         search['order'] = [[ 'Person', filters.OrderBy, order]];
            //     }
            // }

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

            const foundResults = await PatientDonors.findAndCountAll(search);

            const dtos: BridgeDto[] = [];
            for (const patientDonors of foundResults.rows) {
                const dto = await BridgeMapper.toDetailsDto(patientDonors);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: BridgeSearchResults = {
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

    delete = async (id: string): Promise<boolean> => {
        try {
            const count = await PatientDonors.destroy({
                where : {
                    id : id
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

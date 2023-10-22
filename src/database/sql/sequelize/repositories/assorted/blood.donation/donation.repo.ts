import { Logger } from "../../../../../../common/logger";
import { ApiError } from "../../../../../../common/api.error";
import { Op } from 'sequelize';
import { IDonationRepo } from "../../../../../repository.interfaces/assorted/blood.donation/donation.repo.interface";
import Donation from "../../../models/assorted/blood.donation/donation.model";
import { DonationMapper } from "../../../mappers/assorted/blood.donation/donation.mapper";
import Bridge from "../../../models/assorted/blood.donation/bridge.model";
import { DonationDomainModel } from "../../../../../../domain.types/assorted/blood.donation/donation/donation.domain.model";
import { DonationDto } from "../../../../../../domain.types/assorted/blood.donation/donation/donation.dto";
import { DonationSearchResults } from "../../../../../../domain.types/assorted/blood.donation/donation/donation.search.types";
import { DonationSearchFilters } from "../../../../../../domain.types/assorted/blood.donation/donation/donation.search.types";

///////////////////////////////////////////////////////////////////////////////////

export class DonationRepo implements IDonationRepo {

    create = async (model: DonationDomainModel): Promise<DonationDto> => {

        try {
            const entity = {
                PatientUserId             : model.PatientUserId,
                NetworkId                 : model.NetworkId,
                EmergencyDonor            : model.EmergencyDonor,
                VolunteerOfEmergencyDonor : model.VolunteerOfEmergencyDonor,
                RequestedQuantity         : model.RequestedQuantity,
                RequestedDate             : model.RequestedDate,
                DonatedQuantity           : model.DonatedQuantity,
                DonationDate              : model.DonationDate,
                DonationType              : model.DonationType
            };

            const donationRecord = await Donation.create(entity);
            const dto = await DonationMapper.toDetailsDto(donationRecord);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DonationDto> => {
        try {
            const donationRecord = await Donation.findOne({ where: { id: id } });
            const dto = await DonationMapper.toDetailsDto(donationRecord);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = async (id: string, model: DonationDomainModel): Promise<DonationDto> => {
        try {
            const donationRecord = await Donation.findOne({ where: { id: id } });

            if (model.PatientUserId != null) {
                donationRecord.PatientUserId = model.PatientUserId;
            }
            if (model.NetworkId != null) {
                donationRecord.NetworkId = model.NetworkId;
            }
            if (model.EmergencyDonor != null) {
                donationRecord.EmergencyDonor = model.EmergencyDonor;
            }
            if (model.VolunteerOfEmergencyDonor != null) {
                donationRecord.VolunteerOfEmergencyDonor = model.VolunteerOfEmergencyDonor;
            }
            if (model.RequestedQuantity != null) {
                donationRecord.RequestedQuantity = model.RequestedQuantity;
            }
            if (model.RequestedDate != null) {
                donationRecord.RequestedDate = model.RequestedDate;
            }
            if (model.DonorAcceptedDate != null) {
                donationRecord.DonorAcceptedDate = model.DonorAcceptedDate;
            }
            if (model.DonorRejectedDate != null) {
                donationRecord.DonorRejectedDate = model.DonorRejectedDate;
            }
            if (model.DonationDate != null) {
                donationRecord.DonationDate = model.DonationDate;
            }
            if (model.DonatedQuantity != null) {
                donationRecord.DonatedQuantity = model.DonatedQuantity;
            }
            if (model.DonationType != null) {
                donationRecord.DonationType = model.DonationType;
            }

            await donationRecord.save();

            const dto = await DonationMapper.toDetailsDto(donationRecord);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DonationSearchFilters): Promise<DonationSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            let IsPatientDonorsRequired = false;
            if (filters.DonorUserId || filters.VolunteerUserId || filters.Name || filters.BloodGroup || filters.Status) {
                IsPatientDonorsRequired = true;
            }

            const includesObj =
            {
                model    : Bridge,
                required : IsPatientDonorsRequired,
                where    : {
                },
            };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] =  filters.PatientUserId;
            }
            if (filters.NetworkId != null) {
                search.where['NetworkId'] =  filters.NetworkId;
            }
            if (filters.EmergencyDonor != null) {
                search.where['EmergencyDonor'] =  filters.EmergencyDonor;
            }
            if (filters.VolunteerOfEmergencyDonor != null) {
                search.where['VolunteerOfEmergencyDonor'] =  filters.VolunteerOfEmergencyDonor;
            }
            if (filters.DonorUserId != null) {
                includesObj.where['DonorUserId'] =  filters.DonorUserId;
            }
            if (filters.VolunteerUserId != null) {
                includesObj.where['VolunteerUserId'] = filters.VolunteerUserId;
            }
            if (filters.Name != null) {
                includesObj.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.BloodGroup != null) {
                includesObj.where['BloodGroup'] = { [Op.substring]: '%' + filters.BloodGroup + '%' };
            }
            if (filters.Status != null) {
                includesObj.where['Status'] = filters.Status;
            }

            if (filters.RequestedDateFrom != null && filters.RequestedDateTo != null) {
                search.where['RequestedDate'] = {
                    [Op.gte] : filters.RequestedDateFrom,
                    [Op.lte] : filters.RequestedDateTo,
                };
            }
            else if (filters.RequestedDateFrom == null && filters.RequestedDateTo != null) {
                search.where['RequestedDate'] = {
                    [Op.lte] : filters.RequestedDateTo,
                };
            }
            else if (filters.RequestedDateFrom != null && filters.RequestedDateTo == null) {
                search.where['RequestedDate'] = {
                    [Op.gte] : filters.RequestedDateFrom,
                };
            }

            if (filters.DonationDateFrom != null && filters.DonationDateTo != null) {
                search.where['DonationDate'] = {
                    [Op.gte] : filters.DonationDateFrom,
                    [Op.lte] : filters.RequestedDateTo,
                };
            }
            else if (filters.DonationDateFrom == null && filters.DonationDateTo != null) {
                search.where['DonationDate'] = {
                    [Op.lte] : filters.DonationDateTo,
                };
            }
            else if (filters.DonationDateFrom != null && filters.DonationDateTo == null) {
                search.where['DonationDate'] = {
                    [Op.gte] : filters.DonationDateFrom,
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
                const patientDonorsAttributes = ['Name', 'BloodGroup', 'Status', 'PatientUserId'];
                const isPersonColumn = patientDonorsAttributes.includes(filters.OrderBy);
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

            const foundResults = await Donation.findAndCountAll(search);

            const dtos: DonationDto[] = [];
            for (const donationRecord of foundResults.rows) {
                const dto = await DonationMapper.toDetailsDto(donationRecord);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: DonationSearchResults = {
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
            const count = await Donation.destroy({
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

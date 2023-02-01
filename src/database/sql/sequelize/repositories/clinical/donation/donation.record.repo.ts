import { Logger } from "../../../../../../common/logger";
import { ApiError } from "../../../../../../common/api.error";
import { Op } from 'sequelize';
import { IDonationRecordRepo } from "../../../../../../database/repository.interfaces/clinical/donation/donation.record.repo.interface";
import { DonationRecordDomainModel } from "../../../../../../domain.types/clinical/donation.record/donation.record.domain.model";
import { DonationRecordDto } from "../../../../../../domain.types/clinical/donation.record/donation.record.dto";
import DonationRecord from "../../../models/clinical/donation/donation.record.model";
import { DonationRecordMapper } from "../../../mappers/clinical/donation/donation.record.mapper";
import { DonationRecordSearchFilters, DonationRecordSearchResults } from "../../../../../../domain.types/clinical/donation.record/donation.record.search.types";
import PatientDonors from "../../../models/clinical/donation/patient.donors.model";

///////////////////////////////////////////////////////////////////////////////////

export class DonationRecordRepo implements IDonationRecordRepo {

    create = async (donationRecordDomainModel: DonationRecordDomainModel): Promise<DonationRecordDto> => {

        try {
            const entity = {
                PatientUserId             : donationRecordDomainModel.PatientUserId,
                NetworkId                 : donationRecordDomainModel.NetworkId,
                EmergencyDonor            : donationRecordDomainModel.EmergencyDonor,
                VolunteerOfEmergencyDonor : donationRecordDomainModel.VolunteerOfEmergencyDonor,
                RequestedQuantity         : donationRecordDomainModel.RequestedQuantity,
                RequestedDate             : donationRecordDomainModel.RequestedDate,
                DonatedQuantity           : donationRecordDomainModel.DonatedQuantity,
                DonationDate              : donationRecordDomainModel.DonationDate,
                DonationType              : donationRecordDomainModel.DonationType
            };

            const donationRecord = await DonationRecord.create(entity);
            const dto = await DonationRecordMapper.toDetailsDto(donationRecord);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DonationRecordDto> => {
        try {
            const donationRecord = await DonationRecord.findOne({ where: { id: id } });
            const dto = await DonationRecordMapper.toDetailsDto(donationRecord);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = async (id: string, model: DonationRecordDomainModel): Promise<DonationRecordDto> => {
        try {
            const donationRecord = await DonationRecord.findOne({ where: { id: id } });

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

            const dto = await DonationRecordMapper.toDetailsDto(donationRecord);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DonationRecordSearchFilters): Promise<DonationRecordSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            let IsPatientDonorsRequired = false;
            if (filters.DonorUserId || filters.VolunteerUserId || filters.Name || filters.BloodGroup || filters.Status) {
                IsPatientDonorsRequired = true;
            }

            const includesObj =
            {
                model    : PatientDonors,
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

            const foundResults = await DonationRecord.findAndCountAll(search);

            const dtos: DonationRecordDto[] = [];
            for (const donationRecord of foundResults.rows) {
                const dto = await DonationRecordMapper.toDetailsDto(donationRecord);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: DonationRecordSearchResults = {
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
            const count = await DonationRecord.destroy({
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

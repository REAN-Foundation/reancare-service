import { Logger } from "../../../../../../common/logger";
import { ApiError } from "../../../../../../common/api.error";
import DonationCommunication from "../../../models/clinical/donation/donation.communication.model";
import { IDonationCommunicationRepo } from "../../../../../../database/repository.interfaces/clinical/donation/donation.communication.repo.interface";
import { DonationCommunicationDto } from "../../../../../../domain.types/clinical/donation.communication/donation.communication.dto";
import { DonationCommunicationDomainModel } from "../../../../../../domain.types/clinical/donation.communication/donation.communication.domain.model";
import { DonationCommunicationSearchFilters, DonationCommunicationSearchResults } from "../../../../../../domain.types/clinical/donation.communication/donation.communication.search.types";
import { DonationCommunicationMapper } from "../../../mappers/clinical/donation/donation.communication.mapper";

///////////////////////////////////////////////////////////////////////////////////

export class DonationCommunicationRepo implements IDonationCommunicationRepo {

    create = async (donationCommunicationDomainModel: DonationCommunicationDomainModel) :
        Promise<DonationCommunicationDto> => {

        try {
            const entity = {
                PatientUserId             : donationCommunicationDomainModel.PatientUserId,
                DonorUserId               : donationCommunicationDomainModel.DonorUserId,
                VolunteerUserId           : donationCommunicationDomainModel.VolunteerUserId,
                FifthDayReminderFlag      : donationCommunicationDomainModel.FifthDayReminderFlag,
                DonorNoResponseFirstFlag  : donationCommunicationDomainModel.DonorNoResponseFirstFlag,
                DonorNoResponseSecondFlag : donationCommunicationDomainModel.DonorNoResponseSecondFlag,
                DonorAcceptance           : donationCommunicationDomainModel.DonorAcceptance,
                IsRemindersLoaded         : donationCommunicationDomainModel.IsRemindersLoaded,
            };

            let donationCommunication = null;
            var existingRecord = await this.getByPatientUserId(entity.PatientUserId);
            if (existingRecord !== null) {
                donationCommunication = await this.update(existingRecord.id, entity);
            } else {
                donationCommunication = await DonationCommunication.create(entity);
            }

            const dto = await DonationCommunicationMapper.toDetailsDto(donationCommunication);
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DonationCommunicationDto> => {
        try {
            const donationCommunication = await DonationCommunication.findOne({ where: { id: id } });
            const dto = await DonationCommunicationMapper.toDetailsDto(donationCommunication);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = async (id: string, model: DonationCommunicationDomainModel): Promise<DonationCommunicationDto> => {
        try {
            const donationCommunication = await DonationCommunication.findOne({ where: { id: id } });

            if (model.PatientUserId != null) {
                donationCommunication.PatientUserId = model.PatientUserId;
            }
            if (model.DonorUserId != null) {
                donationCommunication.DonorUserId = model.DonorUserId;
            }
            if (model.VolunteerUserId != null) {
                donationCommunication.VolunteerUserId = model.VolunteerUserId;
            }
            if (model.FifthDayReminderFlag != null) {
                donationCommunication.FifthDayReminderFlag = model.FifthDayReminderFlag;
            }
            if (model.DonorNoResponseFirstFlag != null) {
                donationCommunication.DonorNoResponseFirstFlag = model.DonorNoResponseFirstFlag;
            }
            if (model.DonorNoResponseSecondFlag != null) {
                donationCommunication.DonorNoResponseSecondFlag = model.DonorNoResponseSecondFlag;
            }
            if (model.DonorAcceptance != null) {
                donationCommunication.DonorAcceptance = model.DonorAcceptance;
            }
            if (model.IsRemindersLoaded != null) {
                donationCommunication.IsRemindersLoaded = model.IsRemindersLoaded;
            }

            await donationCommunication.save();

            const dto = await DonationCommunicationMapper.toDetailsDto(donationCommunication);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DonationCommunicationSearchFilters): Promise<DonationCommunicationSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] =  filters.PatientUserId;
            }
            if (filters.DonorUserId != null) {
                search.where['DonorUserId'] =  filters.DonorUserId;
            }
            if (filters.VolunteerUserId != null) {
                search.where['VolunteerUserId'] =  filters.VolunteerUserId;
            }
            if (filters.FifthDayReminderFlag != null) {
                search.where['FifthDayReminderFlag'] =  filters.FifthDayReminderFlag;
            }
            if (filters.DonorNoResponseFirstFlag != null) {
                search.where['DonorNoResponseFirstFlag'] =  filters.DonorNoResponseFirstFlag;
            }
            if (filters.DonorNoResponseSecondFlag != null) {
                search.where['DonorNoResponseSecondFlag'] =  filters.DonorNoResponseSecondFlag;
            }
            if (filters.DonorAcceptance != null) {
                search.where['DonorAcceptance'] =  filters.DonorAcceptance;
            }
            if (filters.IsRemindersLoaded != null) {
                search.where['DonorNoResponseSecondFlag'] =  filters.IsRemindersLoaded;
            }

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

            const foundResults = await DonationCommunication.findAndCountAll(search);

            const dtos: DonationCommunicationDto[] = [];
            for (const DonationCommunication of foundResults.rows) {
                const dto = await DonationCommunicationMapper.toDetailsDto(DonationCommunication);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: DonationCommunicationSearchResults = {
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
            const count = await DonationCommunication.destroy({
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

    getByPatientUserId = async (patientUserId: string): Promise<DonationCommunicationDto> => {
        try {
            const donationCommunication = await DonationCommunication.findOne({ where: { PatientUserId: patientUserId } });
            const dto = await DonationCommunicationMapper.toDetailsDto(donationCommunication);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

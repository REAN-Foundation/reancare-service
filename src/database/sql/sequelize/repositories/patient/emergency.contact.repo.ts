import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { EmergencyContactDomainModel } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactDto } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.dto';
import { EmergencyContactSearchFilters, EmergencyContactSearchResults } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.search.types';
import { IEmergencyContactRepo } from '../../../../repository.interfaces/patient/emergency.contact.repo.interface';
import { EmergencyContactMapper } from '../../mappers/patient/emergency.contact.mapper';
import EmergencyContact from '../../models/patient/emergency.contact.model';

///////////////////////////////////////////////////////////////////////

export class EmergencyContactRepo implements IEmergencyContactRepo {

    create = async (contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        try {
            const entity = {
                PatientUserId           : contactDomainModel.PatientUserId,
                ContactPersonId         : contactDomainModel.ContactPersonId ?? null,
                ContactRelation         : contactDomainModel.ContactRelation,
                AddressId               : contactDomainModel.AddressId ?? null,
                OrganizationId          : contactDomainModel.OrganizationId ?? null,
                IsAvailableForEmergency : contactDomainModel.IsAvailableForEmergency ?? null,
                TimeOfAvailability      : contactDomainModel.TimeOfAvailability ?? null,
                Description             : contactDomainModel.Description ?? null,
                AdditionalPhoneNumbers  : contactDomainModel.AdditionalPhoneNumbers ?? null,
            };
            const contact = await EmergencyContact.create(entity);
            const dto = await EmergencyContactMapper.toDto(contact);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<EmergencyContactDto> => {
        try {
            const contact = await EmergencyContact.findOne({
                where : {
                    id : id
                }
            });
            const dto = await EmergencyContactMapper.toDto(contact);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    checkIfContactPersonExists = async (patientUserId: string, contactPersonId: string)
        : Promise<boolean> => {
        try {
            const contact = await EmergencyContact.findOne({
                where : {
                    PatientUserId   : patientUserId,
                    ContactPersonId : contactPersonId
                }
            });
            return contact !== null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getContactsCountWithRole = async (patientUserId: string, contactRole: string)
        : Promise<number> => {
        try {
            return await EmergencyContact.count({
                where : {
                    PatientUserId   : patientUserId,
                    ContactRelation : { [Op.like]: '%' + contactRole + '%' }
                }
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: EmergencyContactSearchFilters): Promise<EmergencyContactSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.ContactPersonId != null) {
                search.where['ContactPersonId'] = filters.ContactPersonId;
            }
            if (filters.IsAvailableForEmergency != null) {
                search.where['IsAvailableForEmergency'] = filters.IsAvailableForEmergency;
            }
            if (filters.ContactRelation != null) {
                search.where['ContactRelation'] = { [Op.like]: '%' + filters.ContactRelation + '%' };
            }

            let orderByColum = 'IsAvailableForEmergency';
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

            const foundResults = await EmergencyContact.findAndCountAll(search);

            const dtos: EmergencyContactDto[] = [];
            for (const contact of foundResults.rows) {
                const dto = await EmergencyContactMapper.toDto(contact);
                dtos.push(dto);
            }

            const searchResults: EmergencyContactSearchResults = {
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

    update = async (id: string, contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        try {
            const contact = await EmergencyContact.findByPk(id);

            if (contactDomainModel.PatientUserId != null) {
                contact.PatientUserId = contactDomainModel.PatientUserId;
            }
            if (contactDomainModel.ContactPersonId != null) {
                contact.ContactPersonId = contactDomainModel.ContactPersonId;
            }
            if (contactDomainModel.ContactRelation != null) {
                contact.ContactRelation = contactDomainModel.ContactRelation;
            }
            if (contactDomainModel.AddressId != null) {
                contact.AddressId = contactDomainModel.AddressId;
            }
            if (contactDomainModel.OrganizationId != null) {
                contact.OrganizationId = contactDomainModel.OrganizationId;
            }
            if (contactDomainModel.IsAvailableForEmergency != null) {
                contact.IsAvailableForEmergency = contactDomainModel.IsAvailableForEmergency;
            }
            if (contactDomainModel.TimeOfAvailability != null) {
                contact.TimeOfAvailability = contactDomainModel.TimeOfAvailability;
            }
            if (contactDomainModel.Description != null) {
                contact.Description = contactDomainModel.Description;
            }
            if (contactDomainModel.AdditionalPhoneNumbers != null) {
                contact.AdditionalPhoneNumbers = contactDomainModel.AdditionalPhoneNumbers;
            }
            await contact.save();

            const dto = await EmergencyContactMapper.toDto(contact);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await EmergencyContact.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

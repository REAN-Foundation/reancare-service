import { PersonDomainModel } from "../../../../domain.types/person/person.domain.model";
import { IPersonRepo } from "../../../repository.interfaces/person.repo.interface";
import Person from '../models/person.model';
import { PersonMapper } from "../mappers/person.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from 'sequelize';
import PersonRole from "../models/person.role.model";
import { PersonDetailsDto, PersonDto } from "../../../../domain.types/person/person.dto";
import { OrganizationDto } from "../../../../domain.types/organization/organization.dto";
import { AddressDto } from "../../../../domain.types/address/address.dto";
import OrganizationPersons from "../models/organization.persons.model";
import { OrganizationMapper } from "../mappers/organization.mapper";
import { AddressMapper } from "../mappers/address.mapper";
import PersonAddresses from "../models/person.addresses.model";
import Organization from "../models/organization.model";
import Address from "../models/address.model";

///////////////////////////////////////////////////////////////////////////////////

export class PersonRepo implements IPersonRepo {

    personNameExists = async (personName: string): Promise<boolean> => {
        if (personName != null && typeof personName !== 'undefined') {
            const existing = await Person.findOne({ where: { PersonName: personName } });
            return existing != null;
        }
        return false;
    }

    personExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone != null && typeof phone !== 'undefined') {
            const existing = await Person.findOne({ where: { Phone: phone } });
            return existing != null;
        }
        return false;
    };

    getPersonWithPhone = async (phone: string): Promise<PersonDetailsDto> => {
        if (phone != null && typeof phone !== 'undefined') {
            const person = await Person.findOne({ where: { Phone: phone } });
            return await PersonMapper.toDetailsDto(person);
        }
        return null;
    };

    getAllPersonsWithPhoneAndRole = async (phone: string, roleId: number): Promise<PersonDetailsDto[]> => {
        if (phone != null && typeof phone !== 'undefined') {

            //KK: To be optimized with associations

            const personsWithRole: PersonDetailsDto[] = [];
            const persons = await Person.findAll({ where: { Phone: phone } });
            for await (const person of persons) {
                const withRole = await PersonRole.findOne({ where: { PersonId: person.id, RoleId: roleId } });
                if (withRole != null) {
                    const dto = await PersonMapper.toDetailsDto(person);
                    personsWithRole.push(dto);
                }
            }
            return personsWithRole;
        }
        return null;
    };

    personExistsWithEmail = async (email: string): Promise<boolean> => {
        if (email != null && typeof email !== 'undefined') {
            const existing = await Person.findOne({ where: { Email: email } });
            return existing != null;
        }
        return false;
    };

    getPersonWithEmail = async (email: string): Promise<PersonDetailsDto> => {
        if (email != null && typeof email !== 'undefined') {
            const person = await Person.findOne({ where: { Email: email } });
            return await PersonMapper.toDetailsDto(person);
        }
        return null;
    };

    personExistsWithPersonname = async (personName: string): Promise<boolean> => {
        if (personName != null && typeof personName !== 'undefined') {
            const existing = await Person.findOne({
                where : {
                    PersonName : { [Op.like]: '%' + personName + '%' }
                },
            });
            return existing != null;
        }
        return false;
    };

    create = async (personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {
        try {
            const entity = {
                Prefix          : personDomainModel.Prefix ?? '',
                FirstName       : personDomainModel.FirstName,
                MiddleName      : personDomainModel.MiddleName ?? null,
                LastName        : personDomainModel.LastName,
                Phone           : personDomainModel.Phone,
                Email           : personDomainModel.Email ?? null,
                Gender          : personDomainModel.Gender ?? 'Unknown',
                BirthDate       : personDomainModel.BirthDate ?? null,
                ImageResourceId : personDomainModel.ImageResourceId ?? null,
            };
            const person = await Person.create(entity);
            const dto = await PersonMapper.toDetailsDto(person);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PersonDetailsDto> => {
        try {
            const person = await Person.findOne({ where: { id: id } });
            const dto = await PersonMapper.toDetailsDto(person);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    exists = async (id: string): Promise<boolean> => {
        try {
            const person = await Person.findOne({ where: { id: id } });
            return person != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {
        try {
            const person = await Person.findOne({ where: { id: id } });

            if (personDomainModel.Prefix != null) {
                person.Prefix = personDomainModel.Prefix;
            }
            if (personDomainModel.FirstName != null) {
                person.FirstName = personDomainModel.FirstName;
            }
            if (personDomainModel.LastName != null) {
                person.LastName = personDomainModel.LastName;
            }
            if (personDomainModel.Phone != null) {
                person.Phone = personDomainModel.Phone;
            }
            if (personDomainModel.Email != null) {
                person.Email = personDomainModel.Email;
            }
            if (personDomainModel.Gender != null) {
                person.Gender = personDomainModel.Gender;
            }
            if (personDomainModel.BirthDate != null) {
                person.BirthDate = personDomainModel.BirthDate;
            }
            if (personDomainModel.ImageResourceId != null) {
                person.ImageResourceId = personDomainModel.ImageResourceId;
            }
            await person.save();

            const dto = await PersonMapper.toDetailsDto(person);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Person.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    search(filters: any): Promise<PersonDto[]> {
        throw new Error('Method not implemented.');
    }

    getOrganizations = async (id: string): Promise<OrganizationDto[]> => {
        try {
            const organizationPersons = await OrganizationPersons.findAll({
                where : {
                    PersonId : id
                },
                include : [
                    {
                        model : Organization
                    }
                ]
            });
            const list = organizationPersons.map(x => x.Organization);
            const organizations = list.map(y => OrganizationMapper.toDto(y));
            return organizations;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    addAddress = async (id: string, addressId: string): Promise<boolean> => {
        try {
            const personAddresses = await PersonAddresses.findAll({
                where : {
                    AddressId : addressId,
                    PersonId  : id
                }
            });
            if (personAddresses.length > 0) {
                return false;
            }
            var entity = await PersonAddresses.create({
                AddressId : addressId,
                PersonId  : id
            });
            return entity != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
    removeAddress = async (id: string, addressId: string): Promise<boolean> => {
        try {
            var result = await PersonAddresses.destroy({
                where : {
                    AddressId : addressId,
                    PersonId  : id
                }
            });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getAddresses = async (id: string): Promise<AddressDto[]> => {
        try {
            var personAddresses = await PersonAddresses.findAll({
                where : {
                    PersonId : id
                },
                include : [
                    {
                        model : Address
                    }
                ]
            });
            var list = personAddresses.map(x => x.Address);
            var addresses = list.map(y => AddressMapper.toDto(y));
            return addresses;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

}

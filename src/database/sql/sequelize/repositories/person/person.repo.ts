import { Op } from 'sequelize';
import { ApiError } from "../../../../../common/api.error";
import { Helper } from "../../../../../common/helper";
import { Logger } from "../../../../../common/logger";
import { AddressDto } from "../../../../../domain.types/general/address/address.dto";
import { OrganizationDto } from "../../../../../domain.types/general/organization/organization.dto";
import { PersonDomainModel } from "../../../../../domain.types/person/person.domain.model";
import { PersonDetailsDto, PersonDto } from "../../../../../domain.types/person/person.dto";
import { IPersonRepo } from "../../../../repository.interfaces/person/person.repo.interface";
import { AddressMapper } from "../../mappers/general/address.mapper";
import { OrganizationMapper } from "../../mappers/general/organization.mapper";
import { PersonMapper } from "../../mappers/person/person.mapper";
import { Gender } from "../../../../../domain.types/miscellaneous/system.types";
import Address from "../../models/general/address.model";
import Organization from "../../models/general/organization/organization.model";
import OrganizationPersons from "../../models/general/organization/organization.persons.model";
import PersonAddresses from "../../models/person/person.addresses.model";
import Person from '../../models/person/person.model';
import PersonRole from "../../models/person/person.role.model";

///////////////////////////////////////////////////////////////////////////////////

export class PersonRepo implements IPersonRepo {

    personNameExists = async (personName: string): Promise<boolean> => {
        if (personName != null && typeof personName !== 'undefined') {
            const existing = await Person.findOne({ where: { PersonName: personName } });
            return existing != null;
        }
        return false;
    };

    personExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone != null && typeof phone !== 'undefined') {
            var possiblePhoneNumbers = Helper.getPossiblePhoneNumbers(phone);
            var persons = await Person.findAll({
                where : {
                    Phone : { [Op.in] : possiblePhoneNumbers,
                    }
                }
            });
            return persons.length > 0;
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
            var possiblePhoneNumbers = Helper.getPossiblePhoneNumbers(phone);
            var persons = await Person.findAll({
                where : {
                    Phone : { [Op.in] : possiblePhoneNumbers,
                    }
                }
            });

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
                Prefix                    : personDomainModel.Prefix ?? '',
                FirstName                 : personDomainModel.FirstName,
                MiddleName                : personDomainModel.MiddleName ?? null,
                LastName                  : personDomainModel.LastName,
                Phone                     : personDomainModel.Phone,
                Email                     : personDomainModel.Email ?? null,
                TelegramChatId            : personDomainModel.TelegramChatId ?? null,
                Gender                    : personDomainModel.Gender ?? 'Unknown',
                SelfIdentifiedGender      : personDomainModel.SelfIdentifiedGender ?? null,
                MaritalStatus             : personDomainModel.MaritalStatus ?? null,
                Race                      : personDomainModel.Race ?? null,
                Ethnicity                 : personDomainModel.Ethnicity ?? null,
                BirthDate                 : personDomainModel.BirthDate ?? null,
                Age                       : personDomainModel.Age,
                StrokeSurvivorOrCaregiver : personDomainModel.StrokeSurvivorOrCaregiver ?? null,
                LivingAlone               : personDomainModel.LivingAlone ?? null,
                WorkedPriorToStroke       : personDomainModel.WorkedPriorToStroke ?? null,
                ImageResourceId           : personDomainModel.ImageResourceId ?? null,
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
            if (personDomainModel.TelegramChatId != null) {
                person.TelegramChatId = personDomainModel.TelegramChatId;
            }
            if (personDomainModel.Gender != null) {
                person.Gender = Helper.getEnumKeyFromValue(Gender, personDomainModel.Gender);
            }
            if (personDomainModel.SelfIdentifiedGender != null) {
                person.SelfIdentifiedGender = personDomainModel.SelfIdentifiedGender;
            }
            if (personDomainModel.Age != null) {
                person.Age = personDomainModel.Age;
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
        const dtos: PersonDto[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve(dtos);
        });
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
            return list.map(y => OrganizationMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

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
    };

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
    };

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
            return list.map(y => AddressMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

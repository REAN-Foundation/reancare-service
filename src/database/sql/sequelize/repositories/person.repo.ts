import { PersonDomainModel } from "../../../../domain.types/person/person.domain.model";
import { IPersonRepo } from "../../../repository.interfaces/person.repo.interface";
import Person from '../models/person.model';
import { PersonMapper } from "../mappers/person.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from 'sequelize';
import PersonRole from "../models/person.role.model";
import { PersonDetailsDto, PersonDto } from "../../../../domain.types/person/person.dto";

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

}

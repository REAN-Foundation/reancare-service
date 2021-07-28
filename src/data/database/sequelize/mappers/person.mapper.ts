import { PersonDetailsDto, PersonDto } from "../../../domain.types/person.domain.types";
import { PersonRoleRepo } from "../repositories/person.role.repo";
import { PersonRepo } from '../repositories/person.repo'
import Person from '../models/person.model';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export class PersonMapper {

    static toDetailsDto = async (person: Person): Promise<PersonDetailsDto> => {

        if(person == null){
            return null;
        }

        var displayName: string = Helper.constructPersonDisplayName(
            person.Prefix,
            person.FirstName,
            person.LastName
        );

        const age = Helper.getAgeFromBirthDate(person.BirthDate);

        var personRoleRepo = new PersonRoleRepo();
        const personRoles = await personRoleRepo.getPersonRoles(person.id);

        var dto: PersonDetailsDto = {
            id: person.id,
            Prefix: person.Prefix,
            FirstName: person.FirstName,
            MiddleName: person.MiddleName,
            LastName: person.LastName,
            DisplayName: displayName,
            Gender: Helper.getGender(person.Gender),
            BirthDate: person.BirthDate,
            Age: age,
            Phone: person.Phone,
            Email: person.Email,
            ImageResourceId: person.ImageResourceId,
            ActiveSince: person.CreateAt,
            IsActive: person.IsActive,
            Roles: personRoles
        };
        return dto;
    }

    toDto = (person: Person) => {

        if(person == null){
            return null;
        }
        
        var prefix = person.Prefix ? (person.Prefix + ' ') : '';
        var firstName = person.FirstName ? (person.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + person.LastName ?? '';
        const age = Helper.getAgeFromBirthDate(person.BirthDate);

        var dto: PersonDto = {
            id: person.id,
            DisplayName: displayName,
            Gender: Helper.getGender(person.Gender),
            BirthDate: person.BirthDate,
            Phone: person.Phone,
            Email: person.Email,
        };
        return dto;
    }

}
import { PersonDetailsDto, PersonDto } from "../../../domain.types/person.domain.types";
import { PersonRoleRepo } from "../repositories/person.role.repo";
import Person from '../models/person.model';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export class PersonMapper {

    static toDetailsDto = async (person: Person): Promise<PersonDetailsDto> => {

        if (person == null){
            return null;
        }

        const displayName: string = Helper.constructPersonDisplayName(
            person.Prefix,
            person.FirstName,
            person.LastName
        );

        const age = Helper.getAgeFromBirthDate(person.BirthDate);

        const personRoleRepo = new PersonRoleRepo();
        const personRoles = await personRoleRepo.getPersonRoles(person.id);

        const dto: PersonDetailsDto = {
            id              : person.id,
            Prefix          : person.Prefix,
            FirstName       : person.FirstName,
            MiddleName      : person.MiddleName,
            LastName        : person.LastName,
            DisplayName     : displayName,
            Gender          : Helper.getGender(person.Gender),
            BirthDate       : person.BirthDate,
            Age             : age,
            Phone           : person.Phone,
            Email           : person.Email,
            ImageResourceId : person.ImageResourceId,
            ActiveSince     : person.CreatedAt,
            Roles           : personRoles
        };
        return dto;
    }

    toDto = (person: Person) => {

        if (person == null){
            return null;
        }
        
        const prefix = person.Prefix ? (person.Prefix + ' ') : '';
        const firstName = person.FirstName ? (person.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + person.LastName ?? '';
        
        //const age = Helper.getAgeFromBirthDate(person.BirthDate);

        const dto: PersonDto = {
            id          : person.id,
            DisplayName : displayName,
            Gender      : Helper.getGender(person.Gender),
            BirthDate   : person.BirthDate,
            Phone       : person.Phone,
            Email       : person.Email,
        };
        return dto;
    }

}

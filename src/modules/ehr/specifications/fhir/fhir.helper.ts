import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';

////////////////////////////////////////////////////////////////////////

export class FhirHelper {

    static getPersonFhirName = (person: PersonDomainModel) => {

        var givenNames = [];

        if (person.FirstName != null) {
            givenNames.push(person.FirstName);
        } else {
            givenNames.push('');
        }
        if (person.MiddleName != null) {
            givenNames.push(person.MiddleName);
        } else {
            givenNames.push('');
        }

        var familyName = person.LastName != null ? person.LastName : '';
        var prefixes = [];
        if (person.Prefix != null) {
            prefixes.push(person.Prefix);
        }

        var nameObj = {
            use    : "official",
            given  : givenNames,
            family : familyName,
            prefix : prefixes
        };
        return nameObj;
    };
    
}

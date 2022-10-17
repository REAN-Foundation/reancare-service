import { AddressDomainModel } from '../../general/address/address.domain.model';
import { HealthcareServiceSchedule } from '../../healthcare.service/healthcare.service.domain.types';
import { UserDomainModel } from '../user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export interface DoctorDomainModel {
    id?: string;
    UserId?: string;
    PersonId?: string;
    DisplayId?: string,
    EhrId?: string;
    NationalDigiDoctorId?:string;
    User?: UserDomainModel;
    About?: string;
    Locality?: string;
    Qualifications?: string;
    Specialities?: string[];
    PractisingSince?: Date;
    ProfessionalHighlights?: string[];
    AvailabilitySchedule?: HealthcareServiceSchedule;
    ConsultationFee?: number;
    AddressIds?: string[];
    Addresses?: AddressDomainModel[];
    OrganizationIds?: string[];
}

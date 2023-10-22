import { DonorDomainModel } from '../../../domain.types/assorted/blood.donation/donor/donor.domain.model';
import { DonorDetailsDto } from '../../../domain.types/assorted/blood.donation/donor/donor.dto';
import { DonorSearchFilters, DonorSearchResults } from '../../../domain.types/assorted/blood.donation/donor/donor.search.types';

export interface IDonorRepo {

    create(entity: DonorDomainModel): Promise<DonorDetailsDto>;

    getByUserId(userId: string): Promise<DonorDetailsDto>;

    updateByUserId(userId: string, updateModel: DonorDomainModel): Promise<DonorDetailsDto>;

    search(filters: DonorSearchFilters): Promise<DonorSearchResults>;

    deleteByUserId(userId: string): Promise<boolean>;

    // searchFull(filters: DoctorSearchFilters): Promise<DoctorDetailsSearchResults>;
}

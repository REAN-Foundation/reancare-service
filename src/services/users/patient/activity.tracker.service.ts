import { inject, injectable } from 'tsyringe';
import { ActivityTrackerDomainModel } from '../../../domain.types/users/patient/activity.tracker/activity.tracker.domain.model';
import { ActivityTrackerDto } from '../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';
import { IActivityTrackerRepo } from '../../../database/repository.interfaces/users/patient/activity.tracker.repo.interface';
import { ActivityTrackerSearchFilters } from '../../../domain.types/users/patient/activity.tracker/activity.tracker.search.types';
import { ActivityTrackerSearchResults } from '../../../domain.types/users/patient/activity.tracker/activity.tracker.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ActivityTrackerService {

    constructor(
        @inject('IActivityTrackerRepo') private _activityTrackerRepo: IActivityTrackerRepo,
        
    ) {}

    //#region Publics

    create = async (activityTrackerDomainModel: ActivityTrackerDomainModel): Promise<ActivityTrackerDto> => {

        var dto = await this._activityTrackerRepo.create(activityTrackerDomainModel);
        return dto;
    };

    getById = async (id: string): Promise<ActivityTrackerDto> => {
        return await this._activityTrackerRepo.getById(id);
    };

    update = async (id: string, activityTrackerDomainModel: ActivityTrackerDomainModel): Promise<ActivityTrackerDto> => {
        var dto = await this._activityTrackerRepo.update(id, activityTrackerDomainModel);
        return dto;
    };

     search = async (filters: ActivityTrackerSearchFilters): Promise<ActivityTrackerSearchResults> => {
         return await this._activityTrackerRepo.search(filters);
    
     };
    
    delete = async (id: string): Promise<boolean> => {
        return await this._activityTrackerRepo.delete(id);
    };
    
    //#endregion

}

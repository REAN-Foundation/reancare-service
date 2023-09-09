import { inject, injectable } from "tsyringe";
import { IUserEngagementRepo } from "../../database/repository.interfaces/statistics/user.engagement.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
// import { UserEngagementCategoryList } from "../../domain.types/statistics/user.engagement.types";
// import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserEngagementService {

    constructor(
        @inject('IUserEngagementRepo') private _userEngagementRepo: IUserEngagementRepo,
    ) {}

    public getUserEngagementStatsByYear = async (): Promise<any> => {
        return await this._userEngagementRepo.getUserEngagementStatsByYear();
    };

    public getUserEngagementStatsByQuarter = async (): Promise<any> => {
        return await this._userEngagementRepo.getUserEngagementStatsByQuarter();
    };

    public getUserEngagementStatsByMonth = async (): Promise<any> => {
        return await this._userEngagementRepo.getUserEngagementStatsByMonth();
    };

    public getUserEngagementStatsByWeek = async (): Promise<any> => {
        return await this._userEngagementRepo.getUserEngagementStatsByWeek();
    };

    public getUserEngagementStatsByDateRange = async (from: string, to: string): Promise<any> => {
        return await this._userEngagementRepo.getUserEngagementStatsByDateRange(from, to);
    };

    public getUserEngagementStatsForUser = async (userId: uuid): Promise<any> => {
        return await this._userEngagementRepo.getUserEngagementStatsForUser(userId);
    };

    public recordUserEngagementsForDay = async (): Promise<any> => {
        return await this._userEngagementRepo.recordUserEngagementsForDay();
    };

}

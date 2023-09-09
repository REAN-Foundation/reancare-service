import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface IUserEngagementRepo {

    getUserEngagementStatsByYear(): Promise<any>;

    getUserEngagementStatsByQuarter(): Promise<any>;

    getUserEngagementStatsByMonth(): Promise<any>;

    getUserEngagementStatsByWeek(): Promise<any>;

    getUserEngagementStatsByDateRange(from: string, to: string): Promise<any>;

    getUserEngagementStatsForUser(userId: uuid): Promise<any>;

    recordUserEngagementsForDay(): Promise<any>;
}

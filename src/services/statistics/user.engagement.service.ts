import { inject, injectable } from "tsyringe";
import { IUserEngagementRepo } from "../../database/repository.interfaces/statistics/user.engagement.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { UserEngagementCategoryList } from "../../domain.types/statistics/user.engagement.types";
import { Logger } from "../../common/logger";
import { IFoodConsumptionRepo } from "../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { IWaterConsumptionRepo } from "../../database/repository.interfaces/wellness/nutrition/water.consumption.repo.interface";
import { IPhysicalActivityRepo } from "../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { IMeditationRepo } from "../../database/repository.interfaces/wellness/exercise/meditation.repo.interface";
import { ISleepRepo } from "../../database/repository.interfaces/wellness/daily.records/sleep.repo.interface";
import { IStepCountRepo } from "../../database/repository.interfaces/wellness/daily.records/step.count.interface";
import { IUserLearningRepo } from "../../database/repository.interfaces/educational/learning/user.learning.repo.interface";
import { IChatRepo } from "../../database/repository.interfaces/community/chat.repo.interface";
import { IAssessmentRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { ICareplanRepo } from "../../database/repository.interfaces/clinical/careplan.repo.interface";
import { IBloodCholesterolRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.cholesterol.repo.interface";
import { IBloodGlucoseRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { IBloodPressureRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { IBodyTemperatureRepo } from "../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { IBodyWeightRepo } from "../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { IPulseRepo } from "../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";

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

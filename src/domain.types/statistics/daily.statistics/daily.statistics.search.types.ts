import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { DailyStatisticsDto } from "./daily.statistics.dto";

export interface DailyStatisticsSearchFilters extends BaseSearchFilters {
    id?:uuid
    StatisticsReportedDate?          : Date;
    CronSchedulerTime?               :Date;
   }

export interface DailyStatisticsSearchResults extends BaseSearchResults {
    Items : DailyStatisticsDto[];
}

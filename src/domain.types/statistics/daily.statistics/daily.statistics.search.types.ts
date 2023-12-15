import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { DailyStatisticsDto } from "./daily.statistics.dto";

export interface DailyStatisticsSearchFilters extends BaseSearchFilters {
    id?                             : uuid
    ReportDate?                     : Date;
    ReportTimestamp?                : Date;
   }

export interface DailyStatisticsSearchResults extends BaseSearchResults {
    Items : DailyStatisticsDto[];
}

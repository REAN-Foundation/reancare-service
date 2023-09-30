import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { CustomQueryDto } from "./custom.query.dto";

export interface CustomQuerySearchFilters extends BaseSearchFilters {
  Name?     : string;
  UserId?   : string;
  TenantId? : string;
  Tags?     : string[];
}

export interface CustomQuerySearchResults extends BaseSearchResults {
  Items : CustomQueryDto[];
}

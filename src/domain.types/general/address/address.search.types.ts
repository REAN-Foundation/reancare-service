import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { AddressDto } from "./address.dto";

export interface AddressSearchFilters extends BaseSearchFilters {
    Type?           : string;
    PersonId?       : string;
    OrganizationId? : string;
    AddressLine?    : string;
    City?           : string;
    District?       : string;
    State?          : string;
    Country?        : string;
    Location?       : string;
    PostalCode?     : string;
    LongitudeFrom?  : number;
    LongitudeTo     : number;
    LattitudeFrom?  : number;
    LattitudeTo     : number;
}

export interface AddressSearchResults extends BaseSearchResults {
    Items : AddressDto[];
}

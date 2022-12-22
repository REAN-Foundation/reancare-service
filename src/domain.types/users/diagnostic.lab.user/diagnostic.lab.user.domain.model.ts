import { AddressDomainModel } from "../../general/address/address.domain.model";
import { OrganizationDomainModel } from "../../general/organization/organization.domain.model";

export interface DiagnosticLabUserDomainModel {
    MiddleName?: any;
    id?: string;
    Prefix?: string;
    FirstName?: string;
    LastName?: string;
    Phone: string;
    Email?: string;
    Gender?: string;
    BirthDate?: Date;
    ImageURL?: string;
    Specialities?: string;
    Locality: string;
    Organizations?: OrganizationDomainModel[];
    Address: AddressDomainModel;
    //AppointmentDetails: AppointmentProvisionDomainModel;
}

export interface DiagnosticLabUserSearchFilters {
    Phone: string;
    Email: string;
    Name: string;
    BirthdateFrom: Date;
    BirthdateTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

//#endregion

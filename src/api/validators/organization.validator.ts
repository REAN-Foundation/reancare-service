import express from 'express';
import { OrganizationDomainModel } from '../../domain.types/organization/organization.domain.model';
import { OrganizationSearchFilters } from '../../domain.types/organization/organization.search.types';
import { BaseValidator, Where } from './base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationValidator extends BaseValidator {

    constructor(){
        super();
    }

    getDomainModel = (request: express.Request): OrganizationDomainModel => {
        const organizationModel: OrganizationDomainModel = {
            Type                             : request.body.Type ?? null,
            Name                             : request.body.Name ?? null,
            ContactUserId                    : request.body.ContactUserId ?? null,
            ContactPhone                     : request.body.ContactPhone ?? null,
            ContactEmail                     : request.body.ContactEmail ?? null,
            About                            : request.body.About ?? null,
            OperationalSince                 : request.body.OperationalSince ?? null,
            ParentOrganizationId             : request.body.ParentOrganizationId ?? null,
            AddressIds                       : request.body.AddressIds ?? null,
            ImageResourceId                  : request.body.ImageResourceId ?? null,
            IsHealthFacility                 : request.body.IsHealthFacility ?? null,
            NationalHealthFacilityRegistryId : request.body.NationalHealthFacilityRegistryId ?? null,
        };

        return organizationModel;
    };

    create = async (request: express.Request): Promise<OrganizationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, true);
        await this.validateUuid(request, 'ContactUserId', Where.Body, false, true);
        await this.validateString(request, 'ContactPhone', Where.Body, false, false);
        await this.validateString(request, 'ContactEmail', Where.Body, false, true);
        await this.validateUuid(request, 'ParentOrganizationId', Where.Body, false, true);
        await this.validateString(request, 'About', Where.Body, false, true);
        await this.validateDate(request, 'OperationalSince', Where.Body, false, true);
        await this.validateUuid(request, 'AddressId', Where.Body, false, false);
        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
        await this.validateBoolean(request, 'IsHealthFacility', Where.Body, false, true);
        await this.validateString(request, 'NationalHealthFacilityRegistryId', Where.Body, false, true);
        await this.validateString(request, 'orderBy', Where.Body, false, false);
        await this.validateString(request, 'order', Where.Body, false, false);
        await this.validateInt(request, 'pageIndex', Where.Body, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Body, false, false);

        this.validateRequest(request);
    }
    
    search = async (request: express.Request): Promise<OrganizationSearchFilters> => {

        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, true);
        await this.validateUuid(request, 'contactUserId', Where.Query, false, true);
        await this.validateString(request, 'contactPhone', Where.Body, false, false);
        await this.validateString(request, 'contactEmail', Where.Body, false, true);
        await this.validateUuid(request, 'parentOrganizationId', Where.Query, false, true);
        await this.validateString(request, 'about', Where.Query, false, true);
        await this.validateDate(request, 'operationalSinceFrom', Where.Query, false, true);
        await this.validateDate(request, 'operationalSinceTo', Where.Query, false, true);
        await this.validateString(request, 'location', Where.Query, false, false);
        await this.validateBoolean(request, 'isHealthFacility', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateString(request, 'orderBy', Where.Query, false, false);
        await this.validateString(request, 'order', Where.Query, false, false);
        await this.validateInt(request, 'pageIndex', Where.Query, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);
       
    };

    private getFilter(request): OrganizationSearchFilters {
        
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: OrganizationSearchFilters = {
            Type                 : request.query.type ?? null,
            Name                 : request.query.name ?? null,
            ContactPhone         : request.query.contactPhone ?? null,
            ContactEmail         : request.query.contactEmail ?? null,
            OperationalSinceFrom : request.query.operationalSinceFrom ?? null,
            OperationalSinceTo   : request.query.operationalSinceTo ?? null,
            CreatedDateFrom      : request.query.createdDateFrom ?? null,
            CreatedDateTo        : request.query.createdDateTo ?? null,
            OrderBy              : request.query.orderBy ?? 'CreatedAt',
            Order                : request.query.order ?? 'descending',
            PageIndex            : pageIndex,
            ItemsPerPage         : itemsPerPage,
        };
        return filters;
    }

    update = async (request: express.Request): Promise<OrganizationDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateUpdateBody (request){

        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, true);
        await this.validateUuid(request, 'ContactUserId', Where.Body, false, true);
        await this.validateString(request, 'ContactPhone', Where.Body, false, false);
        await this.validateString(request, 'ContactEmail', Where.Body, false, true);
        await this.validateUuid(request, 'ParentOrganizationId', Where.Body, false, true);
        await this.validateString(request, 'About', Where.Body, false, true);
        await this.validateDate(request, 'OperationalSince', Where.Body, false, true);
        await this.validateUuid(request, 'AddressId', Where.Body, false, false);
        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
        await this.validateBoolean(request, 'IsHealthFacility', Where.Body, false, true);
        await this.validateString(request, 'NationalHealthFacilityRegistryId', Where.Body, false, true);
        await this.validateString(request, 'orderBy', Where.Body, false, false);
        await this.validateString(request, 'order', Where.Body, false, false);
        await this.validateInt(request, 'pageIndex', Where.Body, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Body, false, false);

        this.validateRequest(request);
    }

    getByContactUserId = async (request: express.Request) => {
        await this.validateUuid(request, 'contactUserId', Where.Param, true, true);
        
        this.validateRequest(request);
        return request.params.contactUserId;
    };

    public async getParamId(request) {
        await this.validateUuid(request, 'id', Where.Param, true, false);
        
        this.validateRequest(request);
        return request.params.id;
    }

    addOrRemoveAddress = async (request: express.Request): Promise<{ id: string; addressId: string }> => {

        await this.validateUuid(request, 'id', Where.Param, true, false);
        await this.validateUuid(request, 'addressId', Where.Param, true, false);
    
        this.validateRequest(request);

        const id = request.params.id;
        const addressId = request.params.addressId;

        return { id, addressId };
    };

    addOrRemovePerson = async (request: express.Request): Promise<{ id: string; personId: string }> => {

        await this.validateUuid(request, 'id', Where.Param, true, false);
        await this.validateUuid(request, 'personId', Where.Param, true, false);

        this.validateRequest(request);

        const id = request.params.id;
        const personId = request.params.personId;

        return { id, personId };
    };

}
